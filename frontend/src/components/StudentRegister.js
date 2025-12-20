import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Radio, RadioGroup, FormControlLabel, 
  MenuItem, Select, InputLabel, FormControl, Typography, Container, 
  Paper, Box, Alert, Grid, InputAdornment, Chip, CircularProgress 
} from '@mui/material';
import { 
  Person, Email, Badge, School, LaptopMac, Engineering, 
  ArrowForward 
} from '@mui/icons-material';
import api from '../api';
import '../App.css'; 

const techOptions = ["C", "C++", "Java", "Python", "DS", "Algorithms", "React", "MERN", "HTML", "CSS", "Cloud", "Devops"];
const deptOptions = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "CSBS", "BME", "CHEM", "FASHION"];

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    registerNumber: '', name: '', email: '', year: '', department: '',
    accommodationType: 'Day Scholar', technologiesKnown: []
  });
  const [message, setMessage] = useState(null);
  const [maintenance, setMaintenance] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const res = await api.get('/config/maintenance');
        setMaintenance(res.data.maintenanceMode);
      } catch (err) { 
        console.error("Backend offline or config fetch failed:", err); 
      } finally { 
        setLoadingConfig(false); 
      }
    };
    checkSystemStatus();
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;
    // Normalize register number to uppercase
    if (e.target.name === 'registerNumber') {
      value = value.toUpperCase();
    }
    // Normalize email to lowercase
    if (e.target.name === 'email') {
      value = value.toLowerCase();
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleTechToggle = (tech) => {
    const currentTechs = formData.technologiesKnown;
    if (currentTechs.includes(tech)) {
      setFormData({ ...formData, technologiesKnown: currentTechs.filter(t => t !== tech) });
    } else {
      setFormData({ ...formData, technologiesKnown: [...currentTechs, tech] });
    }
  };

  const validateForm = () => {
    if (!formData.name || formData.name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (!formData.registerNumber || formData.registerNumber.trim().length < 3) {
      return 'Register Number is required and must be at least 3 characters';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Valid email address is required';
    }
    if (!formData.year) {
      return 'Please select your year';
    }
    if (!formData.department) {
      return 'Please select your department';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; 
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }
    
    setSubmitting(true); 
    setMessage(null);

    try {
      await api.post('/students/register', formData);
      
      setMessage({ type: 'success', text: 'Registration Successful! Welcome To Our College.' });
      setFormData({
        registerNumber: '', name: '', email: '', year: '', department: '',
        accommodationType: 'Day Scholar', technologiesKnown: []
      });
      
    } catch (err) {
      console.error("Error:", err);
      if (err.code === "ERR_NETWORK") {
        setMessage({ type: 'error', text: 'Server is offline. Please run "npm start" in backend folder.' });
      } else if (err.response && err.response.status === 503) {
        setMaintenance(true);
        setMessage({ type: 'error', text: 'System is under maintenance. Please try again later.' });
      } else if (err.response && err.response.status === 400) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Validation failed. Please check your input.' });
      } else {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Registration Failed. Please try again.' });
      }
    } finally {
      setSubmitting(false); 
    }
  };

  if (loadingConfig) return <Box sx={{height: '100vh', display: 'grid', placeItems: 'center'}}><CircularProgress /></Box>;

  if (maintenance) {
    return (
      <div className="register-bg">
        <Paper className="glass-card slide-up" sx={{ p: 6, textAlign: 'center', maxWidth: 500 }}>
          <Engineering sx={{ fontSize: 80, color: '#e73c7e', mb: 2 }} />
          <Typography variant="h4" fontWeight="800" gutterBottom>Under Maintenance</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.open('/admin/login', '_blank')}>Admin Login</Button>
        </Paper>
      </div>
    );
  }

  return (
    <div className="register-bg">
      <Container maxWidth="lg" className="slide-up">
        <Paper className="glass-card" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          
          <Box sx={{ flex: 1, p: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white' }} className="sidebar-gradient">
             <Box className="sidebar-circle" sx={{ top: -50, right: -50, width: 200, height: 200 }} />
             <Box className="sidebar-circle" sx={{ bottom: -50, left: -50, width: 150, height: 150 }} />
             <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>Welcome To BIT</Typography>
             <Typography variant="h3" fontWeight="900" sx={{ mb: 2 }}>Join the Future</Typography>
             <Typography variant="body1" sx={{ opacity: 0.9 }}>Complete your profile to access the College Portal.</Typography>
          </Box>

          <Box sx={{ flex: 1.5, p: { xs: 3, md: 5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="800" color="#333">Registration</Typography>
                <Button variant="outlined" size="small" onClick={() => window.open('/admin/login', '_blank')} sx={{ borderRadius: 20 }}>Admin Login</Button>
            </Box>
            
            {message && <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>{message.text}</Alert>}
            
            <form onSubmit={handleSubmit}>
              {/* Corrected Grid Usage for MUI v6 */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Full Name" name="name" fullWidth required value={formData.name} onChange={handleChange} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Register No." name="registerNumber" fullWidth required value={formData.registerNumber} onChange={handleChange} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><Badge color="action" /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email" name="email" type="email" fullWidth required value={formData.email} onChange={handleChange} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Year</InputLabel>
                    <Select name="year" value={formData.year} label="Year" onChange={handleChange} startAdornment={<InputAdornment position="start"><School color="action" sx={{ml:1}} /></InputAdornment>}>
                      <MenuItem value="1st Year">1st Year</MenuItem><MenuItem value="2nd Year">2nd Year</MenuItem><MenuItem value="3rd Year">3rd Year</MenuItem><MenuItem value="4th Year">4th Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Department</InputLabel>
                    <Select name="department" value={formData.department} label="Department" onChange={handleChange} startAdornment={<InputAdornment position="start"><LaptopMac color="action" sx={{ml:1}} /></InputAdornment>}>
                      {deptOptions.map((dept) => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                   <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Accommodation</Typography>
                    <RadioGroup row name="accommodationType" value={formData.accommodationType} onChange={handleChange}>
                      <FormControlLabel value="Day Scholar" control={<Radio />} label="Day Scholar" />
                      <FormControlLabel value="Hosteler" control={<Radio />} label="Hosteler" />
                    </RadioGroup>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Skills</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {techOptions.map((tech) => (
                      <Chip key={tech} label={tech} clickable 
                        color={formData.technologiesKnown.includes(tech) ? "secondary" : "default"} 
                        variant={formData.technologiesKnown.includes(tech) ? "filled" : "outlined"}
                        onClick={() => handleTechToggle(tech)}
                        sx={{ borderRadius: 1.5 }}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    size="large" 
                    endIcon={<ArrowForward />}
                    disabled={submitting} 
                    sx={{ 
                      mt: 2, height: 50, borderRadius: 2, 
                      bgcolor: '#5e35b1',
                      '&:hover': { bgcolor: '#4527a0' },
                      '&.Mui-disabled': { bgcolor: '#5e35b1', color: 'white', opacity: 0.9 }
                    }}
                  >
                    {submitting ? 'Processing...' : 'Complete Registration'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default StudentRegister;