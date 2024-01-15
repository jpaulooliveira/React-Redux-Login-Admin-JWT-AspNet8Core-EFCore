import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./pages/global/Sidebar";
import Dashboard from "./pages/dashboard";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { ColorModeContext, useMode } from "./context/ThemeContext";
import Topbar from "./pages/global/Topbar";
import history from "./helpers/History";
import Login from "./pages/login/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [theme, colorMode] = useMode();
  const defaultTheme = createTheme();
  const location = useLocation(); // Get the current route location

  history.navigate = useNavigate();
  history.location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={!isLoginPage ? theme : defaultTheme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && <Sidebar />} {/* Conditionally render sidebar */}
          <main className="content">
            {!isLoginPage && <Topbar />} {/* Conditionally render topbar */}
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />           

              
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;
