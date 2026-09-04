<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'POST required']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$name = trim((string)($input['name'] ?? ''));
$company = trim((string)($input['company'] ?? ''));
$email = trim((string)($input['email'] ?? ''));
$phone = trim((string)($input['phone'] ?? ''));
$product = trim((string)($input['product'] ?? ''));
$category = trim((string)($input['category'] ?? ''));
$message = trim((string)($input['message'] ?? ''));

if ($name === '' || $company === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $product === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Name, company, valid email and product are required.']);
    exit;
}

try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS rfq_requests (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(120) NOT NULL,
        company VARCHAR(180) NOT NULL,
        email VARCHAR(190) NOT NULL,
        phone VARCHAR(40) NULL,
        product VARCHAR(220) NOT NULL,
        category VARCHAR(100) NULL,
        message TEXT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'new',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_email (email),
        INDEX idx_status_created (status, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $stmt = $pdo->prepare('INSERT INTO rfq_requests (name, company, email, phone, product, category, message) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$name, $company, $email, $phone ?: null, $product, $category ?: null, $message ?: null]);

    echo json_encode(['ok' => true, 'rfq_id' => (int)$pdo->lastInsertId(), 'message' => 'Request for quote submitted.']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Unable to save request right now.']);
}
