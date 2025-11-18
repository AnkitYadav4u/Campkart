<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$host = "localhost";
$db   = "my_project";
$user = "root";     // change if needed
$pass = "";         // change if you have a password
$charset = "utf8mb4";

// PDO connection
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    echo json_encode(['status'=>'error','message'=>'DB connection failed: '.$e->getMessage()]);
    exit;
}

// -------------------- CREATE AD --------------------
function create_ad($pdo) {
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $price = $_POST['price'] ?? '';
    $user_email = $_POST['user_email'] ?? '';

    if (!$title || !$description || !$price || !$user_email) {
        echo json_encode(['status'=>'error','message'=>'Missing required fields']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO ads (title, description, price, user_email) VALUES (?, ?, ?, ?)");
    $stmt->execute([$title, $description, $price, $user_email]);
    $ad_id = $pdo->lastInsertId();

    $imagePaths = [];
    if (!empty($_FILES['images'])) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
            $originalName = basename($_FILES['images']['name'][$key]);
            $targetFile = $uploadDir . time() . '_' . $originalName;

            if (move_uploaded_file($tmpName, $targetFile)) {
                $relativePath = 'uploads/' . basename($targetFile);
                $imagePaths[] = $relativePath;

                $stmtImg = $pdo->prepare("INSERT INTO ad_images (ad_id, image_path) VALUES (?, ?)");
                $stmtImg->execute([$ad_id, $relativePath]);
            }
        }
    }

    echo json_encode([
        'status'=>'success',
        'message'=>'Ad created successfully',
        'ad'=>[
            'id'=>$ad_id,
            'title'=>$title,
            'description'=>$description,
            'price'=>$price,
            'user_email'=>$user_email,
            'images'=>$imagePaths,
            'created_at'=>date('Y-m-d H:i:s')
        ]
    ]);
    exit;
}

// -------------------- GET ADS --------------------
function get_ads($pdo) {
    $stmt = $pdo->query("SELECT * FROM ads ORDER BY created_at DESC");
    $ads = $stmt->fetchAll();

    foreach ($ads as &$ad) {
        $stmtImg = $pdo->prepare("SELECT image_path FROM ad_images WHERE ad_id=?");
        $stmtImg->execute([$ad['id']]);
        $ad['images'] = $stmtImg->fetchAll(PDO::FETCH_COLUMN);
    }

    echo json_encode($ads);
    exit;
}

// -------------------- SEARCH ADS --------------------
function search_ads($pdo) {
    $query = $_GET['query'] ?? '';
    if (!$query) {
        echo json_encode([]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT * FROM ads
        WHERE title LIKE ?
        OR description LIKE ?
        OR price LIKE ?
        ORDER BY created_at DESC
    ");

    $searchTerm = "%$query%";
    $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
    $ads = $stmt->fetchAll();

    foreach ($ads as &$ad) {
        $stmtImg = $pdo->prepare("SELECT image_path FROM ad_images WHERE ad_id=?");
        $stmtImg->execute([$ad['id']]);
        $ad['images'] = $stmtImg->fetchAll(PDO::FETCH_COLUMN);
    }

    echo json_encode($ads);
    exit;
}
?>

