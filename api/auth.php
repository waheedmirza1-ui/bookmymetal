<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed']); exit; }
$input=json_decode(file_get_contents('php://input'),true) ?: [];
$action=$input['action'] ?? 'register';
$pdo->exec("CREATE TABLE IF NOT EXISTS users (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,email VARCHAR(190) NOT NULL UNIQUE,password_hash VARCHAR(255) NOT NULL,role ENUM('buyer','seller','admin') NOT NULL DEFAULT 'buyer',name VARCHAR(120) NULL,company VARCHAR(190) NULL,email_verified TINYINT(1) NOT NULL DEFAULT 0,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
if($action==='register'){
 $email=strtolower(trim((string)($input['email']??''))); $password=(string)($input['password']??''); $name=trim((string)($input['name']??'')); $company=trim((string)($input['company']??'')); $role=in_array(($input['role']??'buyer'),['buyer','seller'],true)?$input['role']:'buyer';
 if(!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($password)<10){http_response_code(422);echo json_encode(['ok'=>false,'error'=>'Use a valid email and a password of at least 10 characters.']);exit;}
 try{$s=$pdo->prepare('INSERT INTO users(email,password_hash,role,name,company) VALUES(?,?,?,?,?)');$s->execute([$email,password_hash($password,PASSWORD_DEFAULT),$role,$name?:null,$company?:null]);echo json_encode(['ok'=>true,'user_id'=>(int)$pdo->lastInsertId(),'message'=>'Account created.']);}catch(PDOException $e){http_response_code(409);echo json_encode(['ok'=>false,'error'=>'An account with this email may already exist.']);}exit;
}
if($action==='login'){
 $email=strtolower(trim((string)($input['email']??'')));$password=(string)($input['password']??'');$s=$pdo->prepare('SELECT id,email,password_hash,role,name,company FROM users WHERE email=? LIMIT 1');$s->execute([$email]);$u=$s->fetch();
 if(!$u||!password_verify($password,$u['password_hash'])){http_response_code(401);echo json_encode(['ok'=>false,'error'=>'Invalid email or password.']);exit;}
 echo json_encode(['ok'=>true,'user'=>['id'=>(int)$u['id'],'email'=>$u['email'],'role'=>$u['role'],'name'=>$u['name'],'company'=>$u['company']]]);exit;
}
http_response_code(400);echo json_encode(['ok'=>false,'error'=>'Unsupported action']);
