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
    $result = $conn->query("SELECT * FROM laporan");
    $data = [];
    while ($row = $result->fetch_assoc()) {
      $data[] = $row;
    }
    echo json_encode($data);
    break;

  case 'POST':
    $input = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO laporan (nama, email, pesan, rating) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $input['nama'], $input['email'], $input['pesan'], $input['rating']);
    $stmt->execute();
    echo json_encode(["message" => "Laporan ditambahkan"]);
    break;

  case 'PUT':
    $input = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE laporan SET nama=?, email=?, pesan=?, rating=? WHERE id=?");
    $stmt->bind_param("sssii", $input['nama'], $input['email'], $input['pesan'], $input['rating'], $input['id']);
    $stmt->execute();
    echo json_encode(["message" => "Laporan diubah"]);
    break;

  case 'DELETE':
    $id = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM laporan WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(["message" => "Laporan dihapus"]);
    break;

  default:
    http_response_code(405);
    echo json_encode(["message" => "Metode tidak diizinkan"]);
}
?>
