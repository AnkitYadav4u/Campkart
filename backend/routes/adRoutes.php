<?php
require __DIR__ . '/../controllers/adController.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && $action === 'create') create_ad($pdo);
elseif ($method === 'GET' && $action === 'list') get_ads($pdo);
elseif ($method === 'GET' && $action === 'search') search_ads($pdo);
else {
    http_response_code(404);
    echo json_encode(['status'=>'error','message'=>'Not found']);
}
?>

