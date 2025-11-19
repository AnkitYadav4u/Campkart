<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../helpers/auth_helper.php';

/**
 * REGISTER USER
 */
function register_user() {
    global $pdo;

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
        return;
    }

    $name = trim($data['name']);
    $email = trim($data['email']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);

    // check email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
        return;
    }

    // insert
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $done = $stmt->execute([$name, $email, $password]);

    if ($done) {
        echo json_encode(['status' => 'success', 'message' => 'User registered successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
    }
}

/**
 * LOGIN USER
 */
function login_user() {
    global $pdo;

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || empty($data['email']) || empty($data['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
        return;
    }

    $email = trim($data['email']);
    $password = $data['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password']);
        return;
    }

    // generate token
    $token = generate_jwt($user['id']);

    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email']
        ]
    ]);
}

/**
 * PROFILE USING JWT
 */
function profile_user() {
    global $pdo;

    $userId = authenticate(); // JWT user ID

    $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        return;
    }

    echo json_encode([
        'status' => 'success',
        'user' => $user
    ]);
}
function get_user_details($pdo) {
    $email = $_GET['user_email'] ?? '';
    if (!$email) {
        echo json_encode(['status'=>'error','message'=>'Missing email']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT name, email FROM users WHERE email=?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['status'=>'error','message'=>'User not found']);
        exit;
    }

    echo json_encode(['status'=>'success','user'=>$user]);
    exit;
}

