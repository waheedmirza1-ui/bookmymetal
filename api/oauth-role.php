<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/user-schema.php';
require_once __DIR__ . '/oauth-helpers.php';
oauth_session_start(); header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_SESSION['user']['id'])) { http_response_code(401); echo json_encode(['ok'=>false,'error'=>'Sign in is required.']); exit; }
$input = json_decode(file_get_contents('php://input'),true) ?: []; $role = (string)($input['role'] ?? '');
if (!in_array($role,['buyer','seller'],true)) { http_response_code(422); echo json_encode(['ok'=>false,'error'=>'Choose Buyer or Seller.']); exit; }
ensure_user_auth_schema($pdo); $update=$pdo->prepare('UPDATE users SET role=?,role_confirmed=1 WHERE id=?'); $update->execute([$role,(int)$_SESSION['user']['id']]); $_SESSION['user']['role']=$role; $_SESSION['user']['role_confirmed']=true;
echo json_encode(['ok'=>true,'user'=>$_SESSION['user']]);
