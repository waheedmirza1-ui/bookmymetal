<?php
declare(strict_types=1);
require_once __DIR__ . '/oauth-helpers.php';
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['ok'=>true,'providers'=>['google'=>oauth_provider_config('google') !== null,'facebook'=>oauth_provider_config('facebook') !== null]]);
