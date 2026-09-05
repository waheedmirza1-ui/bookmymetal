<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
$origin=$_SERVER['HTTP_ORIGIN']??'';
if($origin==='https://www.bookmymetal.com') header('Access-Control-Allow-Origin: https://www.bookmymetal.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, PATCH, OPTIONS');
if($_SERVER['REQUEST_METHOD']==='OPTIONS') exit;
session_set_cookie_params(['secure'=>(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off'),'httponly'=>true,'samesite'=>'Lax','path'=>'/']);
if(session_status()!==PHP_SESSION_ACTIVE) session_start();
$user=$_SESSION['user']??null;
if(!$user||($user['role']??'')!=='admin'){http_response_code(403);echo json_encode(['ok'=>false,'error'=>'Admin access required.']);exit;}
$pdo->exec("CREATE TABLE IF NOT EXISTS seller_products (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,seller_user_id BIGINT UNSIGNED NOT NULL,title VARCHAR(255) NOT NULL,description TEXT NULL,category VARCHAR(120) NOT NULL,video_url TEXT NULL,video_status ENUM('draft','processing','review','published','rejected') NOT NULL DEFAULT 'draft',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX idx_category(category),INDEX idx_seller(seller_user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
if($_SERVER['REQUEST_METHOD']==='GET'){
 $status=trim((string)($_GET['status']??'review'));
 $allowed=['draft','processing','review','published','rejected'];
 if(!in_array($status,$allowed,true))$status='review';
 $s=$pdo->prepare('SELECT sp.id,sp.title,sp.description,sp.category,sp.video_url,sp.video_status,sp.created_at,sp.seller_user_id,u.name,u.company,u.email FROM seller_products sp LEFT JOIN users u ON u.id=sp.seller_user_id WHERE sp.video_status=? ORDER BY sp.created_at DESC');
 $s->execute([$status]);echo json_encode(['ok'=>true,'products'=>$s->fetchAll()]);exit;
}
$in=json_decode(file_get_contents('php://input'),true)?:[];$id=(int)($in['id']??0);$status=(string)($in['status']??'');
if($id<1||!in_array($status,['published','rejected'],true)){http_response_code(422);echo json_encode(['ok'=>false,'error'=>'Invalid product or moderation status.']);exit;}
$s=$pdo->prepare('UPDATE seller_products SET video_status=? WHERE id=?');$s->execute([$status,$id]);echo json_encode(['ok'=>true,'id'=>$id,'status'=>$status]);
