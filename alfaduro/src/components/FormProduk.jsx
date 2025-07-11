import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";

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

const FormProduk = ({ open, onClose, onSubmit, editData, setAlertMessage }) => {
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    harga: "",
    stok: "",
    deskripsi: "",
    foto: null, // Tambahkan state untuk file foto
  });

  useEffect(() => {
    if (editData) {
      setForm({ ...editData, foto: null }); // Reset file foto
    } else {
      setForm({
        nama: "",
        kategori: "",
        harga: "",
        stok: "",
        deskripsi: "",
        foto: null,
      });
    }
  }, [editData]);

  const handleFileChange = (e) => {
    setForm({ ...form, foto: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    }

    await onSubmit(formData, editData?.id);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {editData ? "Edit Produk" : "Tambah Produk"}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Nama Produk"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            fullWidth
          />
          <TextField
            label="Kategori"
            value={form.kategori}
            onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            fullWidth
          />
          <TextField
            label="Harga"
            type="number"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: e.target.value })}
            fullWidth
          />
          <TextField
            label="Stok"
            type="number"
            value={form.stok}
            onChange={(e) => setForm({ ...form, stok: e.target.value })}
            fullWidth
          />
          <TextField
            label="Deskripsi"
            multiline
            rows={3}
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            fullWidth
          />
          <input
  type="file"
  accept="image/*"
  onChange={(e) => setForm({ ...form, foto: e.target.files[0] })}
/>

          <Button variant="contained" onClick={handleSubmit}>
            {editData ? "Update" : "Simpan"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default FormProduk;
