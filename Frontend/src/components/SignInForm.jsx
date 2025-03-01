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
import googleIcon from "../assets/GoogleSVG.svg";
import auth1 from "../assets/auth1.png";
import { DarkMode, LightMode } from "@mui/icons-material";
import themeStore from "../stores/themeStore";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { error, loading, signIn, googleSignIn } = useAuthStore(
    (state) => state
  );
  const { theme, toggleTheme } = themeStore((state) => state);
  const navigate = useNavigate();

  const handleSignIn = (event) => {
    event.preventDefault();
    signIn(email, password, navigate);
  };

  const handleGoogleSignIn = async () => {
    await googleSignIn(navigate);
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
            src={auth1}
            alt="Auth Illustration"
            style={{ maxWidth: "100%", height: "auto", objectFit: "cover" }}
          />
        </Box>
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
            Sign In
          </Typography>
          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSignIn}>
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </form>
          <Box sx={{ display: "flex", flexDirection: "column", marginTop: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleGoogleSignIn}
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
              Sign in with Google
            </Button>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                sx={{ width: "48%" }}
              >
                Don't have an account?{" "}
                <a
                  href="/signup"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  Sign Up
                </a>
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                sx={{ width: "48%" }}
              >
                <a
                  href="/forgot-password"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  Forgot Password?
                </a>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
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
    </Container>
  );
};

export default SignInForm;
