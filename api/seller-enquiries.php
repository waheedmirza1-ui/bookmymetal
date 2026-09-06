<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/user-schema.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.bookmymetal.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, PATCH, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
session_set_cookie_params(['secure'=>(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),'httponly'=>true,'samesite'=>'Lax','path'=>'/']);
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
$user=$_SESSION['user']??null;
if(!$user || !user_can_sell($user)){http_response_code(401);echo json_encode(['ok'=>false,'error'=>'Activate selling to view enquiries.']);exit;}
$pdo->exec("CREATE TABLE IF NOT EXISTS rfq_requests (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,name VARCHAR(120) NOT NULL,company VARCHAR(180) NOT NULL,email VARCHAR(190) NOT NULL,phone VARCHAR(40) NULL,product VARCHAR(220) NOT NULL,category VARCHAR(100) NULL,message TEXT NULL,status VARCHAR(30) NOT NULL DEFAULT 'new',created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id),INDEX idx_email(email),INDEX idx_status_created(status,created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
try{$pdo->exec("ALTER TABLE rfq_requests ADD COLUMN seller_product_id BIGINT UNSIGNED NULL, ADD COLUMN seller_user_id BIGINT UNSIGNED NULL, ADD COLUMN buyer_user_id BIGINT UNSIGNED NULL");}catch(Throwable $e){}
if($_SERVER['REQUEST_METHOD']==='GET'){
 $s=$pdo->prepare("SELECT r.id,r.name,r.company,r.email,r.phone,r.product,r.category,r.message,r.status,r.created_at,r.seller_product_id FROM rfq_requests r WHERE r.seller_user_id=? ORDER BY r.created_at DESC");
 $s->execute([(int)$user['id']]); echo json_encode(['ok'=>true,'enquiries'=>$s->fetchAll()]); exit;
}
if($_SERVER['REQUEST_METHOD']==='PATCH'){
 $in=json_decode(file_get_contents('php://input'),true)?:[];$id=(int)($in['id']??0);$status=(string)($in['status']??'');
 if($id<1||!in_array($status,['new','contacted','quoted','closed'],true)){http_response_code(422);echo json_encode(['ok'=>false,'error'=>'Invalid enquiry or status.']);exit;}
 $s=$pdo->prepare('UPDATE rfq_requests SET status=? WHERE id=? AND seller_user_id=?');$s->execute([$status,$id,(int)$user['id']]);echo json_encode(['ok'=>true,'updated'=>$s->rowCount()]);exit;
}
http_response_code(405);echo json_encode(['ok'=>false,'error'=>'Method not allowed.']);
