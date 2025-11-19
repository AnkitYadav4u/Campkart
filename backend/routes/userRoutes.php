<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../controllers/userController.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && $action === 'register') {
    register_user();
} elseif ($method === 'POST' && $action === 'login') {
    login_user();
} elseif ($method === 'GET' && $action === 'profile') {
    profile_user();
}elseif ($method === 'GET' && $action === 'user_details'){ 
   get_user_details($pdo);
}else {
    http_response_code(404);
    echo json_encode(['status'=>'error','message'=>'Route not found']);
}
?>

