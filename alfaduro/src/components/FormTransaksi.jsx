// Import library React dan hooks
import React, { useState, useEffect } from "react";

// Import komponen dari MUI (Material UI)
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Style modal untuk menampilkan form di tengah layar
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

// Komponen utama: FormTransaksi
const FormTransaksi = ({
  open,             // State buka/tutup modal
  onClose,          // Fungsi untuk menutup modal
  onSubmit,         // Fungsi yang dijalankan saat form disubmit
  pelangganList,    // Data pelanggan (untuk dropdown)
  produkList,       // Data produk (untuk dropdown)
  editData,         // Data yang akan diedit (jika ada)
  showSnackbar,     // Fungsi untuk menampilkan notifikasi
}) => {
  // State untuk form transaksi utama
  const [form, setForm] = useState({
    id_pelanggan: "",
    tanggal: "",
    total: 0,
  });

  // State untuk item produk yang dibeli
  const [items, setItems] = useState([]);

  // Saat modal dibuka, isi form jika editData ada
  useEffect(() => {
    if (editData) {
      setForm({
        id_pelanggan: editData.id_pelanggan || "",
        tanggal: editData.tanggal || "",
        total: editData.total || 0,
      });
      setItems(editData.items || []);
    } else {
      // Reset form jika tambah baru
      setForm({ id_pelanggan: "", tanggal: "", total: 0 });
      setItems([]);
    }
  }, [editData]);

  // Hitung total otomatis berdasarkan daftar item
  useEffect(() => {
    if (!Array.isArray(items)) return;
    let total = 0;
    for (const item of items) {
      const produk = produkList.find(
        (p) => parseInt(p.id) === parseInt(item.id_produk)
      );
      if (produk && item.jumlah) {
        total += produk.harga * parseInt(item.jumlah);
      }
    }
    // Update nilai total dalam form
    setForm((prev) => ({ ...prev, total }));
  }, [items, produkList]);

  // Tambah item produk ke daftar
  const addItem = () => {
    const defaultId = produkList.length > 0 ? produkList[0].id : "";
    setItems([...items, { id_produk: defaultId, jumlah: 1 }]);
  };

  // Update item berdasarkan index, key dan value
  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  // Hapus satu item dari daftar produk
  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Fungsi submit form transaksi
  const handleSubmit = () => {
    // Validasi input form
    if (!form.id_pelanggan || !form.tanggal || items.length === 0) {
      showSnackbar("Harap lengkapi data transaksi dan minimal 1 produk.", "warning");
      return;
    }

    // Kirim data ke parent
    onSubmit({ ...form, items }, editData?.id);

    // Reset form setelah submit
    setForm({ id_pelanggan: "", tanggal: "", total: 0 });
    setItems([]);
    onClose();
  };

  // UI modal form transaksi
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Judul Form */}
        <Typography variant="h6">
          {editData ? "Edit Transaksi" : "Tambah Transaksi"}
        </Typography>

        {/* Isi Form */}
        <Stack spacing={2} mt={2}>
          {/* Dropdown pelanggan */}
          <TextField
            select
            label="Pelanggan"
            value={form.id_pelanggan}
            onChange={(e) =>
              setForm({ ...form, id_pelanggan: e.target.value })
            }
            fullWidth
          >
            {pelangganList.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.nama}
              </MenuItem>
            ))}
          </TextField>

          {/* Input tanggal transaksi */}
          <TextField
            type="date"
            label="Tanggal"
            InputLabelProps={{ shrink: true }}
            value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
            fullWidth
          />

          {/* Label daftar produk */}
          <Typography fontWeight="bold">Daftar Produk</Typography>

          {/* List produk yang dipilih */}
          {items.map((item, i) => (
            <Stack key={i} direction="row" spacing={1}>
              {/* Dropdown produk */}
              <TextField
                select
                label="Produk"
                value={item.id_produk}
                onChange={(e) => updateItem(i, "id_produk", e.target.value)}
                sx={{ flex: 1 }}
              >
                {produkList.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nama} (Rp.{p.harga})
                  </MenuItem>
                ))}
              </TextField>

              {/* Input jumlah produk */}
              <TextField
                label="Jumlah"
                type="number"
                value={item.jumlah}
                onChange={(e) => updateItem(i, "jumlah", e.target.value)}
                sx={{ width: 100 }}
              />

              {/* Tombol hapus produk */}
              <IconButton color="error" onClick={() => removeItem(i)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}

          {/* Tombol tambah produk */}
          <Button variant="outlined" onClick={addItem}>
            Tambah Produk
          </Button>

          {/* Total harga (otomatis, tidak bisa diedit) */}
          <TextField
            label="Total (otomatis)"
            value={form.total}
            InputProps={{ readOnly: true }}
            fullWidth
          />

          {/* Tombol simpan/update */}
          <Button variant="contained" onClick={handleSubmit}>
            {editData ? "Update" : "Simpan"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

// Ekspor komponen
export default FormTransaksi;
