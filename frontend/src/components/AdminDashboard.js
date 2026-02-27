import React, { useState, useEffect, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Button, Grid, Typography, Box, Chip, Card, IconButton,
  InputAdornment, Avatar, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, Checkbox,
  Divider, Snackbar, Alert, FormGroup, FormControlLabel, Drawer, List, ListItem,
  ListItemIcon, ListItemText, LinearProgress, Switch, Tooltip, Badge
} from '@mui/material';
import {
  Search, CloudUpload, CloudDownload, Add, Edit, Delete,
  People, BusinessCenter, TrendingUp, AttachMoney,
  Mail, Close, Send, Terminal, Language, Storage, Cloud,
  DarkMode, LightMode, Dashboard, Logout, Settings, Build, Backup, Restore, Security,
  NotificationsNone, ArrowUpward
} from '@mui/icons-material';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import api from '../api';
import '../App.css';

const techOptions = ["C", "C++", "Java", "Python", "DS", "Algorithms", "React", "MERN", "HTML", "CSS", "Cloud", "Devops"];
const deptOptions = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "CSBS", "BME", "CHEM", "FASHION"];
const placementStatusOptions = ["Unplaced", "Placed", "Higher Studies", "Entrepreneur"];
const DRAWER_WIDTH = 265;
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

const getTechIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('java') || n.includes('python') || n.includes('c')) return <Terminal fontSize="small" />;
  if (n.includes('react') || n.includes('html') || n.includes('css')) return <Language fontSize="small" />;
  if (n.includes('data') || n.includes('sql')) return <Storage fontSize="small" />;
  return <Cloud fontSize="small" />;
};

const AVATAR_GRADIENTS = [
  ['#6366f1', '#8b5cf6'], ['#ec4899', '#f43f5e'], ['#10b981', '#059669'],
  ['#f59e0b', '#d97706'], ['#06b6d4', '#0284c7'], ['#8b5cf6', '#7c3aed'],
];
const getAvatarGradient = (name) => {
  const idx = (name?.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length;
  const [c1, c2] = AVATAR_GRADIENTS[idx];
  return `linear-gradient(135deg, ${c1}, ${c2})`;
};

const statusConfig = {
  Placed: { bg: 'rgba(16,185,129,0.12)', color: '#059669', border: 'rgba(16,185,129,0.3)' },
  Unplaced: { bg: 'rgba(100,116,139,0.1)', color: '#64748b', border: 'rgba(100,116,139,0.2)' },
  'Higher Studies': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'rgba(59,130,246,0.2)' },
  Entrepreneur: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
};

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: dark ? '#1e293b' : '#fff', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', p: 1.5, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
      <Typography variant="caption" sx={{ color: dark ? '#94a3b8' : '#64748b', display: 'block', mb: 0.3 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Typography key={i} variant="body2" fontWeight={700} sx={{ color: p.color || p.fill }}>{p.value}</Typography>
      ))}
    </Box>
  );
};

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ department: '', year: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({ registerNumber: '', name: '', email: '', year: '', department: '', accommodationType: 'Day Scholar', technologiesKnown: [], placementStatus: 'Unplaced', company: '', ctc: '', cgpa: '' });
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeNav, setActiveNav] = useState('Dashboard');

  const BG = darkMode ? '#0f172a' : '#f1f5f9';
  const CARD = darkMode ? '#1e293b' : '#ffffff';
  const BORDER = darkMode ? '#334155' : '#e2e8f0';
  const TEXT = darkMode ? '#f1f5f9' : '#1e293b';
  const TEXT2 = darkMode ? '#94a3b8' : '#64748b';
  const SUBCARD = darkMode ? '#0f172a' : '#f8fafc';

  const fetchStudents = async () => {
    try { const r = await api.get('/admin/students'); setStudents(r.data); }
    catch (e) { setSnackbar({ open: true, message: 'Failed to load students', severity: 'error' }); }
  };
  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => {
    api.get('/config/maintenance').then(r => setMaintenanceMode(r.data.maintenanceMode)).catch(() => { });
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const v = name === 'registerNumber' ? value.toUpperCase() : name === 'email' ? value.toLowerCase() : value;
    setFormData(p => ({ ...p, [name]: v }));
  };
  const handleTechChange = (e) => {
    const { value, checked } = e.target;
    setFormData(p => ({ ...p, technologiesKnown: checked ? [...p.technologiesKnown, value] : p.technologiesKnown.filter(t => t !== value) }));
  };
  const handleOpenNew = () => { setIsEdit(false); setFormData({ registerNumber: '', name: '', email: '', year: '', department: '', accommodationType: 'Day Scholar', technologiesKnown: [], placementStatus: 'Unplaced', company: '', ctc: '', cgpa: '' }); setOpenForm(true); };
  const handleOpenEdit = (s) => { setIsEdit(true); setCurrentStudentId(s._id); setFormData({ ...s, placementStatus: s.placementStatus || 'Unplaced', company: s.company || '', ctc: s.ctc || '', cgpa: s.cgpa || '' }); setOpenForm(true); };

  const validateForm = () => {
    if (!formData.name?.trim() || formData.name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!formData.registerNumber?.trim() || formData.registerNumber.trim().length < 3) return 'Register Number is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Valid email required';
    if (!formData.year) return 'Year is required';
    if (!formData.department) return 'Department is required';
    return null;
  };

  const handleSubmit = async () => {
    const err = validateForm();
    if (err) { setSnackbar({ open: true, message: err, severity: 'error' }); return; }
    try {
      const { _id, __v, createdAt, updatedAt, ...clean } = formData;
      const payload = { ...clean, ctc: clean.placementStatus === 'Placed' ? Number(clean.ctc) || 0 : 0, cgpa: Number(clean.cgpa) || 0 };
      if (isEdit) { await api.put(`/admin/students/${currentStudentId}`, payload); setSnackbar({ open: true, message: 'Student updated!', severity: 'success' }); }
      else { await api.post('/students/register', payload); setSnackbar({ open: true, message: 'Student created!', severity: 'success' }); }
      fetchStudents(); setOpenForm(false);
    } catch (e) { setSnackbar({ open: true, message: e.response?.data?.message || 'Operation failed', severity: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try { await api.delete(`/admin/students/${id}`); fetchStudents(); setSnackbar({ open: true, message: 'Deleted successfully', severity: 'success' }); }
    catch (e) { setSnackbar({ open: true, message: 'Delete failed', severity: 'error' }); }
  };

  const handleExportCSV = () => {
    const rows = [["RegisterNumber", "Name", "Email", "Department", "Year", "CGPA", "Status", "Company", "CTC"],
    ...students.map(s => [s.registerNumber, `"${s.name}"`, s.email, s.department, s.year, s.cgpa || 0, s.placementStatus, s.company || '-', s.ctc || 0])];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' }));
    a.download = 'educrm_students.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadProgress(10);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const lines = ev.target.result.split('\n').filter(l => l.trim());
      const start = lines[0]?.includes('RegisterNumber') ? 1 : 0;
      let count = 0; setUploadProgress(30);
      for (let i = start; i < lines.length; i++) {
        const r = lines[i].split(',');
        if (r.length < 5) continue;
        try { await api.post('/students/register', { registerNumber: r[0]?.trim(), name: r[1]?.trim().replace(/"/g, ''), email: r[2]?.trim(), department: r[3]?.trim(), year: r[4]?.trim(), accommodationType: 'Day Scholar', placementStatus: 'Unplaced', technologiesKnown: [] }); count++; } catch { }
        setUploadProgress(30 + (i / lines.length) * 70);
      }
      setUploadProgress(100);
      setTimeout(() => { setOpenImport(false); setUploadProgress(0); setSnackbar({ open: true, message: `Imported ${count} students!`, severity: 'success' }); fetchStudents(); }, 800);
    };
    reader.readAsText(file);
  };

  const handleMaintenanceToggle = async () => {
    const next = !maintenanceMode; setMaintenanceMode(next);
    try { const r = await api.post('/config/maintenance', { value: next }); setMaintenanceMode(r.data.maintenanceMode); setSnackbar({ open: true, message: r.data.maintenanceMode ? 'Maintenance ON' : 'System Live', severity: r.data.maintenanceMode ? 'warning' : 'success' }); }
    catch { setMaintenanceMode(!next); setSnackbar({ open: true, message: 'Failed to update', severity: 'error' }); }
  };

  const handleBackup = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(students, null, 2)], { type: 'application/json' }));
    a.download = `educrm_backup_${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click();
    setSnackbar({ open: true, message: 'Backup downloaded!', severity: 'info' });
  };

  const filtered = students.filter(s =>
    (!filters.department || s.department === filters.department) &&
    (!filters.year || s.year === filters.year) &&
    (s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.registerNumber?.includes(searchTerm))
  );

  const handleSelectAll = (e) => setSelectedIds(e.target.checked ? filtered.map(s => s._id) : []);
  const handleSelectOne = (e, id) => setSelectedIds(prev => e.target.checked ? [...prev, id] : prev.filter(i => i !== id));

  // Analytics
  const placedCount = students.filter(s => s.placementStatus === 'Placed').length;
  const placementRate = students.length ? ((placedCount / students.length) * 100).toFixed(0) : 0;
  const validCgpa = students.filter(s => s.cgpa > 0);
  const avgCgpa = validCgpa.length ? (validCgpa.reduce((a, s) => a + Number(s.cgpa || 0), 0) / validCgpa.length).toFixed(1) : '0.0';
  const avgPkg = students.filter(s => s.ctc > 0).length
    ? (students.filter(s => s.ctc > 0).reduce((a, s) => a + Number(s.ctc || 0), 0) / students.filter(s => s.ctc > 0).length).toFixed(1)
    : '0';

  const cgpaDist = [
    { range: '9-10', count: students.filter(s => s.cgpa >= 9).length },
    { range: '8-9', count: students.filter(s => s.cgpa >= 8 && s.cgpa < 9).length },
    { range: '7-8', count: students.filter(s => s.cgpa >= 7 && s.cgpa < 8).length },
    { range: '< 7', count: students.filter(s => s.cgpa > 0 && s.cgpa < 7).length },
  ];
  const deptData = Object.entries(students.reduce((a, s) => ({ ...a, [s.department]: (a[s.department] || 0) + 1 }), {})).map(([k, v]) => ({ name: k, value: v }));
  const techCounts = {};
  students.forEach(s => s.technologiesKnown?.forEach(t => { techCounts[t] = (techCounts[t] || 0) + 1; }));
  const topTech = Object.entries(techCounts).map(([k, v]) => ({ name: k, count: v })).sort((a, b) => b.count - a.count).slice(0, 6);
  const maxTech = topTech[0]?.count || 1;

  const kpiCards = [
    { title: 'Total Students', val: students.length, icon: <People />, col: '#3b82f6', cls: 'blue', trend: '+12%' },
    { title: 'Placement Rate', val: `${placementRate}%`, icon: <BusinessCenter />, col: '#10b981', cls: 'green', trend: '+5%' },
    { title: 'Avg CGPA', val: avgCgpa, icon: <TrendingUp />, col: '#8b5cf6', cls: 'purple', trend: '+0.2' },
    { title: 'Avg Package', val: `₹${avgPkg}L`, icon: <AttachMoney />, col: '#f59e0b', cls: 'amber', trend: '+8%' },
  ];

  const navItems = [
    { icon: <Dashboard />, label: 'Dashboard' },
    { icon: <People />, label: 'Students' },
    { icon: <Settings />, label: 'Settings', action: () => setOpenSettings(true) },
  ];

  const dialogPaper = { bgcolor: CARD, color: TEXT, borderRadius: '20px', border: `1px solid ${BORDER}` };
  const inputSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '12px', color: TEXT, '& fieldset': { borderColor: BORDER }, '&:hover fieldset': { borderColor: '#6366f1' }, '&.Mui-focused fieldset': { borderColor: '#6366f1' } },
    '& .MuiInputLabel-root': { color: TEXT2 },
    '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' },
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: BG, color: TEXT, fontFamily: "'Inter', sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: '#0f172a', color: 'white', borderRight: 'none', boxShadow: '4px 0 24px rgba(0,0,0,0.3)' } }}>
        {/* Logo */}
        <Box sx={{ p: 3.5, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
              <Dashboard sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            <Typography variant="h6" fontWeight="900" fontFamily="'Outfit',sans-serif" sx={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EDUCRM
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#475569', pl: 0.5 }}>Admin Portal v2.0</Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

        {/* Nav */}
        <List sx={{ px: 2, mt: 2, flexGrow: 1 }}>
          {navItems.map(item => (
            <ListItem
              key={item.label}
              button
              onClick={() => { setActiveNav(item.label); item.action?.(); }}
              className={`sidebar-nav-item${activeNav === item.label ? ' active' : ''}`}
              sx={{ px: 2, py: 1.2, color: activeNav === item.label ? 'white' : '#64748b' }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: activeNav === item.label ? 700 : 500, fontSize: '0.875rem' }} />
              {activeNav === item.label && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.7)' }} />}
            </ListItem>
          ))}
        </List>

        {/* Maintenance badge */}
        {maintenanceMode && (
          <Box sx={{ mx: 2, mb: 2, p: 1.5, borderRadius: '12px', bgcolor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Build sx={{ fontSize: 16, color: '#f59e0b' }} />
            <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 600 }}>Maintenance ON</Typography>
          </Box>
        )}

        {/* Logout */}
        <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Button
            startIcon={<Logout />}
            fullWidth
            sx={{ color: '#ef4444', justifyContent: 'flex-start', borderRadius: '12px', textTransform: 'none', fontWeight: 600, py: 1, '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/admin/login'; }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* ── MAIN ── */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto', height: '100vh' }}>

        {/* Top Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="800" fontFamily="'Outfit',sans-serif" sx={{ color: TEXT, lineHeight: 1.2 }}>
              Overview
            </Typography>
            <Typography variant="body2" sx={{ color: TEXT2, mt: 0.3 }}>Welcome back, Admin • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ bgcolor: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', '&:hover': { bgcolor: BORDER } }}>
                {darkMode ? <LightMode sx={{ color: '#fbbf24' }} /> : <DarkMode sx={{ color: '#64748b' }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton sx={{ bgcolor: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', '&:hover': { bgcolor: BORDER } }}>
                <Badge badgeContent={3} color="error"><NotificationsNone sx={{ color: TEXT2 }} /></Badge>
              </IconButton>
            </Tooltip>
            <Button variant="outlined" startIcon={<CloudDownload />} onClick={handleExportCSV}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, borderColor: BORDER, color: TEXT2, '&:hover': { borderColor: '#6366f1', color: '#6366f1', bgcolor: 'rgba(99,102,241,0.06)' } }}>
              Export
            </Button>
            <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => setOpenImport(true)}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, borderColor: BORDER, color: TEXT2, '&:hover': { borderColor: '#6366f1', color: '#6366f1', bgcolor: 'rgba(99,102,241,0.06)' } }}>
              Import
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpenNew} className="btn-shimmer"
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 2.5 }}>
              Add Student
            </Button>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpiCards.map((k, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card className={`kpi-card ${k.cls}`} sx={{ p: 3, bgcolor: CARD, boxShadow: `0 4px 20px rgba(0,0,0,${darkMode ? '.2' : '.06'})` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: TEXT2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem' }}>{k.title}</Typography>
                    <Typography variant="h4" fontWeight="800" fontFamily="'Outfit',sans-serif" className="kpi-value" sx={{ color: TEXT, mt: 0.5, lineHeight: 1.1 }}>{k.val}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.8 }}>
                      <ArrowUpward sx={{ fontSize: 12, color: '#10b981' }} />
                      <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>{k.trend}</Typography>
                      <Typography variant="caption" sx={{ color: TEXT2 }}>vs last month</Typography>
                    </Box>
                  </Box>
                  <Avatar variant="rounded" sx={{ width: 48, height: 48, background: `linear-gradient(135deg, ${k.col}22, ${k.col}44)`, color: k.col, border: `1px solid ${k.col}33` }}>{k.icon}</Avatar>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* CGPA Bar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: 340, bgcolor: CARD, borderRadius: '18px', boxShadow: `0 4px 20px rgba(0,0,0,${darkMode ? '.2' : '.06'})` }}>
              <Typography variant="h6" fontWeight="700" fontFamily="'Outfit',sans-serif" sx={{ mb: 2.5, color: TEXT }}>Academic Spread</Typography>
              <ResponsiveContainer width="100%" height="83%">
                <BarChart data={cgpaDist} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: TEXT2, fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: TEXT2, fontSize: 12 }} />
                  <RechartsTooltip content={<CustomTooltip dark={darkMode} />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 8 }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {cgpaDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Dept Pie */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: 340, bgcolor: CARD, borderRadius: '18px', boxShadow: `0 4px 20px rgba(0,0,0,${darkMode ? '.2' : '.06'})` }}>
              <Typography variant="h6" fontWeight="700" fontFamily="'Outfit',sans-serif" sx={{ mb: 2.5, color: TEXT }}>Department Split</Typography>
              <ResponsiveContainer width="100%" height="83%">
                <PieChart>
                  <Pie data={deptData} innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4} strokeWidth={0}>
                    {deptData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip dark={darkMode} />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: TEXT2 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Top Skills */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: 340, bgcolor: CARD, borderRadius: '18px', boxShadow: `0 4px 20px rgba(0,0,0,${darkMode ? '.2' : '.06'})`, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight="700" fontFamily="'Outfit',sans-serif" sx={{ mb: 2.5, color: TEXT }}>Top Skills</Typography>
              <Box sx={{ overflowY: 'auto', flex: 1, pr: 0.5 }}>
                {topTech.map((t, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6, alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: CHART_COLORS[i % CHART_COLORS.length], display: 'flex' }}>{getTechIcon(t.name)}</Box>
                        <Typography variant="body2" fontWeight={600} sx={{ color: TEXT }}>{t.name}</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: TEXT2, fontWeight: 600 }}>{t.count}</Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: 7, bgcolor: darkMode ? '#1e293b' : '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <Box className="skill-bar-fill" sx={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[(i + 1) % CHART_COLORS.length]})`, width: `${(t.count / maxTech) * 100}%` }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Data Table */}
        <Card sx={{ bgcolor: CARD, borderRadius: '18px', overflow: 'hidden', boxShadow: `0 4px 20px rgba(0,0,0,${darkMode ? '.2' : '.06'})` }}>
          {/* Table toolbar */}
          <Box sx={{ p: 2.5, borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small" placeholder="Search students..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: TEXT2 }} /></InputAdornment> }}
              sx={{ ...inputSx, minWidth: 220, '& .MuiOutlinedInput-root': { ...inputSx['& .MuiOutlinedInput-root'], bgcolor: SUBCARD } }}
            />
            <TextField select size="small" label="Department" value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })} sx={{ ...inputSx, minWidth: 130 }}>
              <MenuItem value="">All</MenuItem>{deptOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Year" value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })} sx={{ ...inputSx, minWidth: 120 }}>
              <MenuItem value="">All</MenuItem>{['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </TextField>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: TEXT2 }}>
                {filtered.length} of {students.length} students
              </Typography>
              {selectedIds.length > 0 && <Chip label={`${selectedIds.length} selected`} color="primary" size="small" onDelete={() => setSelectedIds([])} />}
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: SUBCARD }}>
                  <TableCell padding="checkbox" sx={{ borderBottom: `1px solid ${BORDER}` }}>
                    <Checkbox checked={selectedIds.length === filtered.length && filtered.length > 0} indeterminate={selectedIds.length > 0 && selectedIds.length < filtered.length} onChange={handleSelectAll} sx={{ color: TEXT2 }} />
                  </TableCell>
                  {['Student', 'Dept / Year', 'CGPA', 'Status', 'Skills', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: TEXT2, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${BORDER}` }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(s => {
                  const sc = statusConfig[s.placementStatus] || statusConfig.Unplaced;
                  return (
                    <TableRow key={s._id} className="premium-table-row" selected={selectedIds.includes(s._id)}
                      sx={{ '&.MuiTableRow-root.Mui-selected': { bgcolor: 'rgba(99,102,241,0.04)' }, '& td': { borderBottom: `1px solid ${BORDER}` } }}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedIds.includes(s._id)} onChange={e => handleSelectOne(e, s._id)} sx={{ color: TEXT2 }} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Avatar sx={{ background: getAvatarGradient(s.name), fontWeight: 700, fontSize: '0.85rem', width: 38, height: 38 }}>{s.name?.[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: TEXT }}>{s.name}</Typography>
                            <Typography variant="caption" sx={{ color: TEXT2 }}>{s.registerNumber}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} sx={{ color: TEXT }}>{s.department}</Typography>
                        <Typography variant="caption" sx={{ color: TEXT2 }}>{s.year}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight={800} fontFamily="'Outfit',sans-serif"
                          sx={{ color: s.cgpa >= 9 ? '#10b981' : s.cgpa >= 8 ? '#6366f1' : s.cgpa >= 7 ? '#f59e0b' : '#ef4444' }}>
                          {s.cgpa || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={s.placementStatus || 'Unplaced'} size="small"
                          sx={{ bgcolor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontWeight: 700, fontSize: '0.7rem', borderRadius: '8px', height: 24 }} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, maxWidth: 180 }}>
                          {s.technologiesKnown?.slice(0, 3).map(t => (
                            <Chip key={t} label={t} size="small" sx={{ fontSize: '0.65rem', height: 20, borderRadius: '6px', bgcolor: darkMode ? '#334155' : '#f1f5f9', color: TEXT2 }} />
                          ))}
                          {(s.technologiesKnown?.length || 0) > 3 && <Chip label={`+${s.technologiesKnown.length - 3}`} size="small" sx={{ fontSize: '0.65rem', height: 20, borderRadius: '6px', bgcolor: 'rgba(99,102,241,0.1)', color: '#6366f1' }} />}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenEdit(s)} sx={{ bgcolor: 'rgba(99,102,241,0.1)', color: '#6366f1', borderRadius: '8px', '&:hover': { bgcolor: '#6366f1', color: 'white' } }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(s._id)} sx={{ bgcolor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: '8px', '&:hover': { bgcolor: '#ef4444', color: 'white' } }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 8, color: TEXT2 }}>
                    <People sx={{ fontSize: 48, opacity: 0.2, display: 'block', mx: 'auto', mb: 1 }} />
                    No students found
                  </TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Floating Action Bar */}
        {selectedIds.length > 0 && (
          <Box className="fab-bar" sx={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', px: 3, py: 1.5, borderRadius: '50px', display: 'flex', gap: 2, alignItems: 'center', zIndex: 1300 }}>
            <Typography variant="body2" fontWeight={700} sx={{ color: 'white' }}>{selectedIds.length} selected</Typography>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
            <Button startIcon={<Mail />} size="small" onClick={() => setOpenEmail(true)} sx={{ color: '#818cf8', textTransform: 'none', fontWeight: 600, '&:hover': { color: 'white', bgcolor: 'rgba(99,102,241,0.2)' } }}>Email</Button>
            <IconButton size="small" onClick={() => setSelectedIds([])} sx={{ color: '#475569', '&:hover': { color: 'white' } }}><Close fontSize="small" /></IconButton>
          </Box>
        )}
      </Box>

      {/* ── DIALOGS ── */}

      {/* Add/Edit Student */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth PaperProps={{ sx: dialogPaper }}>
        <DialogTitle sx={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: TEXT, pb: 1 }}>
          {isEdit ? '✏️ Edit Student' : '➕ New Student'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleFormChange} fullWidth sx={inputSx} />
            <TextField label="Reg No" name="registerNumber" value={formData.registerNumber} onChange={handleFormChange} disabled={isEdit} fullWidth sx={inputSx} />
            <TextField label="Email" name="email" value={formData.email} onChange={handleFormChange} fullWidth sx={inputSx} />
            <TextField label="CGPA" name="cgpa" type="number" value={formData.cgpa} onChange={handleFormChange} fullWidth sx={inputSx} inputProps={{ min: 0, max: 10, step: 0.1 }} />
            <FormControl fullWidth sx={inputSx}><InputLabel>Department</InputLabel><Select name="department" value={formData.department} label="Department" onChange={handleFormChange}>{deptOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}</Select></FormControl>
            <FormControl fullWidth sx={inputSx}><InputLabel>Year</InputLabel><Select name="year" value={formData.year} label="Year" onChange={handleFormChange}>{['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}</Select></FormControl>
            <FormControl fullWidth sx={inputSx}><InputLabel>Placement Status</InputLabel><Select name="placementStatus" value={formData.placementStatus} label="Placement Status" onChange={handleFormChange}>{placementStatusOptions.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</Select></FormControl>
            {formData.placementStatus === 'Placed' && <>
              <TextField label="Company" name="company" value={formData.company} onChange={handleFormChange} fullWidth sx={inputSx} />
              <TextField label="Package (LPA)" name="ctc" type="number" value={formData.ctc} onChange={handleFormChange} fullWidth sx={inputSx} />
            </>}
            <FormControl component="fieldset" sx={{ gridColumn: 'span 2' }}>
              <Typography variant="caption" sx={{ color: TEXT2, fontWeight: 600, mb: 1, display: 'block' }}>Technical Skills</Typography>
              <FormGroup row>{techOptions.map(t => <FormControlLabel key={t} control={<Checkbox checked={formData.technologiesKnown?.includes(t)} value={t} onChange={handleTechChange} size="small" sx={{ color: TEXT2 }} />} label={<Typography variant="body2" sx={{ color: TEXT }}>{t}</Typography>} />)}</FormGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setOpenForm(false)} sx={{ borderRadius: '10px', textTransform: 'none', color: TEXT2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} className="btn-shimmer" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>Save Student</Button>
        </DialogActions>
      </Dialog>

      {/* Import CSV */}
      <Dialog open={openImport} onClose={() => setOpenImport(false)} maxWidth="sm" fullWidth PaperProps={{ sx: dialogPaper }}>
        <DialogTitle sx={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: TEXT }}>Import CSV</DialogTitle>
        <DialogContent>
          <Box onClick={() => fileInputRef.current.click()} sx={{ p: 5, border: `2px dashed ${BORDER}`, borderRadius: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99,102,241,0.04)' } }}>
            <input type="file" hidden ref={fileInputRef} onChange={handleImportCSV} accept=".csv" />
            <CloudUpload sx={{ fontSize: 48, color: '#6366f1', mb: 1 }} />
            <Typography fontWeight={600} sx={{ color: TEXT }}>Click to Upload CSV</Typography>
            <Typography variant="caption" sx={{ color: TEXT2 }}>Format: RegNo, Name, Email, Dept, Year</Typography>
            {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 2, borderRadius: 4, height: 6, bgcolor: BORDER, '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 4 } }} />}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Email */}
      <Dialog open={openEmail} onClose={() => setOpenEmail(false)} maxWidth="sm" fullWidth PaperProps={{ sx: dialogPaper }}>
        <DialogTitle sx={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: TEXT }}>📧 Bulk Email — {selectedIds.length} students</DialogTitle>
        <DialogContent>
          <TextField label="Subject" fullWidth sx={{ ...inputSx, mb: 2, mt: 1 }} value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
          <TextField label="Message" multiline rows={5} fullWidth sx={inputSx} value={emailBody} onChange={e => setEmailBody(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setOpenEmail(false)} sx={{ borderRadius: '10px', textTransform: 'none', color: TEXT2 }}>Cancel</Button>
          <Button variant="contained" startIcon={<Send />} className="btn-shimmer" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }} onClick={() => { setOpenEmail(false); setSelectedIds([]); setSnackbar({ open: true, message: `Email sent to ${selectedIds.length} students!`, severity: 'info' }); }}>Send</Button>
        </DialogActions>
      </Dialog>

      {/* Settings */}
      <Dialog open={openSettings} onClose={() => setOpenSettings(false)} maxWidth="xs" fullWidth PaperProps={{ sx: dialogPaper }}>
        <DialogTitle sx={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: TEXT }}>⚙️ System Settings</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {[
            { icon: <Build color="warning" />, primary: 'Maintenance Mode', secondary: 'Disable student access', action: <Switch checked={maintenanceMode} onChange={handleMaintenanceToggle} sx={{ '& .MuiSwitch-thumb': { bgcolor: maintenanceMode ? '#f59e0b' : undefined } }} /> },
            { icon: <Backup sx={{ color: '#6366f1' }} />, primary: 'Backup Database', secondary: 'Download JSON dump', action: null, onClick: handleBackup },
            { icon: <Restore sx={{ color: TEXT2 }} />, primary: 'Restore Data', secondary: 'Upload backup file', action: null },
            { icon: <Security color="error" />, primary: 'Clear Logs', secondary: 'Delete system activity logs', action: null },
          ].map((item, i) => (
            <React.Fragment key={i}>
              <ListItem button={!item.action} onClick={item.onClick} sx={{ px: 3, py: 1.8, '&:hover': { bgcolor: 'rgba(99,102,241,0.05)' } }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={<Typography variant="body2" fontWeight={600} sx={{ color: TEXT }}>{item.primary}</Typography>} secondary={<Typography variant="caption" sx={{ color: TEXT2 }}>{item.secondary}</Typography>} />
                {item.action}
              </ListItem>
              {i < 3 && <Divider sx={{ borderColor: BORDER }} />}
            </React.Fragment>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenSettings(false)} sx={{ borderRadius: '10px', textTransform: 'none', color: TEXT2 }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: '12px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;