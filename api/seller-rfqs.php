<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.bookmymetal.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, PATCH, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
session_set_cookie_params(['secure'=>(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off'),'httponly'=>true,'samesite'=>'Lax','path'=>'/']);
if(session_status()!==PHP_SESSION_ACTIVE) session_start();
$user=$_SESSION['user']??null;
if(!$user||($user['role']??'')!=='seller'){http_response_code(401);echo json_encode(['ok'=>false,'error'=>'Seller sign-in required.']);exit;}
$pdo->exec("CREATE TABLE IF NOT EXISTS rfq_requests (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,name VARCHAR(120) NOT NULL,company VARCHAR(180) NOT NULL,email VARCHAR(190) NOT NULL,phone VARCHAR(40) NULL,product VARCHAR(220) NOT NULL,category VARCHAR(100) NULL,message TEXT NULL,status VARCHAR(30) NOT NULL DEFAULT 'new',created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id),INDEX idx_status_created(status,created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
if($_SERVER['REQUEST_METHOD']==='GET'){
 $s=$pdo->query("SELECT id,name,company,email,phone,product,category,message,status,created_at FROM rfq_requests ORDER BY created_at DESC LIMIT 100");
 echo json_encode(['ok'=>true,'rfqs'=>$s->fetchAll()]);exit;
}
$in=json_decode(file_get_contents('php://input'),true)?:[];$id=(int)($in['id']??0);$status=(string)($in['status']??'');
if($id<1||!in_array($status,['new','contacted','quoted','closed'],true)){http_response_code(422);echo json_encode(['ok'=>false,'error'=>'Invalid RFQ status.']);exit;}
$s=$pdo->prepare('UPDATE rfq_requests SET status=? WHERE id=?');$s->execute([$status,$id]);echo json_encode(['ok'=>true,'id'=>$id,'status'=>$status]);
