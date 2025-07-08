import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Modal,
  Rating,
} from "@mui/material";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const FormFeedback = ({ open, onClose, onSubmit, editData, setAlertMessage }) => {
  const [form, setForm] = useState({ nama: "", email: "", pesan: "", rating: 0 });

  useEffect(() => {
    if (editData) {
      setForm({
        nama: editData.nama || "",
        email: editData.email || "",
        pesan: editData.pesan || "",
        rating: editData.rating || 0,
      });
    } else {
      setForm({ nama: "", email: "", pesan: "", rating: 0 });
    }
  }, [editData]);

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


  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styleModal}>
        <Typography variant="h6" mb={2}>
          {editData ? "Edit Feedback" : "Tambah Feedback"}
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
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Pesan"
            multiline
            rows={4}
            value={form.pesan}
            onChange={(e) => setForm({ ...form, pesan: e.target.value })}
            fullWidth
          />
          <Box>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={form.rating}
              onChange={(event, newValue) => {
                setForm({ ...form, rating: newValue });
              }}
            />
          </Box>
          <Button variant="contained" onClick={handleSubmit}>
            {editData ? "Update" : "Simpan"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default FormFeedback;
