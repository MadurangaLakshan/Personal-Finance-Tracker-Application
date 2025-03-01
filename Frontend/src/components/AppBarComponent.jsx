import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { DarkMode, LightMode } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import themeStore from "../stores/themeStore";

const AppBarComponent = ({ handleDrawerToggle, onProfileClick }) => {
  const { theme, toggleTheme } = themeStore((state) => state);

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Finance Tracker Application
        </Typography>
        <div>
          <IconButton
            onClick={toggleTheme}
            sx={{ color: theme === "dark" ? "white" : "black" }}
          >
            {theme === "dark" ? <DarkMode /> : <LightMode />}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
