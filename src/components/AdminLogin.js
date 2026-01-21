import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid Username or Password');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('Server is offline. Please ensure backend is running on port 5000.');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #a855f7 0%, #d8b4fe 100%)' }}>
      <Card sx={{ width: 380, p: 4, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ bgcolor: '#5b21b6', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <AdminPanelSettings sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#1e293b' }}>Admin Portal</Typography>
            <Typography variant="body2" color="textSecondary">Sign in to manage the system</Typography>
          </Box>
          
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleLogin}>
            <TextField 
                fullWidth 
                label="Username" 
                name="username" 
                margin="normal" 
                value={credentials.username}
                onChange={handleChange}
                autoFocus
            />
            <TextField 
                fullWidth 
                label="Password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                margin="normal" 
                value={credentials.password}
                onChange={handleChange}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                }}
            />
            
            <Button 
                fullWidth 
                type="submit" 
                variant="contained" 
                size="large" 
                sx={{ mt: 3, mb: 2, borderRadius: 2, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, textTransform: 'none', fontSize: '1rem' }}
            >
                Login &rarr;
            </Button>
          </form>

          <Box textAlign="center" mt={2}>
             <Typography variant="caption" sx={{ color: '#64748b', cursor: 'pointer', '&:hover': {textDecoration: 'underline'} }} onClick={() => navigate('/register')}>
                 Back to Student Registration
             </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminLogin;