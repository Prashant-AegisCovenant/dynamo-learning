import React from "react";
import { Typography } from "@mui/material";

const Header = () => {
  return (
    <Typography
      variant='h1'
      sx={{
        fontSize: "2.5rem",
        fontWeight: "bold",
        pt: 2,
      }}
    >
      Inventory Manager
    </Typography>
  );
};

export default Header;
