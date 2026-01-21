import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Switch, FormControlLabel, Avatar, Button, Alert, CircularProgress } from '@mui/material';
import AdminLayout from './AdminLayout';
import api from '../api';

const AdminSettings = ({ darkMode, setDarkMode }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/config/maintenance');
        setMaintenanceMode(res.data.maintenanceMode);
        setLoading(false);
      } catch (err) { 
        console.error('Failed to fetch config:', err);
        setLoading(false); 
      }
    };
    fetchConfig();
  }, []);

  const handleMaintenanceToggle = async (e) => {
    const newVal = e.target.checked;
    const previousVal = maintenanceMode;
    setMaintenanceMode(newVal);
    try {
      const res = await api.post('/config/maintenance', { value: newVal });
      setMaintenanceMode(res.data.maintenanceMode);
      setMsg(newVal ? "System is in Maintenance Mode" : "System is Live");
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { 
      console.error('Failed to update maintenance mode:', err);
      setMaintenanceMode(previousVal);
      setMsg('Failed to update maintenance mode');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <AdminLayout>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Settings</Typography>
      {msg && <Alert severity="info" sx={{ mb: 2 }}>{msg}</Alert>}
      
      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>A</Avatar>
          <Box>
            <Typography variant="h6">Admin Profile</Typography>
            <Typography variant="body2" color="textSecondary">Manage system configurations</Typography>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>Preferences</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          
          {/* DARK MODE SWITCH */}
          <FormControlLabel 
            control={
              <Switch 
                checked={darkMode} 
                // This triggers the state in App.js -> updates theme -> updates AdminLayout
                onChange={(e) => setDarkMode(e.target.checked)} 
                color="primary"
              />
            } 
            label="Dark Mode" 
          />

          {/* MAINTENANCE SWITCH */}
          {loading ? <CircularProgress /> : (
            <FormControlLabel 
              control={
                <Switch checked={maintenanceMode} onChange={handleMaintenanceToggle} color="error" />
              } 
              label="Maintenance Mode" 
            />
          )}
        </Box>
        <Button variant="contained">Save Changes</Button>
      </Paper>
    </AdminLayout>
  );
};

export default AdminSettings;