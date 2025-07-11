<?php
// DEBUGGING
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../db.php';

function uploadFile($file) {
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $filename = uniqid() . "_" . basename($file['name']);
    $targetFile = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        return $filename;
    }
    return null;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT * FROM produk ORDER BY id DESC");
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'POST':
        $id = $_POST['id'] ?? null;
        $foto = isset($_FILES['foto']) ? uploadFile($_FILES['foto']) : null;
        $nama = $_POST['nama'] ?? '';
        $kategori = $_POST['kategori'] ?? '';
        $harga = floatval($_POST['harga'] ?? 0);
        $stok = intval($_POST['stok'] ?? 0);
        $deskripsi = $_POST['deskripsi'] ?? '';

        if ($id) {
            // UPDATE
            if ($foto) {
                $stmt = $conn->prepare("UPDATE produk SET nama=?, kategori=?, harga=?, stok=?, deskripsi=?, foto=? WHERE id=?");
                $stmt->bind_param("ssdissi", $nama, $kategori, $harga, $stok, $deskripsi, $foto, $id);
            } else {
                $stmt = $conn->prepare("UPDATE produk SET nama=?, kategori=?, harga=?, stok=?, deskripsi=? WHERE id=?");
                $stmt->bind_param("ssdisi", $nama, $kategori, $harga, $stok, $deskripsi, $id);
            }
            $stmt->execute();
            echo json_encode(["message" => "Produk diperbarui"]);
        } else {
            // INSERT
            $stmt = $conn->prepare("INSERT INTO produk (nama, kategori, harga, stok, deskripsi, foto) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssdss", $nama, $kategori, $harga, $stok, $deskripsi, $foto);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Produk ditambahkan"]);
            } else {
                echo json_encode(["success" => false, "error" => $stmt->error]);
            }
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("DELETE FROM produk WHERE id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode(["message" => "Produk dihapus"]);
        }
        break;
}
?>
