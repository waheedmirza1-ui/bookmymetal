<?php
declare(strict_types=1);

function ensure_user_auth_schema(PDO $pdo): void {
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,email VARCHAR(190) NULL UNIQUE,phone VARCHAR(32) NULL UNIQUE,password_hash VARCHAR(255) NOT NULL,role ENUM('buyer','seller','admin') NOT NULL DEFAULT 'buyer',name VARCHAR(120) NULL,company VARCHAR(190) NULL,email_verified TINYINT(1) NOT NULL DEFAULT 0,phone_verified TINYINT(1) NOT NULL DEFAULT 0,role_confirmed TINYINT(1) NOT NULL DEFAULT 1,oauth_provider VARCHAR(24) NULL,oauth_subject VARCHAR(255) NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE KEY users_oauth_identity (oauth_provider, oauth_subject)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $columns = $pdo->query('SHOW COLUMNS FROM users')->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('role_confirmed', $columns, true)) $pdo->exec('ALTER TABLE users ADD COLUMN role_confirmed TINYINT(1) NOT NULL DEFAULT 1 AFTER email_verified');
    if (!in_array('phone', $columns, true)) $pdo->exec('ALTER TABLE users ADD COLUMN phone VARCHAR(32) NULL UNIQUE AFTER email');
    if (!in_array('phone_verified', $columns, true)) $pdo->exec('ALTER TABLE users ADD COLUMN phone_verified TINYINT(1) NOT NULL DEFAULT 0 AFTER email_verified');
    if (!in_array('oauth_provider', $columns, true)) $pdo->exec('ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(24) NULL AFTER role_confirmed');
    if (!in_array('oauth_subject', $columns, true)) $pdo->exec('ALTER TABLE users ADD COLUMN oauth_subject VARCHAR(255) NULL AFTER oauth_provider');
    if (!in_array('seller_enabled', $columns, true)) $pdo->exec('ALTER TABLE users ADD COLUMN seller_enabled TINYINT(1) NOT NULL DEFAULT 0 AFTER role');
    $indexes = $pdo->query("SHOW INDEX FROM users WHERE Key_name='users_oauth_identity'")->fetchAll();
    if (!$indexes) $pdo->exec('ALTER TABLE users ADD UNIQUE KEY users_oauth_identity (oauth_provider, oauth_subject)');
    $pdo->exec('ALTER TABLE users MODIFY email VARCHAR(190) NULL');
    $pdo->exec("UPDATE users SET seller_enabled=1 WHERE role='seller' AND seller_enabled=0");
}

function user_can_sell(array $user): bool {
    return ($user['role'] ?? '') === 'seller' || !empty($user['seller_enabled']);
}
