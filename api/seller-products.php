<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.bookmymetal.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed']); exit; }
session_set_cookie_params(['secure'=>(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),'httponly'=>true,'samesite'=>'Lax','path'=>'/']);
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
$user=$_SESSION['user']??null;
if (!$user || ($user['role']??'') !== 'seller') { http_response_code(401); echo json_encode(['ok'=>false,'error'=>'Seller sign-in required.']); exit; }
$pdo->exec("CREATE TABLE IF NOT EXISTS seller_products (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,seller_user_id BIGINT UNSIGNED NOT NULL,title VARCHAR(255) NOT NULL,description TEXT NULL,category VARCHAR(120) NOT NULL,video_url TEXT NULL,video_status ENUM('draft','processing','review','published','rejected') NOT NULL DEFAULT 'draft',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX idx_category(category),INDEX idx_seller(seller_user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
$s=$pdo->prepare('SELECT id,title,description,category,video_url,video_status,created_at FROM seller_products WHERE seller_user_id=? ORDER BY id DESC');
$s->execute([(int)$user['id']]);
echo json_encode(['ok'=>true,'products'=>$s->fetchAll()]);
