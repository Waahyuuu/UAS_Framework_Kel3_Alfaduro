import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = ({ text }) => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 2,
        borderTop: "1px solid #ddd",
        mt: 2,
        color: "text.secondary",
      }}
    >
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
};

export default Footer;
