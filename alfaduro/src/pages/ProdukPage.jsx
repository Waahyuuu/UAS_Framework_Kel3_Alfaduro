import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FormProduk from "../components/FormProduk";

const ProdukPage = () => {
  const [produkList, setProdukList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const API = "http://localhost/backendtoko/produk/index.php";

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setProdukList(res.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (form, id = null) => {
    const payload = {
      ...form,
      harga: parseFloat(form.harga),
      stok: parseInt(form.stok),
    };

    try {
      if (id) {
        await axios.put(API, { ...payload, id });
        setAlertMessage("Produk berhasil diperbarui!");
      } else {
        await axios.post(API, payload);
        setAlertMessage("Produk berhasil ditambahkan!");
      }
      fetchData();
    } catch (err) {
      console.error("Gagal kirim data:", err);
      setAlertMessage("Gagal menyimpan produk!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      // Kirim id di body (sesuaikan dengan backend kamu)
      const res = await axios.delete(API, { data: { id } });
      console.log("Hapus response:", res.data);
      setAlertMessage("Produk berhasil dihapus!");
      fetchData();
    } catch (err) {
      console.error("Gagal hapus:", err.response || err.message);
      setAlertMessage("Gagal menghapus produk!");
    }
  };

  const filteredProduk = produkList.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 2, maxWidth: "1280px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Halaman Produk
      </Typography>

      <TextField
        label="Cari Produk..."
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Grid container spacing={2}>
        {filteredProduk.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: "250px",
                width: "362px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 2,
              }}
            >
              <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
                <Typography variant="h6" noWrap>
                  {item.nama} - {item.kategori}
                </Typography>
                <Typography variant="body2">
                  Harga: Rp {item.harga} | Stok: {item.stok}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.deskripsi}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setEditData(item);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

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

      {modalOpen && (
        <FormProduk
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          editData={editData}
          setAlertMessage={setAlertMessage}
        />
      )}

      {/* Snackbar Alert */}
      <Snackbar
        open={!!alertMessage}
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
    </Box>
  );
};

export default ProdukPage;
