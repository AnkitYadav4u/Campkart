<?php
require __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * Get the bearer token from Authorization header
 */
function getBearerToken() {
    $headers = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }

    if (!empty($headers) && preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        return $matches[1];
    }

    return null;
}

/**
 * Authenticate the user via JWT
 */
function authenticate() {
    $token = getBearerToken();

    if (!$token) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Not authorized, no token']);
        exit;
    }

    try {
        $secret = $_ENV['JWT_SECRET'] ?? 'my_default_secret_key';
        $decoded = JWT::decode($token, new Key($secret, 'HS256'));
        return $decoded->id ?? null;

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Not authorized, token failed', 'error' => $e->getMessage()]);
        exit;
    }
}

/**
 * Generate a JWT token for a user
 */
function generate_jwt($userId) {
    $secret = $_ENV['JWT_SECRET'] ?? 'my_default_secret_key';
    $payload = [
        'iat' => time(),
        'exp' => time() + (30 * 24 * 60 * 60), // 30 days
        'id' => $userId
    ];

    return JWT::encode($payload, $secret, 'HS256');
}

