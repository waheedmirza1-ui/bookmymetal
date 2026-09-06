<?php
declare(strict_types=1);
session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off','httponly'=>true,'samesite'=>'Lax']);
session_start();
function require_auth(): array { if(empty($_SESSION['user'])){http_response_code(401);header('Content-Type: application/json; charset=utf-8');echo json_encode(['ok'=>false,'authenticated'=>false,'error'=>'Authentication required']);exit;} return $_SESSION['user']; }
