<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off','httponly'=>true,'samesite'=>'Lax']);
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.bookmymetal.com');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){exit;}
$action=$_GET['action']??'me';
if($action==='logout'){$_SESSION=[];if(ini_get('session.use_cookies')){setcookie(session_name(),'',time()-42000,'/');}session_destroy();echo json_encode(['ok'=>true]);exit;}
if($action==='me'){if(empty($_SESSION['user'])){http_response_code(401);echo json_encode(['ok'=>false,'authenticated'=>false]);exit;}echo json_encode(['ok'=>true,'authenticated'=>true,'user'=>$_SESSION['user']]);exit;}
http_response_code(400);echo json_encode(['ok'=>false,'error'=>'Unsupported action']);