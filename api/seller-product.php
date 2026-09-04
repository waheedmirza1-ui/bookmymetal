<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD']==='OPTIONS') exit;
if ($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['ok'=>false,'error'=>'Method not allowed']);exit;}
$pdo->exec("CREATE TABLE IF NOT EXISTS seller_products (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,seller_user_id BIGINT UNSIGNED NOT NULL,title VARCHAR(255) NOT NULL,description TEXT NULL,category VARCHAR(120) NOT NULL,video_url TEXT NULL,video_status ENUM('draft','processing','review','published','rejected') NOT NULL DEFAULT 'draft',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX idx_category(category),INDEX idx_seller(seller_user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
$in=json_decode(file_get_contents('php://input'),true)?:[];$seller=(int)($in['seller_user_id']??0);$title=trim((string)($in['title']??''));$category=trim((string)($in['category']??''));$description=trim((string)($in['description']??''));$video=trim((string)($in['video_url']??''));
if($seller<1||$title===''||$category===''){http_response_code(422);echo json_encode(['ok'=>false,'error'=>'Seller, title and category are required.']);exit;}
$s=$pdo->prepare('INSERT INTO seller_products(seller_user_id,title,description,category,video_url,video_status) VALUES(?,?,?,?,?,?)');$s->execute([$seller,$title,$description?:null,$category,$video?:null,$video?'review':'draft']);echo json_encode(['ok'=>true,'product_id'=>(int)$pdo->lastInsertId(),'video_status'=>$video?'review':'draft']);
