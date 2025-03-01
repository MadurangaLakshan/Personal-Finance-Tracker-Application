import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import useProfileStore from "../stores/profileStore";

const ProfileComponent = ({ open, onClose, user }) => {
  const { profile, fetchProfile, updateProfile, logout } = useProfileStore();
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  // Keep the actual file object separate from the preview URL.
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (open) fetchProfile();
  }, [open, fetchProfile]);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(username, profilePicFile);
      setAlert({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
      onClose();
    } catch (error) {
      setAlert({
        open: true,
        message: "An error occurred while updating the profile.",
        severity: "error",
      });
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlert({ ...alert, open: false });
  };

  useEffect(() => {
    setUsername(profile.username);
    console.log(profile.username);
    setEmail(profile.email);
    setProfilePicPreview(profile.profilePic);
  }, [profile.username, profile.profilePic]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Account Settings
        </Typography>

        {/* Profile Picture Section */}
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            alt="Profile Picture"
            src={profilePicPreview || ""}
            sx={{
              width: 100,
              height: 100,
              marginBottom: 2,
              border: "2px solid #fff",
              boxShadow: 3,
            }}
          />
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.6)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.8)",
              },
            }}
          >
            <EditIcon sx={{ color: "white", fontSize: 20 }} />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfilePicChange}
            />
          </IconButton>
        </Box>

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={username ? "" : "Set a username"}
          sx={{
            marginBottom: 2,
            "& input::placeholder": {
              color: "gray",
            },
          }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          sx={{ marginBottom: 2 }}
          disabled
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSave}
        >
          Save
        </Button>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleLogout}
          sx={{ marginTop: 2 }}
        >
          Logout
        </Button>

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleAlertClose}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
  borderRadius: 2,
};

export default ProfileComponent;
