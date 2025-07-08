// Import React dan hooks
import React, { useState, useEffect } from "react";
import axios from "axios";

// Import komponen MUI
import {
  Box, Typography, Card, CardContent, Stack, Fab, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, List, ListItem, ListItemText,
  TextField, Grid, Snackbar, Alert,
} from "@mui/material";

// Import komponen date picker dari MUI
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"; // Untuk manipulasi tanggal

// Import ikon dan komponen tambahan
import AddIcon from "@mui/icons-material/Add";
import CrudButton from "../components/CrudButton";
import FormTransaksi from "../components/FormTransaksi";

// Komponen utama halaman transaksi
const TransaksiPage = () => {
  // State utama
  const [transaksiList, setTransaksiList] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [produkList, setProdukList] = useState([]);

  // Modal tambah/edit transaksi
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Dialog detail transaksi
  const [detailData, setDetailData] = useState(null);

  // Pencarian dan filter tanggal
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Snackbar notifikasi
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fungsi menampilkan notifikasi
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Menutup notifikasi
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const API = "http://localhost/backendtoko/transaksi/index.php";

  // Ambil semua data saat pertama render
  useEffect(() => {
    fetchTransaksi();
    fetchPelanggan();
    fetchProduk();
  }, []);

  // Ambil data transaksi
  const fetchTransaksi = async () => {
    try {
      const res = await axios.get(API);
      const transaksiData = res.data;

      // Ambil detail item tiap transaksi
      for (let transaksi of transaksiData) {
        const detailRes = await axios.get(`${API}?id=${transaksi.id}&withDetail=true`);
        transaksi.detail = detailRes.data.detail || [];
      }

      setTransaksiList(transaksiData);
    } catch (err) {
      console.error("Gagal ambil transaksi:", err);
      showSnackbar("Gagal mengambil data transaksi.", "error");
    }
  };

  // Ambil daftar pelanggan
  const fetchPelanggan = async () => {
    try {
      const res = await axios.get("http://localhost/backendtoko/pelanggan/index.php");
      setPelangganList(res.data);
    } catch (err) {
      console.error("Gagal ambil pelanggan:", err);
    }
  };

  // Ambil daftar produk
  const fetchProduk = async () => {
    try {
      const res = await axios.get("http://localhost/backendtoko/produk/index.php");
      setProdukList(res.data);
    } catch (err) {
      console.error("Gagal ambil produk:", err);
    }
  };

  // Tambah / Update transaksi
  const handleSubmit = async (form, id = null) => {
    const payload = {
      ...form,
      total: parseFloat(form.total),
      items: form.items.map((item) => ({
        ...item,
        jumlah: parseInt(item.jumlah),
      })),
    };

    try {
      if (id) {
        await axios.put(API, { ...payload, id });
        showSnackbar("Transaksi berhasil diperbarui!");
      } else {
        await axios.post(API, payload);
        showSnackbar("Transaksi berhasil ditambahkan!");
      }
      fetchTransaksi(); // Refresh list
    } catch (err) {
      console.error("Gagal simpan data:", err);
      showSnackbar("Gagal menyimpan data transaksi.", "error");
    }
  };

  // Edit transaksi
  const handleEdit = (item) => {
    setEditData(item);
    setModalOpen(true);
  };

  // Hapus transaksi
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axios.delete(`${API}?id=${id}`);
      fetchTransaksi();
      showSnackbar("Transaksi berhasil dihapus!");
    } catch (err) {
      console.error("Gagal hapus data:", err);
      showSnackbar("Gagal menghapus data transaksi.", "error");
    }
  };

  // Lihat detail transaksi
  const handleDetail = (item) => {
    const detailWithNamaProduk = item.detail?.map((d) => ({
      ...d,
      nama_produk: d.nama_produk || `Produk ID ${d.id_produk}`,
    }));
    setDetailData({ ...item, detail: detailWithNamaProduk });
  };

  const closeDetail = () => {
    setDetailData(null);
  };

  // Filter berdasarkan pencarian dan rentang tanggal
  const filteredTransaksi = transaksiList.filter((item) => {
    const matchText =
      item.pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tanggal.toLowerCase().includes(searchTerm.toLowerCase());

    const tanggalItem = dayjs(item.tanggal);
    const afterStart = startDate ? tanggalItem.isAfter(dayjs(startDate).subtract(1, "day")) : true;
    const beforeEnd = endDate ? tanggalItem.isBefore(dayjs(endDate).add(1, "day")) : true;

    return matchText && afterStart && beforeEnd;
  });

  // Tampilan UI halaman
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Halaman Transaksi
      </Typography>

      {/* Filter pencarian dan tanggal */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <TextField
          label="Cari transaksi..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Tanggal Mulai"
            value={startDate}
            onChange={(val) => setStartDate(val)}
            format="DD-MM-YYYY"
          />
          <DatePicker
            label="Tanggal Akhir"
            value={endDate}
            onChange={(val) => setEndDate(val)}
            format="DD-MM-YYYY"
          />
        </LocalizationProvider>
      </Box>

      {/* List transaksi */}
      <Grid container spacing={2}>
        {filteredTransaksi.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card sx={{ height: "100%", width: "362px", boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6">{item.pelanggan}</Typography>
                <Typography>
                  Tanggal : {dayjs(item.tanggal).format("DD-MM-YYYY")}
                </Typography>
                <Typography>Total : Rp.{item.total}</Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  <CrudButton label="Edit" onClick={() => handleEdit(item)} />
                  <CrudButton label="Hapus" onClick={() => handleDelete(item.id)} />
                  <CrudButton label="Detail" onClick={() => handleDetail(item)} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tombol tambah transaksi */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        onClick={() => {
          setEditData(null);
          setModalOpen(true);
        }}
      >
        <AddIcon />
      </Fab>

      {/* Modal Form Transaksi */}
      <FormTransaksi
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        pelangganList={pelangganList}
        produkList={produkList}
        editData={editData}
        showSnackbar={showSnackbar}
      />

      {/* Dialog Detail Transaksi */}
      <Dialog open={!!detailData} onClose={closeDetail} fullWidth maxWidth="sm">
        <DialogTitle>Detail Transaksi</DialogTitle>
        <DialogContent>
          {detailData && (
            <>
              <DialogContentText>
                Pelanggan: {detailData.pelanggan}
              </DialogContentText>
              <DialogContentText>
                Tanggal: {dayjs(detailData.tanggal).format("DD-MM-YYYY")}
              </DialogContentText>
              <DialogContentText>
                Total: Rp.{detailData.total}
              </DialogContentText>
              <Typography variant="subtitle1" mt={2}>
                Produk:
              </Typography>
              <List>
                {detailData.detail?.map((d, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={`${d.nama_produk} x ${d.jumlah}`} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetail}>Tutup</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifikasi */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TransaksiPage;
