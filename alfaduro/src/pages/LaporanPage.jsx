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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import FormFeedback from "../components/FormFeedback";

const API = "http://localhost/backendtoko/laporan/index.php";

const LaporanPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterRating, setFilterRating] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchData = async () => {
    const res = await axios.get(API);
    setFeedbackList(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data, id = null) => {
    if (id) {
      await axios.put(API, { ...data, id });
    } else {
      await axios.post(API, data);
    }
    fetchData();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}?id=${id}`);
    fetchData();
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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Daftar Feedback
      </Typography>

      {/* Filter Rating */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography sx={{ mr: 2 }}>Rating Customer :</Typography>
        <Rating
          value={filterRating}
          onChange={(_, newValue) => setFilterRating(newValue)}
        />
        <Button
          onClick={() => setFilterRating(0)}
          size="small"
          sx={{ ml: 2 }}
        >
          Reset
        </Button>
      </Box>

      {/* List Feedback */}
      <Grid container spacing={2}>
        {filteredFeedback.map((item) => (
          <Grid item xs={12} sm={6} key={item.id}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6">{item.nama}</Typography>
                <Typography color="text.secondary">{item.email}</Typography>
                <Typography sx={{ mt: 1 }}>{item.pesan}</Typography>
                <Rating
                  value={parseFloat(item.rating || 0)}
                  precision={0.5}
                  readOnly
                />
                <Stack direction="row" spacing={1} mt={2}>
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
              </CardContent>
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
    </Box>
  );
};

export default LaporanPage;
