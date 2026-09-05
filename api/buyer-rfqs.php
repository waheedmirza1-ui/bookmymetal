<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.bookmymetal.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');
if($_SERVER['REQUEST_METHOD']==='OPTIONS')exit;
session_set_cookie_params(['secure'=>(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off'),'httponly'=>true,'samesite'=>'Lax','path'=>'/']);if(session_status()!==PHP_SESSION_ACTIVE)session_start();
$user=$_SESSION['user']??null;if(!$user){http_response_code(401);echo json_encode(['ok'=>false,'error'=>'Sign in required.']);exit;}
try{$s=$pdo->prepare('SELECT id,product,category,message,status,created_at FROM rfq_requests WHERE buyer_user_id=? ORDER BY created_at DESC LIMIT 100');$s->execute([(int)$user['id']]);echo json_encode(['ok'=>true,'rfqs'=>$s->fetchAll()]);}catch(Throwable $e){http_response_code(500);echo json_encode(['ok'=>false,'error'=>'Unable to load RFQs.']);}
