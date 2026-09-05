<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/user-schema.php';
require_once __DIR__ . '/oauth-helpers.php';
oauth_session_start();
$state = (string)($_GET['state'] ?? ''); $saved = $_SESSION['oauth_state'] ?? null; unset($_SESSION['oauth_state']);
if (!is_array($saved) || empty($state) || !hash_equals((string)$saved['value'], $state) || (time()-(int)$saved['created_at']) > 600) oauth_redirect('/account/', ['oauth_error'=>'state']);
$provider = (string)$saved['provider']; $returnPath = oauth_return_path((string)$saved['return']); $config = oauth_provider_config($provider);
if (!$config) oauth_redirect('/account/', ['oauth_error'=>'credentials']);
if (!empty($_GET['error']) || empty($_GET['code'])) oauth_redirect('/account/', ['oauth_error'=>'cancelled']);
try {
    $token = oauth_http_post($provider==='google' ? 'https://oauth2.googleapis.com/token' : 'https://graph.facebook.com/v20.0/oauth/access_token', ['code'=>(string)$_GET['code'],'client_id'=>$config['client_id'],'client_secret'=>$config['client_secret'],'redirect_uri'=>$config['redirect_uri'],'grant_type'=>'authorization_code']);
    $accessToken = (string)($token['access_token'] ?? ''); if ($accessToken === '') throw new RuntimeException('No access token returned by provider.');
    if ($provider === 'google') { $identity = oauth_http_get('https://openidconnect.googleapis.com/v1/userinfo', ['Authorization: Bearer ' . $accessToken]); if (empty($identity['email_verified'])) throw new RuntimeException('Google did not return a verified email address.'); }
    else { $proof = hash_hmac('sha256', $accessToken, $config['client_secret']); $identity = oauth_http_get('https://graph.facebook.com/v20.0/me?fields=id,name,email&access_token=' . rawurlencode($accessToken) . '&appsecret_proof=' . $proof); }
    $subject = trim((string)($identity['sub'] ?? $identity['id'] ?? '')); $email = strtolower(trim((string)($identity['email'] ?? ''))); $name = trim((string)($identity['name'] ?? ''));
    if ($subject === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) throw new RuntimeException('OAuth provider did not return the required verified identity details.');
    ensure_user_auth_schema($pdo);
    $find = $pdo->prepare('SELECT id,email,role,name,company,role_confirmed,oauth_provider,oauth_subject FROM users WHERE oauth_provider=? AND oauth_subject=? LIMIT 1'); $find->execute([$provider,$subject]); $user = $find->fetch();
    if (!$user) { $byEmail = $pdo->prepare('SELECT id,email,role,name,company,role_confirmed,oauth_provider,oauth_subject FROM users WHERE email=? LIMIT 1'); $byEmail->execute([$email]); $user = $byEmail->fetch(); if ($user && $user['oauth_provider'] && ($user['oauth_provider'] !== $provider || $user['oauth_subject'] !== $subject)) throw new RuntimeException('This email is already linked to another sign-in method.'); if ($user) { $link = $pdo->prepare('UPDATE users SET oauth_provider=?,oauth_subject=?,email_verified=1,name=COALESCE(NULLIF(name,\'\'),?) WHERE id=?'); $link->execute([$provider,$subject,$name,$user['id']]); } else { $create = $pdo->prepare('INSERT INTO users(email,password_hash,role,name,email_verified,role_confirmed,oauth_provider,oauth_subject) VALUES(?,?,?,?,1,0,?,?)'); $create->execute([$email,password_hash(bin2hex(random_bytes(32)),PASSWORD_DEFAULT),'buyer',$name?:null,$provider,$subject]); } $byEmail->execute([$email]); $user=$byEmail->fetch(); }
    session_regenerate_id(true); $_SESSION['user']=['id'=>(int)$user['id'],'email'=>$user['email'],'role'=>$user['role'],'name'=>$user['name'],'company'=>$user['company'],'role_confirmed'=>(bool)$user['role_confirmed']];
    if (!$_SESSION['user']['role_confirmed']) oauth_redirect('/account/', ['oauth'=>'role']);
    oauth_redirect($_SESSION['user']['role']==='seller' ? '/seller/' : $returnPath);
} catch (Throwable $error) { oauth_redirect('/account/', ['oauth_error'=>'provider']); }
