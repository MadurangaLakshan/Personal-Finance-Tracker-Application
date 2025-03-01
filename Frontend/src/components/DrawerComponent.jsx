import React from "react";
import {
  Drawer,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const DrawerComponent = ({
  mobileOpen,
  handleDrawerToggle,
  activePage,
  setActivePage,
}) => {
  const pages = {
    Overview: <HomeIcon />,
    Incomes: <TrendingUpIcon />,
    Expenses: <TrendingDownIcon />,
    Account: <AccountCircleIcon />,
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {Object.keys(pages).map((text) => (
          <ListItem
            key={text}
            onClick={() => setActivePage(text)}
            selected={activePage === text}
          >
            <ListItemButton>
              <ListItemIcon>{pages[text]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 } }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="persistent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { width: 280 },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default DrawerComponent;
