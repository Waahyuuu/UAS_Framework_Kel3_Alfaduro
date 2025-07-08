// Import library React dan hooks useState & useEffect
import React, { useState, useEffect } from 'react';
// Import komponen dari Material UI
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Modal,
} from '@mui/material';

// Style khusus untuk tampilan modal (popup form)
const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

// Komponen FormPelanggan menerima props dari parent
const FormPelanggan = ({ open, onClose, onSubmit, editData, setAlertMessage }) => {
  // State untuk menyimpan inputan form pelanggan
  const [form, setForm] = useState({ nama: '', email: '', no_hp: '' });

  // useEffect akan dijalankan saat editData berubah
  useEffect(() => {
    if (editData) {
      // Jika mode edit, isi form dengan data yang akan diedit
      setForm(editData);
    } else {
      // Jika bukan edit, kosongkan form
      setForm({ nama: '', email: '', no_hp: '' });
    }
  }, [editData]);

  // Fungsi yang dijalankan saat tombol "Simpan" atau "Update" diklik
const handleSubmit = async () => {
  try {
    // Regex untuk format email umum
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Validasi format email
    if (!emailRegex.test(form.email)) {
      alert("Format email tidak valid. Contoh: nama@email.com");
      return;
    }

    // Panggil fungsi onSubmit dari props dan kirim data form
    await onSubmit(form, editData?.id);

    // Tampilkan pesan notifikasi berhasil jika fungsi tersedia
    if (setAlertMessage) {
      setAlertMessage(editData ? "Data pelanggan diperbarui!" : "Data pelanggan ditambahkan!");
    }

    // Tutup modal setelah submit
    onClose();
  } catch (error) {
    alert("Gagal menyimpan data pelanggan.");
  }
};



  // Tampilan UI Form di dalam modal
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styleModal}>
        {/* Judul modal: menyesuaikan mode edit/tambah */}
        <Typography variant="h6" mb={2}>
          {editData ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
        </Typography>

        {/* Stack form input dengan spasi antar elemen */}
        <Stack spacing={2}>
          {/* Input Nama */}
          <TextField
            label="Nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            fullWidth
          />

          {/* Input Email */}
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
          />

          {/* Input Nomor HP */}
          <TextField
            label="No HP"
            value={form.no_hp}
            onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
            fullWidth
          />

          {/* Tombol Simpan/Update */}
          <Button variant="contained" onClick={handleSubmit}>
            {editData ? 'Update' : 'Simpan'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

// Ekspor komponen supaya bisa digunakan di file lain
export default FormPelanggan;
