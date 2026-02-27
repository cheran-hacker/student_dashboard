import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './theme'; // Ensure you have the updated theme.js function

import StudentRegister from './components/StudentRegister';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminSettings from './components/AdminSettings';

// Protected Route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/admin/login" />;
};

function App() {
  // 1. STATE: Manage Dark Mode here
  const [darkMode, setDarkMode] = useState(false);

  // 2. THEME: Regenerate theme whenever darkMode changes
  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<StudentRegister darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/admin/login" element={<AdminLogin darkMode={darkMode} setDarkMode={setDarkMode} />} />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <PrivateRoute>
                <AdminSettings
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;