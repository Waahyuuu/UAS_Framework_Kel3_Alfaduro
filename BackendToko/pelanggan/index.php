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
    $result = $conn->query("SELECT * FROM pelanggan");
    $data = [];
    while ($row = $result->fetch_assoc()) {
      $data[] = $row;
    }
    echo json_encode($data);
    break;

  case 'POST':
    $input = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO pelanggan (nama, email, no_hp) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $input['nama'], $input['email'], $input['no_hp']);
    $stmt->execute();
    echo json_encode(["message" => "Pelanggan ditambahkan"]);
    break;

  case 'PUT':
    $input = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE pelanggan SET nama=?, email=?, no_hp=? WHERE id=?");
    $stmt->bind_param("sssi", $input['nama'], $input['email'], $input['no_hp'], $input['id']);
    $stmt->execute();
    echo json_encode(["message" => "Pelanggan diubah"]);
    break;

  case 'DELETE':
    $id = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM pelanggan WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(["message" => "Pelanggan dihapus"]);
    break;
}
?>
