import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import themeStore from "./stores/themeStore";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { Fade } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";

function App() {
  const { theme } = themeStore((state) => state);

  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            transition: "background-color 0.2s ease, color 0.2s ease",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              <PrivateRoute>
                <Fade in={true} timeout={400}>
                  <div>
                    <Dashboard />
                  </div>
                </Fade>
              </PrivateRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <Fade in={true} timeout={400}>
                <div>
                  <SignInPage />
                </div>
              </Fade>
            }
          />
          <Route
            path="/signup"
            element={
              <Fade in={true} timeout={400}>
                <div>
                  <SignUpPage />
                </div>
              </Fade>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Fade in={true} timeout={400}>
                <div>
                  <PasswordResetPage />
                </div>
              </Fade>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
