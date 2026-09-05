<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/user-schema.php';
require_once __DIR__ . '/otp-helpers.php';
oauth_session_start(); ensure_user_auth_schema($pdo); ensure_otp_schema($pdo);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') otp_json(['ok'=>false,'error'=>'Method not allowed.'],405);
$input=json_decode(file_get_contents('php://input'),true) ?: []; $action=(string)($input['action'] ?? '');
try {
    if ($action === 'request') {
        $normalized=normalize_otp_destination((string)($input['destination'] ?? '')); $purpose=in_array(($input['purpose'] ?? 'login'),['login','password_reset'],true)?$input['purpose']:'login'; if($purpose==='password_reset' && $normalized['channel']!=='email') otp_json(['ok'=>false,'error'=>'Password reset is available by email only.'],422); $ipHash=otp_ip_hash();$sessionHash=otp_session_hash();
        $recent=$pdo->prepare('SELECT COUNT(*) FROM login_otps WHERE destination=? AND purpose=? AND created_at > (NOW() - INTERVAL 15 MINUTE)');$recent->execute([$normalized['destination'],$purpose]); if((int)$recent->fetchColumn()>=OTP_DESTINATION_LIMIT) otp_json(['ok'=>false,'error'=>'Too many codes requested. Please wait before trying again.'],429);
        $recentIp=$pdo->prepare('SELECT COUNT(*) FROM login_otps WHERE request_ip_hash=? AND created_at > (NOW() - INTERVAL 15 MINUTE)');$recentIp->execute([$ipHash]); if((int)$recentIp->fetchColumn()>=OTP_IP_LIMIT) otp_json(['ok'=>false,'error'=>'Too many code requests from this network. Please wait before trying again.'],429);
        $recentSession=$pdo->prepare('SELECT COUNT(*) FROM login_otps WHERE request_session_hash=? AND created_at > (NOW() - INTERVAL 15 MINUTE)');$recentSession->execute([$sessionHash]); if((int)$recentSession->fetchColumn()>=OTP_SESSION_LIMIT) otp_json(['ok'=>false,'error'=>'Too many code requests in this session. Please wait before trying again.'],429);
        $cooldown=$pdo->prepare('SELECT resend_after FROM login_otps WHERE destination=? AND purpose=? AND consumed_at IS NULL AND invalidated_at IS NULL ORDER BY id DESC LIMIT 1');$cooldown->execute([$normalized['destination'],$purpose]);$last=$cooldown->fetchColumn();if($last && strtotime((string)$last)>time()) otp_json(['ok'=>false,'error'=>'Please wait before requesting another code.','retry_after'=>strtotime((string)$last)-time()],429);
        $pdo->prepare('UPDATE login_otps SET invalidated_at=NOW() WHERE destination=? AND purpose=? AND consumed_at IS NULL AND invalidated_at IS NULL')->execute([$normalized['destination'],$purpose]);
        $code=str_pad((string)random_int(0,999999),6,'0',STR_PAD_LEFT); $insert=$pdo->prepare('INSERT INTO login_otps(destination,channel,purpose,code_hash,request_ip_hash,request_session_hash,expires_at,resend_after) VALUES(?,?,?,?,?,?,DATE_ADD(NOW(),INTERVAL 5 MINUTE),DATE_ADD(NOW(),INTERVAL 60 SECOND))');$insert->execute([$normalized['destination'],$normalized['channel'],$purpose,password_hash($code,PASSWORD_DEFAULT),$ipHash,$sessionHash]);
        try { otp_send($normalized['channel'],$normalized['destination'],$code); } catch(Throwable $deliveryError) { $pdo->prepare('UPDATE login_otps SET invalidated_at=NOW() WHERE id=?')->execute([(int)$pdo->lastInsertId()]); throw $deliveryError; }
        otp_json(['ok'=>true,'destination'=>otp_mask_destination($normalized['channel'],$normalized['destination']),'channel'=>$normalized['channel'],'expires_in'=>OTP_TTL_SECONDS,'resend_in'=>OTP_RESEND_SECONDS]);
    }
    if ($action === 'verify') {
        $normalized=normalize_otp_destination((string)($input['destination'] ?? ''));$code=(string)($input['code'] ?? '');$purpose=in_array(($input['purpose'] ?? 'login'),['login','password_reset'],true)?$input['purpose']:'login';if(!preg_match('/^\d{6}$/',$code)) otp_json(['ok'=>false,'error'=>'Enter the 6-digit code.'],422);
        $statement=$pdo->prepare('SELECT * FROM login_otps WHERE destination=? AND purpose=? AND consumed_at IS NULL AND invalidated_at IS NULL ORDER BY id DESC LIMIT 1');$statement->execute([$normalized['destination'],$purpose]);$otp=$statement->fetch(); if(!$otp || strtotime($otp['expires_at'])<time()){if($otp)$pdo->prepare('UPDATE login_otps SET invalidated_at=NOW() WHERE id=?')->execute([$otp['id']]);otp_json(['ok'=>false,'error'=>'This code has expired. Request a new code.'],422);}
        if((int)$otp['verification_attempts']>=OTP_MAX_ATTEMPTS){$pdo->prepare('UPDATE login_otps SET invalidated_at=NOW() WHERE id=?')->execute([$otp['id']]);otp_json(['ok'=>false,'error'=>'Too many incorrect attempts. Request a new code.'],429);}
        if(!password_verify($code,$otp['code_hash'])){$pdo->prepare('UPDATE login_otps SET verification_attempts=verification_attempts+1 WHERE id=?')->execute([$otp['id']]);otp_json(['ok'=>false,'error'=>'Incorrect code. Please try again.'],422);}
        $pdo->prepare('UPDATE login_otps SET consumed_at=NOW() WHERE id=?')->execute([$otp['id']]);
        if($purpose==='password_reset'){$_SESSION['password_reset_destination']=$normalized;$_SESSION['password_reset_at']=time();otp_json(['ok'=>true,'next'=>'reset_password']);}
        $field=$normalized['channel']==='email'?'email':'phone';$userStatement=$pdo->prepare("SELECT id,email,phone,role,name,company,role_confirmed FROM users WHERE {$field}=? LIMIT 1");$userStatement->execute([$normalized['destination']]);$user=$userStatement->fetch();
        if($user){session_regenerate_id(true);$_SESSION['user']=['id'=>(int)$user['id'],'email'=>$user['email'],'phone'=>$user['phone'],'role'=>$user['role'],'name'=>$user['name'],'company'=>$user['company'],'role_confirmed'=>(bool)$user['role_confirmed']];otp_json(['ok'=>true,'next'=>$_SESSION['user']['role_confirmed']?'signed_in':'role','user'=>$_SESSION['user']]);}
        $_SESSION['otp_signup']=['destination'=>$normalized['destination'],'channel'=>$normalized['channel'],'verified_at'=>time()];otp_json(['ok'=>true,'next'=>'profile']);
    }
    if ($action === 'complete_profile') {
        $pending=$_SESSION['otp_signup'] ?? null;if(!is_array($pending) || time()-(int)$pending['verified_at']>600) otp_json(['ok'=>false,'error'=>'Verify a new code before creating an account.'],401);
        $name=trim((string)($input['name'] ?? ''));$company=trim((string)($input['company'] ?? ''));$role=(string)($input['role'] ?? '');if(strlen($name)<2 || !in_array($role,['buyer','seller'],true)) otp_json(['ok'=>false,'error'=>'Enter your name and choose Buyer or Seller.'],422);
        $email=$pending['channel']==='email'?$pending['destination']:null;$phone=$pending['channel']==='sms'?$pending['destination']:null;$create=$pdo->prepare('INSERT INTO users(email,phone,password_hash,role,name,company,email_verified,phone_verified,role_confirmed) VALUES(?,?,?,?,?,?,?, ?,1)');$create->execute([$email,$phone,password_hash(bin2hex(random_bytes(32)),PASSWORD_DEFAULT),$role,$name,$company?:null,$email?1:0,$phone?1:0]);$id=(int)$pdo->lastInsertId();unset($_SESSION['otp_signup']);session_regenerate_id(true);$_SESSION['user']=['id'=>$id,'email'=>$email,'phone'=>$phone,'role'=>$role,'name'=>$name,'company'=>$company?:null,'role_confirmed'=>true];otp_json(['ok'=>true,'user'=>$_SESSION['user']]);
    }
    if ($action === 'reset_password') {
        $pending=$_SESSION['password_reset_destination'] ?? null;$password=(string)($input['password'] ?? '');if(!is_array($pending)||time()-(int)($_SESSION['password_reset_at']??0)>600)otp_json(['ok'=>false,'error'=>'Verify a reset code before setting a password.'],401);if($pending['channel']!=='email'||strlen($password)<8)otp_json(['ok'=>false,'error'=>'Use an email reset code and a password of at least 8 characters.'],422);$update=$pdo->prepare('UPDATE users SET password_hash=? WHERE email=?');$update->execute([password_hash($password,PASSWORD_DEFAULT),$pending['destination']]);unset($_SESSION['password_reset_destination'],$_SESSION['password_reset_at']);otp_json(['ok'=>true]);
    }
    otp_json(['ok'=>false,'error'=>'Unsupported OTP action.'],400);
} catch (InvalidArgumentException $error) { otp_json(['ok'=>false,'error'=>$error->getMessage()],422); } catch (Throwable $error) { otp_json(['ok'=>false,'error'=>$error->getMessage()],503); }
