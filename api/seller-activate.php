<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/user-schema.php';
require_once __DIR__ . '/oauth-helpers.php';
oauth_session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.bookmymetal.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_SESSION['user']['id'])) { http_response_code(401); echo json_encode(['ok'=>false,'error'=>'Sign in to activate selling.']); exit; }
ensure_user_auth_schema($pdo);
$id = (int)$_SESSION['user']['id'];
$update = $pdo->prepare('UPDATE users SET seller_enabled=1 WHERE id=?');
$update->execute([$id]);
$_SESSION['user']['seller_enabled'] = true;
echo json_encode(['ok'=>true,'user'=>$_SESSION['user']]);
