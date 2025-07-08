<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include '../db.php';

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
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input || !isset($input['nama'])) {
      http_response_code(400);
      echo json_encode(["message" => "Data tidak lengkap"]);
      exit;
    }
    $stmt = $conn->prepare("INSERT INTO produk (nama, kategori, harga, stok, deskripsi) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdis", $input['nama'], $input['kategori'], $input['harga'], $input['stok'], $input['deskripsi']);
    $stmt->execute();
    echo json_encode(["message" => "Produk ditambahkan"]);
    break;

  case 'PUT':
    $input = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE produk SET nama=?, kategori=?, harga=?, stok=?, deskripsi=? WHERE id=?");
    $stmt->bind_param("ssdisi", $input['nama'], $input['kategori'], $input['harga'], $input['stok'], $input['deskripsi'], $input['id']);
    $stmt->execute();
    echo json_encode(["message" => "Produk diupdate"]);
    break;

  case 'DELETE':
    $id = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM produk WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(["message" => "Produk dihapus"]);
    break;
}
?>
