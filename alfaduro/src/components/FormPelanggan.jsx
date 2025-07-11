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
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const hpRegex = /^[0-9]+$/;

      if (!form.nama.trim() || !form.email.trim() || !form.no_hp.trim()) {
        alert("Semua field wajib diisi.");
        return;
      }

      if (!emailRegex.test(form.email)) {
        alert("Format email tidak valid. Contoh: nama@email.com");
        return;
      }

      if (!hpRegex.test(form.no_hp)) {
        alert("Nomor HP hanya boleh berisi angka.");
        return;
      }

      await onSubmit(form, editData?.id);

      if (setAlertMessage) {
        setAlertMessage(editData ? "Data pelanggan diperbarui!" : "Data pelanggan ditambahkan!");
      }

      onClose();
    } catch (error) {
      alert("Gagal menyimpan data pelanggan.");
    }
  };

  // Tampilan UI Form di dalam modal
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styleModal}>
        <Typography variant="h6" mb={2}>
          {editData ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            fullWidth
          />

          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
          />

          <TextField
            label="No HP"
            value={form.no_hp}
            onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            fullWidth
          />

          <Button variant="contained" onClick={handleSubmit}>
            {editData ? 'Update' : 'Simpan'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default FormPelanggan;
