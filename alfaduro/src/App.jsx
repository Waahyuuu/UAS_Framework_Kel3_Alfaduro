import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  Collapse,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StorageIcon from "@mui/icons-material/Storage"; // ⬅️ Tambahkan ikon Storage

import DashboardPage from "./pages/DashboardPage";
import ProdukPage from "./pages/ProdukPage";
import PelangganPage from "./pages/PelangganPage";
import TransaksiPage from "./pages/TransaksiPage";
import LaporanPage from "./pages/LaporanPage";
import Footer from "./components/Footer";

const drawerWidth = 240;

function App() {
  const [openMenu, setOpenMenu] = React.useState(true);

  const handleToggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Warehouse AlfaDhuro
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {/* Dashboard */}
              <ListItemButton component={Link} to="/">
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>

              {/* Dropdown Storage */}
              <ListItemButton onClick={handleToggleMenu}>
                <ListItemIcon><StorageIcon /></ListItemIcon>
                <ListItemText primary="Storage" />
                {openMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={openMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }} component={Link} to="/produk">
                    <ListItemIcon><InventoryIcon /></ListItemIcon>
                    <ListItemText primary="Produk" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }} component={Link} to="/pelanggan">
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary="Pelanggan" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }} component={Link} to="/transaksi">
                    <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
                    <ListItemText primary="Transaksi" />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* Feedback */}
              <ListItemButton component={Link} to="/laporan">
                <ListItemIcon><FeedbackIcon /></ListItemIcon>
                <ListItemText primary="Feedback" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Toolbar />
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/produk" element={<ProdukPage />} />
              <Route path="/pelanggan" element={<PelangganPage />} />
              <Route path="/transaksi" element={<TransaksiPage />} />
              <Route path="/laporan" element={<LaporanPage />} />
            </Routes>
          </Box>

          {/* Footer */}
          <Footer text={`© ${new Date().getFullYear()} Warehouse AlfaDhuro. All rights reserved.`} />
        </Box>
      </Box>
    </Router>
  );
}

export default App;
