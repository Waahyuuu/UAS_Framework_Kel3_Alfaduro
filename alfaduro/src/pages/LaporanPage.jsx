import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Button,
  Fab,
  Rating,
  Snackbar,
  Alert,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import FormFeedback from "../components/FormFeedback";

const API = "http://localhost/backendtoko/laporan/index.php";

const styleModal = {
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

const LaporanPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterRating, setFilterRating] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedPesan, setSelectedPesan] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setFeedbackList(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data, id = null) => {
    try {
      if (id) {
        await axios.put(API, { ...data, id });
      } else {
        await axios.post(API, data);
      }
      setAlertMessage(id ? "Feedback diperbarui!" : "Feedback ditambahkan!");
      fetchData();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      setAlertMessage("Gagal menyimpan feedback!");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus feedback ini?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}?id=${id}`);
      setAlertMessage("Feedback berhasil dihapus!");
      fetchData();
    } catch (err) {
      console.error("Gagal menghapus:", err);
      setAlertMessage("Gagal menghapus feedback!");
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setModalOpen(true);
  };

  const filteredFeedback = feedbackList.filter((item) => {
    const rating = parseFloat(item.rating || 0);
    return filterRating === 0 || Math.floor(rating) === filterRating;
  });

  return (
    <Box sx={{ p: 2, maxWidth: "1280px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Halaman Feedback
      </Typography>

      {/* Filter Rating */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography sx={{ mr: 2 }}>Rating:</Typography>
        <Rating
          value={filterRating}
          onChange={(_, newValue) => setFilterRating(newValue)}
          sx={{ color: "#fbc02d" }}
        />
        <Button onClick={() => setFilterRating(0)} size="small" sx={{ ml: 2 }}>
          Reset
        </Button>
      </Box>

      <Grid container spacing={2}>
        {filteredFeedback.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: "330px",
                width: "362px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 2,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
                <Typography variant="h6" noWrap>
                  {item.nama}
                </Typography>
                <Typography variant="body2" noWrap>
                  {item.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedPesan(item)}
                >
                  {item.pesan}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 2 }}
                >
                  <Rating
                    value={parseFloat(item.rating || 0)}
                    precision={0.5}
                    readOnly
                    size="medium"
                    sx={{ color: "#fbc02d" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {parseFloat(item.rating || 0).toFixed(1)} / 5
                  </Typography>
                </Stack>
              </CardContent>

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
                    color="error"
                    size="small"
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

      {/* Tombol Tambah Feedback */}
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

      {/* Modal Form Feedback */}
      {modalOpen && (
        <FormFeedback
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

      {/* Modal Detail Pesan */}
      <Modal open={!!selectedPesan} onClose={() => setSelectedPesan(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            p: 3,
          }}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {selectedPesan?.nama}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedPesan?.email}
            </Typography>
            <Box
              sx={{
                mt: 1,
                px: 2,
                py: 1,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                fontSize: "14px",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "pre-line",
              }}
            >
              {selectedPesan?.pesan}
            </Box>
            <Box textAlign="right" mt={2}>
              <Button
                variant="contained"
                size="small"
                onClick={() => setSelectedPesan(null)}
              >
                Tutup
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default LaporanPage;
