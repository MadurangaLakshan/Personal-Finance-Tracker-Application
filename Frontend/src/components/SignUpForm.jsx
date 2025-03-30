import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LightMode, DarkMode } from "@mui/icons-material";
import themeStore from "../stores/themeStore";
import googleIcon from "../assets/GoogleSVG.svg";
import auth2 from "../assets/auth2.png";
import useAuthStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const { error, success, loading, signUp, googleSignUp } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { theme, toggleTheme } = themeStore((state) => state);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    signUp(email, password, confirmPassword, navigate);
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ height: "100vh", display: "flex", alignItems: "center" }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flex: 1,
            marginRight: 3,
          }}
        >
          <img
            src={auth2}
            alt="Auth Illustration"
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Right Form Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
            padding: 3,
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom align="center">
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              required
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              required
              error={password.length > 0 && password.length < 6}
              helperText={
                password.length > 0 && password.length < 6
                  ? "Password must be at least 6 characters long."
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                minHeight: "80px",
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              required
              error={confirmPassword.length > 0 && confirmPassword !== password}
              helperText={
                confirmPassword.length > 0 && confirmPassword !== password
                  ? "Passwords do not match."
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                minHeight: "80px",
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
          </form>

          <Box sx={{ display: "flex", flexDirection: "column", marginTop: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => googleSignUp(window.location.pathname)}
              sx={{
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={googleIcon}
                alt="Google Logo"
                style={{ marginRight: 8, width: 24, height: 24, padding: 6 }}
              />
              Sign up with Google
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography variant="body2" color="textSecondary" align="center">
                Already have an account?{" "}
                <a
                  href="/signin"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  Sign In
                </a>
              </Typography>
            </Box>
          </Box>

          {/* Theme Toggle Button (Sun/Moon Icon) */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: theme === "dark" ? "white" : "black",
            }}
          >
            {theme === "dark" ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpForm;
