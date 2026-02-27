import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, AdminPanelSettings, Lock, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api';
import '../App.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/admin/login', credentials);
      const data = response.data;

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid Username or Password');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Server is offline. Please ensure backend is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      color: '#e2e8f0',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.05)',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.5)' },
      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
        boxShadow: '0 0 0 3px rgba(99,102,241,0.2)',
      },
    },
    '& .MuiInputLabel-root': { color: '#94a3b8' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' },
    '& .MuiInputAdornment-root svg': { color: '#64748b' },
  };

  return (
    <Box className="login-bg animated-bg">
      {/* Floating Blobs */}
      <Box className="blob blob-1" />
      <Box className="blob blob-2" />
      <Box className="blob blob-3" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center', zIndex: 1 }}
      >
        <Box
          className="login-card"
          sx={{ width: { xs: '90%', sm: 420 }, p: { xs: 3, sm: 5 }, position: 'relative', overflow: 'hidden' }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
            >
              <Box
                className="login-logo-ring"
                sx={{
                  width: 72, height: 72,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2.5,
                }}
              >
                <AdminPanelSettings sx={{ color: 'white', fontSize: 34 }} />
              </Box>
            </motion.div>
            <Typography
              variant="h4"
              fontWeight="800"
              fontFamily="'Outfit', sans-serif"
              sx={{
                background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              STUDENT NEXUS
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', letterSpacing: '0.05em' }}>
              ACADEMIC INTELLIGENCE OS — Secure Access
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>ACADEMIC INTELLIGENCE OS</Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Alert
                severity="error"
                sx={{
                  mb: 3, borderRadius: '12px',
                  bgcolor: 'rgba(239,68,68,0.1)', color: '#fca5a5',
                  border: '1px solid rgba(239,68,68,0.2)',
                  '& .MuiAlert-icon': { color: '#f87171' },
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                id="admin-username"
                value={credentials.username}
                onChange={handleChange}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#64748b' }}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                className="btn-shimmer"
                sx={{
                  mt: 1, mb: 3, height: 52, borderRadius: '12px',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700, fontSize: '1rem',
                  textTransform: 'none',
                  letterSpacing: '0.03em',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 10px 20px rgba(99,102,241,0.2)',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In →'}
              </Button>
            </motion.div>
          </form>

          {/* Back Link */}
          <Box textAlign="center">
            <Typography
              variant="caption"
              sx={{
                color: '#475569', cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#818cf8' },
              }}
              onClick={() => navigate('/register')}
            >
              ← Back to Student Registration
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default AdminLogin;