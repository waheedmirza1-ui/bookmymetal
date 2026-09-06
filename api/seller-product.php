<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/user-schema.php';
header('Content-Type: application/json; charset=utf-8');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === 'https://www.bookmymetal.com') header('Access-Control-Allow-Origin: https://www.bookmymetal.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed']); exit; }

session_set_cookie_params(['secure'=>(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),'httponly'=>true,'samesite'=>'Lax','path'=>'/']);
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
$user = $_SESSION['user'] ?? null;
if (!$user || !user_can_sell($user)) { http_response_code(401); echo json_encode(['ok'=>false,'error'=>'Activate selling to publish listings.']); exit; }

$pdo->exec("CREATE TABLE IF NOT EXISTS seller_products (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,seller_user_id BIGINT UNSIGNED NOT NULL,title VARCHAR(255) NOT NULL,description TEXT NULL,category VARCHAR(120) NOT NULL,video_url TEXT NULL,video_status ENUM('draft','processing','review','published','rejected') NOT NULL DEFAULT 'draft',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX idx_category(category),INDEX idx_seller(seller_user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
$seller = (int)($user['id'] ?? 0);
$title = trim((string)($_POST['title'] ?? ''));
$category = trim((string)($_POST['category'] ?? ''));
$description = trim((string)($_POST['description'] ?? ''));
if ($seller < 1 || $title === '' || $category === '') { http_response_code(422); echo json_encode(['ok'=>false,'error'=>'Title and category are required.']); exit; }

$videoUrl = null;
if (isset($_FILES['video']) && $_FILES['video']['error'] !== UPLOAD_ERR_NO_FILE) {
  $file = $_FILES['video'];
  if ($file['error'] !== UPLOAD_ERR_OK) { http_response_code(422); echo json_encode(['ok'=>false,'error'=>'Video upload failed. Check the file size and try again.']); exit; }
  if ((int)$file['size'] > 100 * 1024 * 1024) { http_response_code(422); echo json_encode(['ok'=>false,'error'=>'Video must be 100 MB or smaller.']); exit; }
  $allowed = ['video/mp4'=>'mp4','video/webm'=>'webm','video/quicktime'=>'mov'];
  $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
  if (!isset($allowed[$mime])) { http_response_code(422); echo json_encode(['ok'=>false,'error'=>'Only MP4, WebM or MOV video files are allowed.']); exit; }
  $uploadDir = dirname(__DIR__) . '/uploads/products';
  if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Unable to prepare video storage.']); exit; }
  $filename = 'seller-' . $seller . '-' . bin2hex(random_bytes(12)) . '.' . $allowed[$mime];
  $destination = $uploadDir . '/' . $filename;
  if (!move_uploaded_file($file['tmp_name'], $destination)) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Unable to store uploaded video.']); exit; }
  $videoUrl = '/uploads/products/' . $filename;
}

$s = $pdo->prepare('INSERT INTO seller_products(seller_user_id,title,description,category,video_url,video_status) VALUES(?,?,?,?,?,?)');
$s->execute([$seller,$title,$description ?: null,$category,$videoUrl,$videoUrl ? 'review' : 'draft']);
echo json_encode(['ok'=>true,'product_id'=>(int)$pdo->lastInsertId(),'video_status'=>$videoUrl ? 'review' : 'draft','video_url'=>$videoUrl]);
