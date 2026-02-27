import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Radio, RadioGroup, FormControlLabel,
  MenuItem, Select, InputLabel, FormControl, Typography, Container,
  Box, Alert, Grid, InputAdornment, Chip, CircularProgress
} from '@mui/material';
import {
  Person, Email, Badge, School, LaptopMac, Engineering,
  ArrowForward, CheckCircle, Shield, Bolt, Wifi,
  LightMode, DarkMode
} from '@mui/icons-material';
import { IconButton, Tooltip, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import '../App.css';

const techOptions = ["C", "C++", "Java", "Python", "DS", "Algorithms", "React", "MERN", "HTML", "CSS", "Cloud", "Devops", "TypeScript", "Node.js", "Express", "MongoDB", "MySQL", "AWS", "Azure", "Docker", "Kubernetes", "UI/UX", "Figma", "Canva", "Postman", "Git", "GitHub", "Next.js", "Vue.js", "Angular", "PHP", "Laravel", "Swift", "Kotlin", "Flutter", "React Native", "Machine Learning", "Data Science", "Artificial Intelligence", "Cyber Security", "Blockchain"];
const deptOptions = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "CSBS", "BME", "CHEM", "FASHION", "AIML", "Cyber Security", "Robotics", "Aerospace", "Automobile", "Biotech", "Food Tech", "Textile", "Architecture"];

const TECH_COLORS = {
  "C": "#ef4444", "C++": "#f97316", "Java": "#eab308", "Python": "#22c55e",
  "DS": "#06b6d4", "Algorithms": "#6366f1", "React": "#61dafb",
  "MERN": "#10b981", "HTML": "#e34c26", "CSS": "#264de4",
  "Cloud": "#8b5cf6", "Devops": "#ec4899", "TypeScript": "#3178c6",
  "Node.js": "#339933", "Express": "#000000", "MongoDB": "#47A248",
  "MySQL": "#4479A1", "AWS": "#FF9900", "Azure": "#0089D6",
  "Docker": "#2496ED", "Kubernetes": "#326CE5", "UI/UX": "#F24E1E",
  "Figma": "#F24E1E", "Canva": "#00C4CC", "Postman": "#FF6C37",
  "Git": "#F05032", "GitHub": "#181717", "Next.js": "#000000",
  "Vue.js": "#4FC08D", "Angular": "#DD0031", "PHP": "#777BB4",
  "Laravel": "#FF2D20", "Swift": "#F05138", "Kotlin": "#7F52FF",
  "Flutter": "#02569B", "React Native": "#61DAFB", "Machine Learning": "#FF6F00",
  "Data Science": "#008BB9", "Artificial Intelligence": "#00A67E",
  "Cyber Security": "#D32F2F", "Blockchain": "#121D33"
};

const StudentRegister = ({ darkMode, setDarkMode }) => {
  const [formData, setFormData] = useState({
    registerNumber: '', name: '', email: '', year: '', department: '',
    accommodationType: 'Day Scholar', technologiesKnown: []
  });
  const [message, setMessage] = useState(null);
  const [maintenance, setMaintenance] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
    if (e.target.name === 'registerNumber') value = value.toUpperCase();
    if (e.target.name === 'email') value = value.toLowerCase();
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleTechToggle = (tech) => {
    const curr = formData.technologiesKnown;
    setFormData({
      ...formData,
      technologiesKnown: curr.includes(tech)
        ? curr.filter(t => t !== tech)
        : [...curr, tech]
    });
  };

  const validateForm = () => {
    if (!formData.name || formData.name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!formData.registerNumber || formData.registerNumber.trim().length < 3) return 'Register Number is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Valid email address is required';
    if (!formData.year) return 'Please select your year';
    if (!formData.department) return 'Please select your department';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await api.post('/students/register', formData);
      setSuccess(true);
      setMessage({ type: 'success', text: '🎉 Registration Successful! Welcome to BIT.' });
      setFormData({
        registerNumber: '', name: '', email: '', year: '', department: '',
        accommodationType: 'Day Scholar', technologiesKnown: []
      });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Error:", err);
      if (err.code === "ERR_NETWORK") {
        setMessage({ type: 'error', text: 'Server is offline. Please run "npm start" in the backend folder.' });
      } else if (err.response?.status === 503) {
        setMaintenance(true);
        setMessage({ type: 'error', text: 'System is under maintenance. Please try again later.' });
      } else {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Registration Failed. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingConfig) {
    return (
      <Box sx={{ height: '100vh', display: 'grid', placeItems: 'center', bgcolor: darkMode ? '#0f172a' : '#f8fafc' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#6366f1', mb: 2 }} size={48} />
          <Typography sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontFamily: 'Outfit' }}>Loading system status...</Typography>
        </Box>
      </Box>
    );
  }

  if (maintenance) {
    return (
      <Box className={`register-bg animated-bg ${darkMode ? 'dark' : ''}`}>
        <Box className="blob blob-1" /><Box className="blob blob-2" />
        <Box
          className={`${darkMode ? 'glass-dark' : 'glass-light'} slide-up`}
          sx={{ p: 6, textAlign: 'center', maxWidth: 460, borderRadius: '24px', zIndex: 1, position: 'relative' }}
        >
          <Engineering sx={{ fontSize: 80, color: '#f59e0b', mb: 2 }} />
          <Typography variant="h4" fontWeight="800" fontFamily="'Outfit', sans-serif" sx={{ color: darkMode ? '#f8fafc' : '#1e293b', mb: 1 }}>
            Under Maintenance
          </Typography>
          <Typography sx={{ color: darkMode ? '#94a3b8' : '#64748b', mb: 3 }}>
            We're improving things. Check back soon.
          </Typography>
          <Button
            variant="contained"
            className="btn-shimmer"
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
            onClick={() => window.open('/admin/login', '_blank')}
          >
            Admin Login
          </Button>
        </Box>
      </Box>
    );
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      background: darkMode ? 'rgba(30,41,59,0.5)' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      '& fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
      '&:hover fieldset': { borderColor: '#6366f1' },
      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
        boxShadow: darkMode ? '0 0 0 3px rgba(99,102,241,0.25)' : '0 0 0 3px rgba(99,102,241,0.15)',
      },
      '& input': { color: darkMode ? '#f1f5f9' : '#1e293b' },
      '& .MuiInputBase-input::placeholder': { color: darkMode ? '#94a3b8' : '#64748b', opacity: 1 },
    },
    '& .MuiInputLabel-root': { color: darkMode ? '#94a3b8' : '#64748b' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
  };

  return (
    <Box className={`register-bg animated-bg ${darkMode ? 'dark' : ''}`} sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background Blobs */}
      <Box className="blob blob-1" />
      <Box className="blob blob-2" />
      <Box className="blob blob-3" />

      {/* Floating Theme Toggle */}
      <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
        <Tooltip title={darkMode ? 'Switch to Light' : 'Switch to Dark'}>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              bgcolor: darkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': { transform: 'scale(1.1)', bgcolor: darkMode ? '#1e293b' : '#ffffff' }
            }}
          >
            {darkMode ? <LightMode sx={{ color: '#fbbf24' }} /> : <DarkMode sx={{ color: '#6366f1' }} />}
          </IconButton>
        </Tooltip>
      </Box>

      <Container maxWidth="lg" sx={{ zIndex: 1, position: 'relative', py: { xs: 4, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Box
            className="glass-card"
            sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
          >
            {/* --- LEFT SIDEBAR --- */}
            <Box
              sx={{
                flex: '0 0 320px',
                p: 5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: 'white',
                background: 'linear-gradient(160deg, #6a11cb 0%, #2575fc 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative circles */}
              <Box sx={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -70, right: -70, animation: 'floatBlob 10s ease-in-out infinite' }} />
              <Box sx={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -40, left: -40, animation: 'floatBlob 12s ease-in-out infinite reverse' }} />
              <Box sx={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: '45%', left: '70%', animation: 'floatBlob 8s ease-in-out infinite' }} />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* Badge */}
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, bgcolor: 'rgba(255,255,255,0.15)', px: 1.5, py: 0.5, borderRadius: '20px', mb: 3 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ade80', animation: 'pulseGlow 2s infinite' }} />
                  <Typography variant="caption" sx={{ letterSpacing: '0.08em', fontWeight: 800 }}>STUDENT NEXUS ONLINE</Typography>
                </Box>

                <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.7, fontSize: '0.75rem', fontWeight: 800 }}>
                  THE FUTURE OF PLACEMENT
                </Typography>
                <Typography variant="h2" fontWeight="900" fontFamily="'Outfit', sans-serif" sx={{ mb: 2, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  Gateway to<br />Excellence
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.85, lineHeight: 1.8, fontSize: '1rem' }}>
                  Join thousands of students who have launched their careers through our elite placement portal.
                </Typography>
              </Box>

              {/* Benefits */}
              <Box sx={{ position: 'relative', zIndex: 1, mt: 4 }}>
                {[
                  { icon: <Shield fontSize="small" />, text: "Secure & Private" },
                  { icon: <Bolt fontSize="small" />, text: "Instant Access" },
                  { icon: <Wifi fontSize="small" />, text: "Always Connected" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, opacity: 0.9 }}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '8px', p: 0.7, display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                      </Box>
                      <Typography variant="body2" fontWeight={500}>{item.text}</Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>

            {/* --- RIGHT FORM PANEL --- */}
            <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, overflowY: 'auto', maxHeight: { md: '90vh' }, bgcolor: darkMode ? '#111827' : 'white' }}>
              {/* Header Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
                <Box>
                  <Typography variant="h5" fontWeight="800" fontFamily="'Outfit', sans-serif" color={darkMode ? '#f8fafc' : '#1e293b'}>
                    Student Registration
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Fill in your details below</Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open('/admin/login', '_blank')}
                  sx={{
                    borderRadius: '20px', textTransform: 'none', fontWeight: 600,
                    borderColor: '#6366f1', color: '#6366f1',
                    '&:hover': { bgcolor: '#f0f0ff', borderColor: '#4f46e5' }
                  }}
                >
                  Admin Login
                </Button>
              </Box>

              {/* Success / Error Alert */}
              {message && (
                <Alert
                  severity={message.type}
                  icon={message.type === 'success' ? <CheckCircle /> : undefined}
                  sx={{
                    mb: 3, borderRadius: '12px',
                    ...(message.type === 'success' && {
                      bgcolor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0',
                    }),
                  }}
                >
                  {message.text}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Name */}
                  <Grid item xs={12}>
                    <TextField
                      label="Full Name" name="name" fullWidth required
                      value={formData.name} onChange={handleChange}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Person color="action" fontSize="small" /></InputAdornment> }}
                      sx={inputSx}
                    />
                  </Grid>

                  {/* Register No + Email */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Register No." name="registerNumber" fullWidth required
                      value={formData.registerNumber} onChange={handleChange}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Badge color="action" fontSize="small" /></InputAdornment> }}
                      sx={inputSx}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email" name="email" type="email" fullWidth required
                      value={formData.email} onChange={handleChange}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" fontSize="small" /></InputAdornment> }}
                      sx={inputSx}
                    />
                  </Grid>

                  {/* Year + Department */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required sx={inputSx}>
                      <InputLabel>Year</InputLabel>
                      <Select
                        name="year" value={formData.year} label="Year" onChange={handleChange}
                        startAdornment={<InputAdornment position="start"><School color="action" fontSize="small" sx={{ ml: 1 }} /></InputAdornment>}
                      >
                        <MenuItem value="1st Year">1st Year</MenuItem>
                        <MenuItem value="2nd Year">2nd Year</MenuItem>
                        <MenuItem value="3rd Year">3rd Year</MenuItem>
                        <MenuItem value="4th Year">4th Year</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required sx={inputSx}>
                      <InputLabel>Department</InputLabel>
                      <Select
                        name="department" value={formData.department} label="Department" onChange={handleChange}
                        startAdornment={<InputAdornment position="start"><LaptopMac color="action" fontSize="small" sx={{ ml: 1 }} /></InputAdornment>}
                      >
                        {deptOptions.map((dept) => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Accommodation */}
                  <Grid item xs={12}>
                    <Box sx={{ p: 2.5, bgcolor: darkMode ? 'rgba(30,41,59,0.3)' : '#f8fafc', borderRadius: '12px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}` }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#334155' }}>
                        Accommodation Type
                      </Typography>
                      <RadioGroup row name="accommodationType" value={formData.accommodationType} onChange={handleChange}>
                        <FormControlLabel
                          value="Day Scholar" control={<Radio size="small" sx={{ color: '#6366f1', '&.Mui-checked': { color: '#6366f1' } }} />}
                          label={<Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#cbd5e1' : '#475569' }}>Day Scholar</Typography>}
                        />
                        <FormControlLabel
                          value="Hosteler" control={<Radio size="small" sx={{ color: '#6366f1', '&.Mui-checked': { color: '#6366f1' } }} />}
                          label={<Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#cbd5e1' : '#475569' }}>Hosteler</Typography>}
                        />
                      </RadioGroup>
                    </Box>
                  </Grid>

                  {/* Tech Skills */}
                  <Grid item xs={12}>
                    <Box sx={{ p: 2.5, bgcolor: darkMode ? 'rgba(30,41,59,0.3)' : '#f8fafc', borderRadius: '12px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}` }}>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#334155' }}>
                        Technical Skills
                        {formData.technologiesKnown.length > 0 && (
                          <Box component="span" sx={{ ml: 1, bgcolor: '#6366f1', color: 'white', borderRadius: '20px', px: 1, py: 0.2, fontSize: '0.65rem', fontWeight: 700 }}>
                            {formData.technologiesKnown.length} selected
                          </Box>
                        )}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {techOptions.map((tech) => {
                          const selected = formData.technologiesKnown.includes(tech);
                          return (
                            <Chip
                              key={tech}
                              label={tech}
                              clickable
                              onClick={() => handleTechToggle(tech)}
                              sx={{
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: selected ? 'scale(1.08)' : 'scale(1)',
                                bgcolor: selected ? (TECH_COLORS[tech] || '#6366f1') : (darkMode ? 'rgba(255,255,255,0.05)' : 'white'),
                                color: selected ? 'white' : (darkMode ? '#94a3b8' : '#64748b'),
                                border: `1.5px solid ${selected ? (TECH_COLORS[tech] || '#6366f1') : (darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0')}`,
                                boxShadow: selected ? `0 4px 12px ${(TECH_COLORS[tech] || '#6366f1')}40` : 'none',
                                '&:hover': {
                                  bgcolor: selected ? (TECH_COLORS[tech] || '#6366f1') : (darkMode ? 'rgba(255,255,255,0.1)' : '#f0f0ff'),
                                  transform: 'scale(1.1)',
                                },
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Submit */}
                  <Grid item xs={12}>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        endIcon={submitting ? null : <ArrowForward />}
                        disabled={submitting}
                        className="btn-shimmer"
                        sx={{
                          mt: 1, height: 54, borderRadius: '14px',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700, fontSize: '1rem',
                          textTransform: 'none',
                          letterSpacing: '0.03em',
                          background: success
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, #6366f1, #ec4899)',
                          boxShadow: success ? '0 10px 20px rgba(16,185,129,0.3)' : '0 10px 20px rgba(99,102,241,0.25)',
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {submitting ? (
                            <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center' }}>
                              <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> Processing...
                            </motion.div>
                          ) : success ? (
                            <motion.div key="success" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ display: 'flex', alignItems: 'center' }}>
                              <CheckCircle sx={{ mr: 1 }} /> Registered!
                            </motion.div>
                          ) : (
                            <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              Complete Registration
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box >
  );
};

export default StudentRegister;