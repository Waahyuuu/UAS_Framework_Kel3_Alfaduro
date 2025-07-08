// Import library dan komponen yang dibutuhkan
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Untuk melakukan request API
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Fab,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material'; // Komponen UI dari MUI
import AddIcon from '@mui/icons-material/Add'; // Ikon tambah
import FormPelanggan from '../components/FormPelanggan'; // Form input pelanggan

const PelangganPage = () => {
  // State untuk menyimpan list pelanggan dari API
  const [pelangganList, setPelangganList] = useState([]);

  // State kontrol modal tambah/edit
  const [modalOpen, setModalOpen] = useState(false);

  // State untuk data yang sedang diedit
  const [editData, setEditData] = useState(null);

  // State untuk pencarian
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk pesan alert (sukses tambah/update/delete)
  const [alertMessage, setAlertMessage] = useState('');

  // State untuk dialog konfirmasi hapus
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // id pelanggan yang akan dihapus

  // Alamat API
  const API = 'http://localhost/backendtoko/pelanggan/index.php';

  // Mengambil data pelanggan dari API
  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setPelangganList(res.data); // Simpan hasil ke state
    } catch (err) {
      console.error("Gagal mengambil data pelanggan:", err);
    }
  };

  // Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi saat data form dikirim (tambah/update)
  const handleSubmit = async (data, id = null) => {
    try {
      if (id) {
        // Jika ada id, maka update data
        await axios.put(API, { ...data, id });
      } else {
        // Jika tidak ada id, maka tambah data baru
        await axios.post(API, data);
      }
      fetchData(); // Perbarui daftar pelanggan setelah submit
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    }
  };

  // Fungsi saat tombol edit ditekan
  const handleEdit = (item) => {
    setEditData(item); // Simpan data pelanggan yang akan diedit
    setModalOpen(true); // Buka modal form
  };

  // Buka dialog konfirmasi hapus
  const handleOpenDeleteDialog = (id) => {
    setSelectedId(id); // Simpan ID yang dipilih untuk dihapus
    setDeleteDialogOpen(true);
  };

  // Hapus data pelanggan setelah konfirmasi
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API}?id=${selectedId}`);
      fetchData(); // Refresh data
      setAlertMessage("Data pelanggan dihapus!"); // Tampilkan notifikasi
    } catch (err) {
      console.error("Gagal menghapus:", err);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  // Filter pelanggan berdasarkan pencarian
  const filteredPelanggan = pelangganList.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.no_hp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // TAMPILAN UI
  return (
    <Box sx={{ p: 2, maxWidth: '1280px', mx: 'auto' }}>
      {/* Judul halaman */}
      <Typography variant="h4" gutterBottom>
        Halaman Pelanggan
      </Typography>

      {/* Input pencarian */}
      <TextField
        label="Cari Pelanggan..."
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Daftar pelanggan dalam grid */}
      <Grid container spacing={2}>
        {filteredPelanggan.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: '200px',
                display: 'flex',
                width: "362px",
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" noWrap>
                  {item.nama}
                </Typography>
                <Typography variant="body2">Email: {item.email}</Typography>
                <Typography variant="body2">No HP: {item.no_hp}</Typography>
              </CardContent>

              {/* Tombol Edit dan Hapus */}
              <Box sx={{ p: 2, pt: 0 }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleOpenDeleteDialog(item.id)}
                  >
                    Hapus
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tombol tambah pelanggan (FAB) */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        onClick={() => {
          setEditData(null); // Kosongkan data form
          setModalOpen(true); // Buka form tambah
        }}
      >
        <AddIcon />
      </Fab>

      {/* Modal form tambah/edit pelanggan */}
      {modalOpen && (
        <FormPelanggan
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          editData={editData}
          setAlertMessage={setAlertMessage}
        />
      )}

      {/* Snackbar notifikasi berhasil */}
      {alertMessage && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => setAlertMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setAlertMessage("")}
            severity="success"
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      )}

      {/* Dialog konfirmasi hapus */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Yakin ingin menghapus data ini?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Ekspor halaman supaya bisa digunakan di router utama
export default PelangganPage;
