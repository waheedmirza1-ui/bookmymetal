<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === 'https://www.bookmymetal.com') header('Access-Control-Allow-Origin: https://www.bookmymetal.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed']); exit; }

$pdo->exec("CREATE TABLE IF NOT EXISTS seller_products (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,seller_user_id BIGINT UNSIGNED NOT NULL,title VARCHAR(255) NOT NULL,description TEXT NULL,category VARCHAR(120) NOT NULL,video_url TEXT NULL,video_status ENUM('draft','processing','review','published','rejected') NOT NULL DEFAULT 'draft',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX idx_category(category),INDEX idx_seller(seller_user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$q = trim((string)($_GET['q'] ?? ''));
$type = trim((string)($_GET['type'] ?? 'all'));
$category = trim((string)($_GET['category'] ?? ''));
$limit = min(60, max(1, (int)($_GET['limit'] ?? 30)));

$sql = "SELECT sp.id, sp.title, sp.description, sp.category, sp.video_url, sp.video_status, sp.created_at,
               u.name AS seller_name, u.company AS seller_company
        FROM seller_products sp
        LEFT JOIN users u ON u.id = sp.seller_user_id
        WHERE sp.video_status = 'published'";
$params = [];

if ($q !== '') {
  $sql .= " AND (sp.title LIKE ? OR sp.category LIKE ? OR sp.description LIKE ? OR COALESCE(u.name,'') LIKE ? OR COALESCE(u.company,'') LIKE ?)";
  $like = '%' . $q . '%';
  $params = [$like, $like, $like, $like, $like];
}
if ($category !== '') {
  $sql .= " AND sp.category = ?";
  $params[] = $category;
}
$sql .= " ORDER BY sp.created_at DESC LIMIT {$limit}";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$base = rtrim((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'www.bookmymetal.com'), '/');
$results = [];
foreach ($rows as $row) {
  $description = trim((string)($row['description'] ?? ''));
  $seller = trim((string)($row['seller_company'] ?? '')) ?: trim((string)($row['seller_name'] ?? '')) ?: 'BookMyMetal Seller';
  $video = $row['video_url'] ? (str_starts_with((string)$row['video_url'], 'http') ? $row['video_url'] : $base . '/' . ltrim((string)$row['video_url'], '/')) : null;
  $results[] = [
    'id' => 'seller-' . (string)$row['id'],
    'db_id' => (int)$row['id'],
    'title' => $row['title'],
    'type' => 'product',
    'category' => $row['category'],
    'seller' => $seller,
    'location' => 'India',
    'specs' => $description !== '' ? [mb_substr($description, 0, 140)] : [],
    'score' => 10,
    'video_url' => $video,
    'video_status' => $row['video_status'],
    'created_at' => $row['created_at'],
  ];
}

echo json_encode(['ok'=>true,'query'=>$q,'category'=>$category,'type'=>$type,'results'=>$results], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
