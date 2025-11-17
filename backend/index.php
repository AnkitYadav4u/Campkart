<?php
// ------- CORS HEADERS --------
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// ------ ROUTING ------
$route = $_GET['route'] ?? '';
$action = $_GET['action'] ?? '';
//---- USERS ROUTE ---------
if ($route === 'users') {
    require __DIR__ . '/routes/userRoutes.php';
    exit;
}

// ------ ADS ROUTE ------
if ($route === 'ads') {
    require __DIR__ . '/routes/adRoutes.php';
    exit;
}
// ---------- INVALID ROUTE ---------
http_response_code(404);
echo json_encode([
    "status" => "error",
    "message" => "Route not found"
]);
exit;
?>
