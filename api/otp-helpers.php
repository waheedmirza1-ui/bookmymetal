<?php
declare(strict_types=1);
require_once __DIR__ . '/oauth-helpers.php';

const OTP_TTL_SECONDS = 300;
const OTP_RESEND_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;
const OTP_DESTINATION_LIMIT = 5;
const OTP_IP_LIMIT = 12;
const OTP_SESSION_LIMIT = 8;

function ensure_otp_schema(PDO $pdo): void {
    $pdo->exec("CREATE TABLE IF NOT EXISTS login_otps (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,destination VARCHAR(190) NOT NULL,channel ENUM('email','sms') NOT NULL,purpose ENUM('login','password_reset') NOT NULL DEFAULT 'login',code_hash VARCHAR(255) NOT NULL,request_ip_hash CHAR(64) NOT NULL,request_session_hash CHAR(64) NOT NULL,verification_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,expires_at DATETIME NOT NULL,resend_after DATETIME NOT NULL,consumed_at DATETIME NULL,invalidated_at DATETIME NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX otp_destination_created (destination,created_at),INDEX otp_ip_created (request_ip_hash,created_at),INDEX otp_session_created (request_session_hash,created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $columns=$pdo->query('SHOW COLUMNS FROM login_otps')->fetchAll(PDO::FETCH_COLUMN); if(!in_array('request_session_hash',$columns,true))$pdo->exec("ALTER TABLE login_otps ADD COLUMN request_session_hash CHAR(64) NOT NULL DEFAULT '' AFTER request_ip_hash");
}

function normalize_otp_destination(string $value): array {
    $value = trim($value);
    if (filter_var($value, FILTER_VALIDATE_EMAIL)) return ['channel'=>'email','destination'=>strtolower($value)];
    $digits = preg_replace('/[^0-9+]/', '', $value) ?? '';
    if (preg_match('/^[6-9][0-9]{9}$/', $digits)) $digits = '+91' . $digits;
    elseif (preg_match('/^91[6-9][0-9]{9}$/', $digits)) $digits = '+' . $digits;
    if (!preg_match('/^\+[1-9][0-9]{7,14}$/', $digits)) throw new InvalidArgumentException('Enter a valid email address or mobile number with country code.');
    return ['channel'=>'sms','destination'=>$digits];
}

function otp_ip_hash(): string { return hash('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown')); }
function otp_session_hash(): string { return hash('sha256', session_id()); }

function otp_mask_destination(string $channel, string $destination): string {
    if ($channel === 'email') { [$local,$domain] = explode('@',$destination,2); return substr($local,0,1) . '•••@' . $domain; }
    return substr($destination,0,3) . '••••••' . substr($destination,-3);
}

function otp_provider_config(): array { $config = oauth_config(); return is_array($config['otp'] ?? null) ? $config['otp'] : []; }

function otp_send(string $channel, string $destination, string $code): void {
    $config = otp_provider_config();
    if ($channel === 'email') {
        $from = trim((string)($config['email_from'] ?? ''));
        if ($from === '') throw new RuntimeException('Email OTP delivery is blocked — requires server-side email configuration.');
        $subject = 'Your BookMyMetal verification code';
        $message = "Your BookMyMetal verification code is {$code}. It expires in 5 minutes. Do not share this code.";
        $headers = "From: {$from}\r\nContent-Type: text/plain; charset=UTF-8";
        if (!mail($destination, $subject, $message, $headers)) throw new RuntimeException('Email OTP delivery failed.');
        return;
    }
    $sid = trim((string)($config['twilio_account_sid'] ?? '')); $token = trim((string)($config['twilio_auth_token'] ?? '')); $from = trim((string)($config['twilio_from'] ?? ''));
    if ($sid==='' || $token==='' || $from==='') throw new RuntimeException('SMS OTP delivery is blocked — requires server-side SMS provider credentials.');
    if (!function_exists('curl_init')) throw new RuntimeException('SMS OTP delivery requires PHP cURL on the server.');
    $curl = curl_init('https://api.twilio.com/2010-04-01/Accounts/' . rawurlencode($sid) . '/Messages.json');
    curl_setopt_array($curl,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>http_build_query(['To'=>$destination,'From'=>$from,'Body'=>"Your BookMyMetal verification code is {$code}. It expires in 5 minutes. Do not share this code."],'','&'),CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>15,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_USERPWD=>$sid . ':' . $token]);
    $body=curl_exec($curl);$status=(int)curl_getinfo($curl,CURLINFO_RESPONSE_CODE);$error=curl_error($curl);curl_close($curl);
    if ($body===false || $status<200 || $status>=300) throw new RuntimeException($error ?: 'SMS OTP delivery failed.');
}

function otp_json(array $payload, int $status=200): never { http_response_code($status); header('Content-Type: application/json; charset=utf-8'); echo json_encode($payload); exit; }
