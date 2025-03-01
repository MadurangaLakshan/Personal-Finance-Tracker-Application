import React, { useState } from "react";
import { Box, CssBaseline, Toolbar, Typography, Grid } from "@mui/material";
import AppBarComponent from "../components/AppBarComponent";
import DrawerComponent from "../components/DrawerComponent";
import OverviewComponent from "../components/OverviewComponent";
import FormComponent from "../components/FormComponent";
import EntriesListComponent from "../components/EntriesListComponent";
import { Fade } from "@mui/material";
import ProfileComponent from "../components/ProfileComponent";

const drawerWidth = 280;

function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState("Overview");
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page === "Account") {
      setOpenProfileModal(true);
    } else {
      setOpenProfileModal(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBarComponent handleDrawerToggle={handleDrawerToggle} />

      <DrawerComponent
        setActivePage={handlePageChange}
        activePage={activePage}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${drawerWidth}px` },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          {activePage}
        </Typography>

        {activePage === "Overview" && (
          <Fade in={true} timeout={400}>
            <div>
              <OverviewComponent />
            </div>
          </Fade>
        )}

        {(activePage === "Incomes" || activePage === "Expenses") && (
          <Grid container spacing={3} justifyContent="center">
            <FormComponent activePage={activePage} />
            <EntriesListComponent activePage={activePage} />
          </Grid>
        )}
      </Box>

      {activePage === "Account" && (
        <ProfileComponent
          open={openProfileModal}
          onClose={() => setOpenProfileModal(false)}
          user={{ username: "JohnDoe", email: "john@example.com" }}
        />
      )}
    </Box>
  );
}

export default Dashboard;
