import React, { useState, useEffect, useRef } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TextField, MenuItem, Button, Grid, Typography, Box, Chip, Card, IconButton, 
  InputAdornment, Avatar, Dialog, DialogTitle, DialogContent, 
  DialogActions, FormControl, InputLabel, Select, Checkbox, 
  Paper, Divider, Snackbar, Alert, FormGroup, FormControlLabel, Drawer, List, ListItem, ListItemIcon, ListItemText, LinearProgress, Switch 
} from '@mui/material';
import { 
  Search, CloudUpload, CloudDownload, Add, Edit, Delete, 
  People, BusinessCenter, AttachMoney, TrendingUp,
  Mail, Close, Send, Terminal, Language, Storage, Cloud,
  DarkMode, LightMode, Dashboard, Logout, Settings, Build, Backup, Restore, Security 
} from '@mui/icons-material';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import api from '../api';
import '../App.css'; 

// --- CONSTANTS ---
const techOptions = ["C", "C++", "Java", "Python", "DS", "Algorithms", "React", "MERN", "HTML", "CSS", "Cloud", "Devops"];
const deptOptions = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "CSBS", "BME", "CHEM", "FASHION"];
const placementStatusOptions = ["Unplaced", "Placed", "Higher Studies", "Entrepreneur"];
const DRAWER_WIDTH = 260;

// --- HELPER: Tech Icons ---
const getTechIcon = (techName) => {
  const name = techName.toLowerCase();
  if (name.includes('java') || name.includes('python') || name.includes('c++')) return <Terminal fontSize="small" />;
  if (name.includes('react') || name.includes('html') || name.includes('css')) return <Language fontSize="small" />;
  if (name.includes('data') || name.includes('sql')) return <Storage fontSize="small" />;
  return <Cloud fontSize="small" />;
};

const AdminDashboard = () => {
  // --- STATE ---
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ department: '', year: '', technology: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // Dialogs
  const [openForm, setOpenForm] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [openSettings, setOpenSettings] = useState(false); // Maintenance Dialog
  const [isEdit, setIsEdit] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  
  // Feedback
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form Data
  const [formData, setFormData] = useState({ 
    registerNumber: '', name: '', email: '', year: '', department: '', 
    accommodationType: 'Day Scholar', technologiesKnown: [],
    placementStatus: 'Unplaced', company: '', ctc: '', cgpa: '' 
  });
  
  // Bulk Data
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- API CALLS ---
  const fetchStudents = async () => { 
    try { 
      const res = await api.get('/admin/students'); 
      setStudents(res.data); 
    } catch (err) { 
      console.error('Failed to fetch students:', err);
      setSnackbar({ open: true, message: 'Failed to load students', severity: 'error' });
    } 
  };
  useEffect(() => { fetchStudents(); }, []);

  // --- HANDLERS ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      technologiesKnown: checked ? [...prev.technologiesKnown, value] : prev.technologiesKnown.filter(t => t !== value)
    }));
  };

  const handleOpenNew = () => { 
    setIsEdit(false); 
    setFormData({ registerNumber: '', name: '', email: '', year: '', department: '', accommodationType: 'Day Scholar', technologiesKnown: [], placementStatus: 'Unplaced', company: '', ctc: '', cgpa: '' }); 
    setOpenForm(true); 
  };

  const handleOpenEdit = (s) => { 
    setIsEdit(true); 
    setCurrentStudentId(s._id); 
    setFormData({ 
      ...s, 
      placementStatus: s.placementStatus || 'Unplaced',
      company: s.company || '',
      ctc: s.ctc || '',
      cgpa: s.cgpa || '' 
    }); 
    setOpenForm(true); 
  };

  const handleSubmit = async () => { 
    try { 
      // Clean payload logic
      const { _id, __v, createdAt, updatedAt, ...cleanData } = formData;
      const payload = { 
        ...cleanData,
        ctc: cleanData.placementStatus === 'Placed' ? Number(cleanData.ctc) : 0,
        cgpa: Number(cleanData.cgpa) || 0 
      };

      if (isEdit) {
        await api.put(`/admin/students/${currentStudentId}`, payload);
        setSnackbar({ open: true, message: 'Student updated successfully!', severity: 'success' });
      } else {
        await api.post('/students/register', payload);
        setSnackbar({ open: true, message: 'Student created successfully!', severity: 'success' });
      }
      fetchStudents(); setOpenForm(false); 
    } catch (err) { 
      console.error(err);
      setSnackbar({ open: true, message: 'Operation failed.', severity: 'error' });
    } 
  };

  const handleDelete = async (id) => { 
    if (window.confirm('Delete student?')) { 
      try { await api.delete(`/admin/students/${id}`); fetchStudents(); setSnackbar({ open: true, message: 'Deleted successfully', severity: 'success' }); } 
      catch(err) { setSnackbar({ open: true, message: 'Delete failed', severity: 'error' }); }
    } 
  };

  // --- CSV EXPORT ---
  const handleExportCSV = () => {
    const headers = ["RegisterNumber,Name,Email,Department,Year,CGPA,Status,Company,CTC"];
    const rows = students.map(s => [
      s.registerNumber,
      `"${s.name}"`, 
      s.email,
      s.department,
      s.year,
      s.cgpa || 0,
      s.placementStatus,
      s.company || '-',
      s.ctc || 0
    ].join(","));
    
    const csvContent = [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }));
    link.setAttribute("download", "educrm_students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CSV IMPORT (Frontend Parsing) ---
  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadProgress(10);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const text = e.target.result;
        // Basic CSV Parsing (Split by line, then comma)
        const lines = text.split('\n').filter(l => l.trim());
        const headers = lines[0].split(','); // Assuming first row is header
        
        let successCount = 0;
        setUploadProgress(30);

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',');
          if(row.length < 5) continue; // Skip invalid rows

          // Simple Mock Mapping (Adjust indices based on your CSV structure)
          // Assuming CSV: RegNo, Name, Email, Dept, Year
          const newStudent = {
             registerNumber: row[0]?.trim(),
             name: row[1]?.trim().replace(/"/g, ''),
             email: row[2]?.trim(),
             department: row[3]?.trim(),
             year: row[4]?.trim(),
             // Defaults
             accommodationType: 'Day Scholar',
             placementStatus: 'Unplaced',
             technologiesKnown: []
          };

          try {
             await api.post('/students/register', newStudent);
             successCount++;
          } catch(err) {
             console.log("Import Error for row", i);
          }
          setUploadProgress(30 + (i / lines.length) * 70);
        }

        setUploadProgress(100);
        setTimeout(() => {
          setOpenImport(false);
          setUploadProgress(0);
          setSnackbar({ open: true, message: `Imported ${successCount} students successfully!`, severity: 'success' });
          fetchStudents();
        }, 1000);
      };
      
      reader.readAsText(file);
    }
  };

  // --- MAINTENANCE & SETTINGS ---
  const handleMaintenanceToggle = async () => {
    const newVal = !maintenanceMode;
    const previousVal = maintenanceMode;
    setMaintenanceMode(newVal);
    
    try {
      const res = await api.post('/config/maintenance', { value: newVal });
      setMaintenanceMode(res.data.maintenanceMode);
      setSnackbar({ 
        open: true, 
        message: res.data.maintenanceMode ? 'System is now in Maintenance Mode' : 'System is Live', 
        severity: res.data.maintenanceMode ? 'warning' : 'success' 
      });
    } catch (err) {
      console.error('Failed to update maintenance mode:', err);
      setMaintenanceMode(previousVal);
      setSnackbar({ 
        open: true, 
        message: 'Failed to update maintenance mode', 
        severity: 'error' 
      });
    }
  };
  
  // Fetch maintenance mode status on mount
  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const res = await api.get('/config/maintenance');
        setMaintenanceMode(res.data.maintenanceMode);
      } catch (err) {
        console.error('Failed to fetch maintenance status:', err);
      }
    };
    fetchMaintenanceStatus();
  }, []);

  const handleBackup = () => {
    const jsonString = JSON.stringify(students, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `educrm_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    setSnackbar({ open: true, message: 'Database Backup Downloaded!', severity: 'info' });
  };

  const handleSendEmail = () => { 
      setOpenEmail(false); 
      setSelectedIds([]); 
      setSnackbar({ open: true, message: `Email sent to ${selectedIds.length} students!`, severity: 'info' }); 
  };

  // --- SELECTION & FILTER LOGIC ---
  const filteredStudents = students.filter(student => (
    (filters.department === '' || student.department === filters.department) &&
    (filters.year === '' || student.year === filters.year) &&
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.registerNumber.includes(searchTerm))
  ));

  const handleSelectAll = (event) => setSelectedIds(event.target.checked ? filteredStudents.map((n) => n._id) : []);
  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selectedIds, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selectedIds.slice(1));
    else if (selectedIndex === selectedIds.length - 1) newSelected = newSelected.concat(selectedIds.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selectedIds.slice(0, selectedIndex), selectedIds.slice(selectedIndex + 1));
    setSelectedIds(newSelected);
  };

  // --- THEME & STYLES ---
  const THEME_BG = darkMode ? '#0f172a' : '#f8fafc';
  const CARD_BG = darkMode ? '#1e293b' : 'white';
  const TEXT_PRIMARY = darkMode ? '#f8fafc' : '#1e293b';
  const TEXT_SECONDARY = darkMode ? '#94a3b8' : '#64748b';

  // --- ANALYTICS ---
  const placedCount = students.filter(s => s.placementStatus === 'Placed').length;
  const placementRate = students.length > 0 ? ((placedCount / students.length) * 100).toFixed(0) : 0;
  const validCgpaStudents = students.filter(s => s.cgpa > 0);
  const avgCgpa = validCgpaStudents.length > 0 ? (validCgpaStudents.reduce((acc, curr) => acc + (Number(curr.cgpa) || 0), 0) / validCgpaStudents.length).toFixed(1) : "0";

  const cgpaDist = [
    { range: '9-10', count: students.filter(s => s.cgpa >= 9).length },
    { range: '8-9', count: students.filter(s => s.cgpa >= 8 && s.cgpa < 9).length },
    { range: '7-8', count: students.filter(s => s.cgpa >= 7 && s.cgpa < 8).length },
    { range: '< 7', count: students.filter(s => s.cgpa > 0 && s.cgpa < 7).length },
  ];
  
  const deptData = Object.entries(students.reduce((acc, curr) => ({...acc, [curr.department]: (acc[curr.department] || 0) + 1}), {})).map(([k,v]) => ({name:k, value:v}));
  
  const techCounts = {}; 
  students.forEach(s => s.technologiesKnown.forEach(t => techCounts[t] = (techCounts[t] || 0) + 1));
  let sortedTech = Object.entries(techCounts).map(([k,v]) => ({name:k, count:v})).sort((a,b) => b.count - a.count).slice(0, 5);
  const maxTechCount = sortedTech.length > 0 ? sortedTech[0].count : 1;
  const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: THEME_BG, color: TEXT_PRIMARY }}>
      
      {/* 1. SIDEBAR DRAWER */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: '#1e293b', color: 'white', borderRight: 'none'
          },
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="900" sx={{ background: 'linear-gradient(45deg, #6366f1, #ec4899)', backgroundClip: 'text', color: 'transparent', mb: 1 }}>EDUCRM</Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>Admin Portal v2.0</Typography>
        </Box>
        <List sx={{ px: 2 }}>
          <ListItem button sx={{ bgcolor: '#334155', borderRadius: 2, mb: 1 }}><ListItemIcon><Dashboard sx={{ color: '#818cf8' }} /></ListItemIcon><ListItemText primary="Dashboard" /></ListItem>
          <ListItem button sx={{ borderRadius: 2, mb: 1, color: '#94a3b8' }}><ListItemIcon><People sx={{ color: '#94a3b8' }} /></ListItemIcon><ListItemText primary="Students" /></ListItem>
          <ListItem button sx={{ borderRadius: 2, mb: 1, color: '#94a3b8' }} onClick={() => setOpenSettings(true)}><ListItemIcon><Settings sx={{ color: '#94a3b8' }} /></ListItemIcon><ListItemText primary="Settings / Maintenance" /></ListItem>
        </List>
        <Box sx={{ mt: 'auto', p: 3 }}><Button startIcon={<Logout />} fullWidth sx={{ color: '#ef4444', justifyContent: 'flex-start' }}>Logout</Button></Box>
      </Drawer>

      {/* 2. MAIN CONTENT AREA */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto', height: '100vh' }}>
        
        {/* Top Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5, alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">Overview</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               {maintenanceMode && <Chip label="Maintenance Mode" color="warning" size="small" icon={<Build />} />}
               <Typography variant="body1" sx={{ color: TEXT_SECONDARY }}>Welcome back, Admin</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
             <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ bgcolor: CARD_BG, boxShadow: 1 }}>{darkMode ? <LightMode sx={{ color: '#fbbf24' }} /> : <DarkMode sx={{ color: '#64748b' }} />}</IconButton>
             <Button variant="outlined" startIcon={<CloudDownload />} onClick={handleExportCSV}>Export CSV</Button>
             <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => setOpenImport(true)}>Import CSV</Button>
             <Button variant="contained" startIcon={<Add />} onClick={handleOpenNew} sx={{ bgcolor: '#6366f1', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>Add Student</Button>
          </Box>
        </Box>

        {/* KPI Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: "Total Students", val: students.length, icon: <People />, col: "#3b82f6" },
            { title: "Placement Rate", val: `${placementRate}%`, icon: <BusinessCenter />, col: "#10b981" },
            { title: "Avg CGPA", val: avgCgpa, icon: <TrendingUp />, col: "#8b5cf6" },
            { title: "Avg Package", val: "₹4.5 L", icon: <AttachMoney />, col: "#f59e0b" }
          ].map((k, i) => (
            <Grid item xs={12} md={3} key={i}>
              <Card sx={{ p: 3, display: 'flex', justifyContent: 'space-between', bgcolor: CARD_BG, borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: TEXT_SECONDARY, mb: 1 }}>{k.title}</Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: TEXT_PRIMARY }}>{k.val}</Typography>
                </Box>
                <Avatar variant="rounded" sx={{ bgcolor: `${k.col}20`, color: k.col }}>{k.icon}</Avatar>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* CGPA Bar Chart */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: 360, bgcolor: CARD_BG, borderRadius: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Academic Spread</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={cgpaDist}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#eee'} /><XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill:TEXT_SECONDARY}} /><YAxis axisLine={false} tickLine={false} tick={{fill:TEXT_SECONDARY}} /><RechartsTooltip contentStyle={{borderRadius:8, border:'none'}} cursor={{fill:'transparent'}} /><Bar dataKey="count" fill="#8b5cf6" radius={[4,4,0,0]} barSize={30} /></BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          {/* Department Pie */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: 360, bgcolor: CARD_BG, borderRadius: 4 }}>
               <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Department Split</Typography>
               <ResponsiveContainer width="100%" height="85%">
                 <PieChart><Pie data={deptData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>{deptData.map((e,i)=><Cell key={i} fill={CHART_COLORS[i%5]}/>)}</Pie><RechartsTooltip contentStyle={{borderRadius:8}}/></PieChart>
               </ResponsiveContainer>
            </Card>
          </Grid>
          {/* Top Skills List */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: 360, bgcolor: CARD_BG, borderRadius: 4, display:'flex', flexDirection:'column' }}>
               <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Top Skills</Typography>
               <Box sx={{ overflowY: 'auto', pr: 1 }}>
                  {sortedTech.map((t, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      <Box sx={{ display:'flex', justifyContent:'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight="600" sx={{ display:'flex', gap:1 }}>{getTechIcon(t.name)} {t.name}</Typography>
                        <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{t.count} students</Typography>
                      </Box>
                      <Box sx={{ width:'100%', height:6, bgcolor: darkMode?'#334155':'#f1f5f9', borderRadius:3 }}><Box sx={{ width:`${(t.count/maxTechCount)*100}%`, height:'100%', bgcolor: CHART_COLORS[i%5], borderRadius:3 }}/></Box>
                    </Box>
                  ))}
               </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Data Table */}
        <Card sx={{ bgcolor: CARD_BG, borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${darkMode?'#334155':'#f1f5f9'}`, display:'flex', gap:2 }}>
            <TextField size="small" placeholder="Search students..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} InputProps={{startAdornment:<InputAdornment position="start"><Search fontSize="small"/></InputAdornment>}} sx={{ bgcolor: darkMode?'#0f172a':'#f8fafc', borderRadius:2, fieldset:{border:'none'} }} />
            {/* Dept Filter */}
            <TextField select size="small" label="Dept" value={filters.department} onChange={e=>setFilters({...filters, department:e.target.value})} sx={{ minWidth: 120 }}>
               <MenuItem value="">All</MenuItem>{deptOptions.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
            {selectedIds.length > 0 && <Chip label={`${selectedIds.length} Selected`} color="primary" onDelete={() => setSelectedIds([])} />}
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: darkMode?'#0f172a':'#f8fafc' }}>
                <TableRow>
                  <TableCell padding="checkbox"><Checkbox checked={selectedIds.length===filteredStudents.length && filteredStudents.length>0} indeterminate={selectedIds.length>0 && selectedIds.length<filteredStudents.length} onChange={handleSelectAll} /></TableCell>
                  <TableCell>Student</TableCell><TableCell>Dept</TableCell><TableCell>CGPA</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map(s => (
                  <TableRow key={s._id} hover selected={selectedIds.includes(s._id)}>
                    <TableCell padding="checkbox"><Checkbox checked={selectedIds.includes(s._id)} onChange={(e)=>handleSelectOne(e,s._id)}/></TableCell>
                    <TableCell>
                      <Box sx={{ display:'flex', gap:2, alignItems:'center' }}>
                        <Avatar sx={{ bgcolor:'#e0e7ff', color:'#4f46e5', fontWeight:'bold' }}>{s.name[0]}</Avatar>
                        <Box><Typography variant="subtitle2" fontWeight="bold">{s.name}</Typography><Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{s.registerNumber}</Typography></Box>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={s.department} size="small" variant="outlined" /></TableCell>
                    <TableCell><Typography fontWeight="bold" sx={{ color: s.cgpa>=8?'#10b981':'#f59e0b' }}>{s.cgpa}</Typography></TableCell>
                    <TableCell><Chip label={s.placementStatus} size="small" sx={{ bgcolor: s.placementStatus==='Placed'?'#dcfce7':'#f1f5f9', color: s.placementStatus==='Placed'?'#166534':'#64748b', fontWeight:'bold' }} /></TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={()=>handleOpenEdit(s)} color="primary"><Edit fontSize="small"/></IconButton>
                      <IconButton size="small" onClick={()=>handleDelete(s._id)} color="error"><Delete fontSize="small"/></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Floating Action Bar */}
        {selectedIds.length > 0 && (
          <Paper elevation={6} sx={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', bgcolor: '#1e293b', color: 'white', px: 3, py: 1.5, borderRadius: 50, display: 'flex', gap: 2, alignItems: 'center', zIndex:1200 }}>
             <Typography variant="body2" fontWeight="bold">{selectedIds.length} Selected</Typography>
             <Divider orientation="vertical" flexItem sx={{ bgcolor:'gray' }} />
             <Button startIcon={<Mail/>} sx={{ color:'white' }} onClick={()=>setOpenEmail(true)}>Email</Button>
             <IconButton size="small" onClick={()=>setSelectedIds([])} sx={{ color:'#94a3b8' }}><Close fontSize="small"/></IconButton>
          </Paper>
        )}
      </Box>

      {/* --- DIALOGS --- */}
      <Dialog open={openForm} onClose={()=>setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Student' : 'New Student'}</DialogTitle>
        <DialogContent>
           <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, mt:1 }}>
             <TextField label="Name" name="name" value={formData.name} onChange={handleFormChange} fullWidth />
             <TextField label="Reg No" name="registerNumber" value={formData.registerNumber} onChange={handleFormChange} disabled={isEdit} fullWidth />
             <TextField label="Email" name="email" value={formData.email} onChange={handleFormChange} fullWidth />
             <TextField label="CGPA" name="cgpa" type="number" value={formData.cgpa} onChange={handleFormChange} fullWidth />
             <FormControl fullWidth><InputLabel>Dept</InputLabel><Select name="department" value={formData.department} label="Dept" onChange={handleFormChange}>{deptOptions.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}</Select></FormControl>
             <FormControl fullWidth><InputLabel>Status</InputLabel><Select name="placementStatus" value={formData.placementStatus} label="Status" onChange={handleFormChange}>{placementStatusOptions.map(s=><MenuItem key={s} value={s}>{s}</MenuItem>)}</Select></FormControl>
             {formData.placementStatus === 'Placed' && (
                <>
                  <TextField label="Company" name="company" value={formData.company} onChange={handleFormChange} fullWidth />
                  <TextField label="Package (LPA)" name="ctc" type="number" value={formData.ctc} onChange={handleFormChange} fullWidth />
                </>
             )}
             <FormControl component="fieldset" sx={{ gridColumn:'span 2', mt:1 }}>
               <Typography variant="caption">Technical Skills</Typography>
               <FormGroup row>{techOptions.map(t=><FormControlLabel key={t} control={<Checkbox checked={formData.technologiesKnown.includes(t)} value={t} onChange={handleTechChange} size="small"/>} label={t}/>)}</FormGroup>
             </FormControl>
           </Box>
        </DialogContent>
        <DialogActions><Button onClick={()=>setOpenForm(false)}>Cancel</Button><Button variant="contained" onClick={handleSubmit}>Save</Button></DialogActions>
      </Dialog>
      
      {/* IMPORT CSV DIALOG */}
      <Dialog open={openImport} onClose={()=>setOpenImport(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import CSV</DialogTitle>
        <DialogContent>
          <Box sx={{ p:4, border:'2px dashed #ccc', textAlign:'center', cursor:'pointer' }} onClick={()=>fileInputRef.current.click()}>
            <input type="file" hidden ref={fileInputRef} onChange={handleImportCSV} accept=".csv" />
            <CloudUpload fontSize="large"/>
            <Typography>Click to Upload CSV</Typography>
            <Typography variant="caption" sx={{color:'gray'}}>Format: RegNo,Name,Email,Dept,Year</Typography>
            {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} sx={{mt:2}} />}
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* EMAIL DIALOG */}
      <Dialog open={openEmail} onClose={()=>setOpenEmail(false)} maxWidth="sm" fullWidth><DialogTitle>Bulk Email</DialogTitle><DialogContent><TextField label="Subject" fullWidth sx={{mb:2, mt:1}} value={emailSubject} onChange={e=>setEmailSubject(e.target.value)}/><TextField label="Message" multiline rows={4} fullWidth value={emailBody} onChange={e=>setEmailBody(e.target.value)}/></DialogContent><DialogActions><Button onClick={()=>setOpenEmail(false)}>Cancel</Button><Button variant="contained" startIcon={<Send/>} onClick={handleSendEmail}>Send</Button></DialogActions></Dialog>
      
      {/* MAINTENANCE / SETTINGS DIALOG */}
      <Dialog open={openSettings} onClose={()=>setOpenSettings(false)} maxWidth="xs" fullWidth>
        <DialogTitle>System Maintenance</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon><Build color="warning"/></ListItemIcon>
              <ListItemText primary="Maintenance Mode" secondary="Disable student access" />
              <Switch checked={maintenanceMode} onChange={handleMaintenanceToggle} />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleBackup}>
              <ListItemIcon><Backup color="primary"/></ListItemIcon>
              <ListItemText primary="Backup Database" secondary="Download JSON dump" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><Restore /></ListItemIcon>
              <ListItemText primary="Restore Data" secondary="Upload backup file" />
            </ListItem>
            <ListItem button>
               <ListItemIcon><Security color="error"/></ListItemIcon>
               <ListItemText primary="Clear Logs" secondary="Delete system activity logs" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions><Button onClick={()=>setOpenSettings(false)}>Close</Button></DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar({...snackbar, open:false})}><Alert severity={snackbar.severity} sx={{width:'100%'}}>{snackbar.message}</Alert></Snackbar>

    </Box>
  );
};

export default AdminDashboard;