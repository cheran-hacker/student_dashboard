import React, { useState } from 'react';
import { 
  TextField, Button, Paper, Typography, Container, Box, 
  InputAdornment, Alert, CircularProgress, IconButton 
} from '@mui/material';
import { 
  AccountCircle, Lock, AdminPanelSettings, Visibility, VisibilityOff, Login 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css'; // Uses the same global animations

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate a small delay for smoother UX
    setTimeout(async () => {
      try {
        const res = await api.post('/admin/login', credentials);
        localStorage.setItem('token', res.data.token);
        navigate('/admin/dashboard');
      } catch (err) {
        setError('Invalid Username or Password');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="register-bg"> {/* Reusing the animated gradient background */}
      <Container maxWidth="xs" className="slide-up">
        <Paper 
          className="glass-card" 
          elevation={6}
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 4
          }}
        >
          {/* Header Icon */}
          <Box sx={{ 
            bgcolor: 'primary.main', 
            p: 2, 
            borderRadius: '50%', 
            mb: 2,
            boxShadow: '0 4px 20px rgba(94, 53, 177, 0.4)'
          }}>
            <AdminPanelSettings sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography variant="h5" fontWeight="800" color="#333" gutterBottom>
            Admin Portal
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to manage the system
          </Typography>

          {/* Animated Error Message */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ width: '100%', mb: 2, borderRadius: 2 }}
              className="fade-in"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              
              {/* Username Input */}
              <TextField 
                label="Username" 
                name="username" 
                fullWidth 
                required 
                value={credentials.username}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Input */}
              <TextField 
                label="Password" 
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                fullWidth 
                required 
                value={credentials.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth 
                disabled={loading}
                endIcon={!loading && <Login />}
                sx={{ 
                  mt: 1, 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #5e35b1 30%, #9162e4 90%)',
                  boxShadow: '0 3px 5px 2px rgba(94, 53, 177, .3)',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>

              <Button 
                variant="text" 
                size="small" 
                onClick={() => navigate('/register')}
                sx={{ mt: 1, color: 'text.secondary' }}
              >
                Back to Student Registration
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;