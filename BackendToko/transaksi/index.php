<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
    if (isset($_GET['id']) && isset($_GET['withDetail'])) {
      // Ambil detail transaksi
      $id = intval($_GET['id']);
      $stmt = $conn->prepare("
        SELECT td.id_produk, td.jumlah, p.nama AS nama_produk
        FROM transaksi_detail td
        JOIN produk p ON td.id_produk = p.id
        WHERE td.id_transaksi = ?
      ");
      $stmt->bind_param("i", $id);
      $stmt->execute();
      $result = $stmt->get_result();
      $detail = [];
      while ($row = $result->fetch_assoc()) {
        $detail[] = $row;
      }
      echo json_encode(["detail" => $detail]);
      break;
    }

    // Ambil daftar transaksi utama
    $result = $conn->query("
      SELECT transaksi.id, pelanggan.nama AS pelanggan, transaksi.tanggal, transaksi.total
      FROM transaksi
      JOIN pelanggan ON transaksi.id_pelanggan = pelanggan.id
    ");
    $data = [];
    while ($row = $result->fetch_assoc()) {
      $data[] = $row;
    }
    echo json_encode($data);
    break;

  case 'POST':
    $input = json_decode(file_get_contents("php://input"), true);

    // 1. Simpan transaksi utama
    $stmt = $conn->prepare("INSERT INTO transaksi (id_pelanggan, tanggal, total) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $input['id_pelanggan'], $input['tanggal'], $input['total']);
    $stmt->execute();
    $id_transaksi = $conn->insert_id;

    // 2. Simpan setiap item ke transaksi_detail dan kurangi stok
    foreach ($input['items'] as $item) {
      $id_produk = intval($item['id_produk']);
      $jumlah = intval($item['jumlah']);

      // Simpan detail
      $stmt_detail = $conn->prepare("INSERT INTO transaksi_detail (id_transaksi, id_produk, jumlah) VALUES (?, ?, ?)");
      $stmt_detail->bind_param("iii", $id_transaksi, $id_produk, $jumlah);
      $stmt_detail->execute();

      // Update stok
      $stmt_stok = $conn->prepare("UPDATE produk SET stok = stok - ? WHERE id = ?");
      $stmt_stok->bind_param("ii", $jumlah, $id_produk);
      $stmt_stok->execute();
    }

    echo json_encode(["message" => "Transaksi berhasil disimpan."]);
    break;

  case 'PUT':
  $input = json_decode(file_get_contents("php://input"), true);
  $id_transaksi = $input['id'];
  $items = $input['items'];

  // 1. Update transaksi utama
  $stmt = $conn->prepare("UPDATE transaksi SET id_pelanggan=?, tanggal=?, total=? WHERE id=?");
  $stmt->bind_param("issi", $input['id_pelanggan'], $input['tanggal'], $input['total'], $id_transaksi);
  $stmt->execute();

  // 2. Ambil data lama untuk rollback stok
  $resultOld = $conn->query("SELECT * FROM transaksi_detail WHERE id_transaksi=$id_transaksi");
  while ($row = $resultOld->fetch_assoc()) {
    $conn->query("UPDATE produk SET stok = stok + {$row['jumlah']} WHERE id={$row['id_produk']}");
  }

  // 3. Hapus detail lama
  $conn->query("DELETE FROM transaksi_detail WHERE id_transaksi=$id_transaksi");

  // 4. Insert ulang detail baru + update stok
  foreach ($items as $item) {
    $id_produk = $item['id_produk'];
    $jumlah = $item['jumlah'];

    $stmtDetail = $conn->prepare("INSERT INTO transaksi_detail (id_transaksi, id_produk, jumlah) VALUES (?, ?, ?)");
    $stmtDetail->bind_param("iii", $id_transaksi, $id_produk, $jumlah);
    $stmtDetail->execute();

    $conn->query("UPDATE produk SET stok = stok - $jumlah WHERE id=$id_produk");
  }

  echo json_encode(["message" => "Transaksi diupdate"]);
  break;

  case 'DELETE':
    $id = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM transaksi WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(["message" => "Transaksi dihapus"]);
    break;

  default:
    http_response_code(405);
    echo json_encode(["message" => "Metode tidak diizinkan"]);
}

if ($method === 'POST' || $method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $tanggal = $data['tanggal'] ?? '';

    if ($tanggal && strtotime($tanggal) > strtotime(date("Y-m-d"))) {
        http_response_code(400);
        echo json_encode(["error" => "Tanggal tidak boleh di masa depan."]);
        exit;
    }

    // lanjutkan menyimpan transaksi...
}


?>
