import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Card,
  Typography,
  Button,
  Box,
  TextField,
  Container,
} from "@mui/material";
import {
  FaBox,
  FaUsers,
  FaCashRegister,
  FaComments,
  FaArrowCircleRight,
} from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    produk: 0,
    pelanggan: 0,
    transaksi: 0,
    laporan: 0,
  });

  const [pelangganList, setPelangganList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [produkRes, pelangganRes, transaksiRes, laporanRes] =
          await Promise.all([
            axios.get("http://localhost/backendtoko/produk/index.php"),
            axios.get("http://localhost/backendtoko/pelanggan/index.php"),
            axios.get("http://localhost/backendtoko/transaksi/index.php"),
            axios.get("http://localhost/backendtoko/laporan/index.php"),
          ]);

        setCounts({
          produk: produkRes.data.length,
          pelanggan: pelangganRes.data.length,
          transaksi: transaksiRes.data.length,
          laporan: laporanRes.data.length,
        });

        setPelangganList(pelangganRes.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchCounts();
  }, []);

  const menu = [
    {
      label: "Produk",
      count: counts.produk,
      path: "/produk",
      icon: <FaBox />,
      bg: "#00BCD4",
    },
    {
      label: "Pelanggan",
      count: counts.pelanggan,
      path: "/pelanggan",
      icon: <FaUsers />,
      bg: "#4CAF50",
    },
    {
      label: "Transaksi",
      count: counts.transaksi,
      path: "/transaksi",
      icon: <FaCashRegister />,
      bg: "#FF9800",
    },
    {
      label: "Laporan",
      count: counts.laporan,
      path: "/laporan",
      icon: <FaComments />,
      bg: "#F44336",
    },
  ];

  const filteredPelanggan = pelangganList.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.no_hp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

 <Grid container spacing={2}>
  {menu.map((item, index) => (
    <Grid item key={index}>
      <Card
        sx={{
          backgroundColor: item.bg,
          color: "white",
          width: "260px", // ini panjang box
          height: "150px", // tinggi bisa diatur bebas
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          px: 1,
          py: 1,
        }}
      >
        {/* Konten atas */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingleft: 2,
            paddingRight: 2,
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* Kiri: Text */}
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {item.count}
            </Typography>
            <Typography variant="h6">{item.label}</Typography>
          </Box>

          {/* Kanan: Icon */}
          <Box sx={{ fontSize: 65, opacity: 0.3 }}>{item.icon}</Box>
        </Box>

        {/* Tombol bawah */}
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Button
            onClick={() => navigate(item.path)}
            endIcon={<FaArrowCircleRight />}
            sx={{
              color: "#fff",
              textTransform: "none",
              fontSize: "0.7rem",
              minWidth: 0,
              "&:hover": {
                color: "#e0e0e0",
              },
            }}
          >
            Selengkapnya
          </Button>
        </Box>
      </Card>
    </Grid>
  ))}
</Grid>


        {/* Tabel Pelanggan */}
        <Box mt={6}>
          <Typography variant="h6" gutterBottom>
            Customer AlfaDhuro
          </Typography>

          <TextField
            label="Cari pelanggan..."
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredPelanggan.map((item, index) => ({
                id: item.id,
                no: index + 1,
                nama: item.nama,
                email: item.email,
                no_hp: item.no_hp,
              }))}
              columns={[
                { field: "no", headerName: "No", width: 80 },
                { field: "nama", headerName: "Nama", flex: 1 },
                { field: "email", headerName: "Email", flex: 1 },
                { field: "no_hp", headerName: "No HP", flex: 1 },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              disableSelectionOnClick
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 1,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;
