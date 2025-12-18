import React, { useState, useEffect, useRef } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TextField, MenuItem, Button, Grid, Typography, Box, Chip, Card, IconButton, 
  InputAdornment, Avatar, Dialog, DialogTitle, DialogContent, 
  DialogActions, FormControl, InputLabel, Select, Checkbox, 
  Paper, Divider, LinearProgress, Snackbar, Alert, FormGroup, FormControlLabel 
} from '@mui/material';
import { 
  Search, CloudUpload, Add, Edit, Delete, 
  People, BusinessCenter, AttachMoney, 
  Mail, Close, Send, Terminal, Language, Storage, Cloud, School 
} from '@mui/icons-material';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import api from '../api';
import AdminLayout from './AdminLayout';
import '../App.css'; 

// --- CONSTANTS ---
const techOptions = ["C", "C++", "Java", "Python", "DS", "Algorithms", "React", "MERN", "HTML", "CSS", "Cloud", "Devops"];
const deptOptions = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "CSBS", "BME", "CHEM", "FASHION"];
const placementStatusOptions = ["Unplaced", "Placed", "Higher Studies", "Entrepreneur"];

// --- HELPER COMPONENTS ---
const getTechIcon = (techName) => {
  const name = techName.toLowerCase();
  if (name.includes('java') || name.includes('python') || name.includes('c++')) return <Terminal fontSize="small" />;
  if (name.includes('react') || name.includes('html') || name.includes('css')) return <Language fontSize="small" />;
  if (name.includes('data') || name.includes('sql')) return <Storage fontSize="small" />;
  if (name.includes('cloud')) return <Cloud fontSize="small" />;
  return <Terminal fontSize="small" />;
};

const KpiCard = ({ title, value, subtext, icon, color }) => (
  <Card className="dashboard-card" sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 3 }}>
    <Box>
      <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">{title}</Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: '#1e293b' }}>{value}</Typography>
      {subtext && <Typography variant="caption" sx={{ color: color, fontWeight: 600 }}>{subtext}</Typography>}
    </Box>
    <Avatar sx={{ bgcolor: color, width: 56, height: 56, boxShadow: `0 4px 10px ${color}66` }}>{icon}</Avatar>
  </Card>
);

const AdminDashboard = () => {
  // --- STATE ---
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ department: '', year: '', technology: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialogs
  const [openForm, setOpenForm] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
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
    placementStatus: 'Unplaced', company: '', ctc: ''
  });
  
  // Email Data
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // CSV Import
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- API CALLS ---
  const fetchStudents = async () => { try { const res = await api.get('/admin/students'); setStudents(res.data); } catch (err) { console.error(err); } };
  useEffect(() => { fetchStudents(); }, []);

  // --- FORM HANDLERS (DATABASE FIX APPLIED) ---
  
  // Unified Change Handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      technologiesKnown: checked 
        ? [...prev.technologiesKnown, value] 
        : prev.technologiesKnown.filter(t => t !== value)
    }));
  };

  const handleOpenNew = () => { 
    setIsEdit(false); 
    setFormData({ registerNumber: '', name: '', email: '', year: '', department: '', accommodationType: 'Day Scholar', technologiesKnown: [], placementStatus: 'Unplaced', company: '', ctc: '' }); 
    setOpenForm(true); 
  };

  const handleOpenEdit = (s) => { 
    setIsEdit(true); 
    setCurrentStudentId(s._id); 
    setFormData({ 
      ...s, 
      placementStatus: s.placementStatus || 'Unplaced',
      company: s.company || '',
      ctc: s.ctc || '' 
    }); 
    setOpenForm(true); 
  };

  const handleSubmit = async () => { 
    try { 
      // Clean Payload: Ensure numbers are numbers and conditional fields are handled
      const payload = { 
        name: formData.name,
        registerNumber: formData.registerNumber,
        email: formData.email,
        department: formData.department,
        year: formData.year,
        technologiesKnown: formData.technologiesKnown,
        placementStatus: formData.placementStatus,
        accommodationType: formData.accommodationType,
        company: formData.placementStatus === 'Placed' ? formData.company : '',
        ctc: formData.placementStatus === 'Placed' ? Number(formData.ctc) : 0,
      };

      if (isEdit) {
        // PUT request: ID goes in URL, NOT in body
        await api.put(`/admin/students/${currentStudentId}`, payload);
        setSnackbar({ open: true, message: 'Student updated successfully!', severity: 'success' });
      } else {
        // POST request
        await api.post('/students/register', payload);
        setSnackbar({ open: true, message: 'Student created successfully!', severity: 'success' });
      }
      
      fetchStudents(); 
      setOpenForm(false); 
    } catch (err) { 
      console.error(err);
      setSnackbar({ open: true, message: 'Operation failed. Please try again.', severity: 'error' });
    } 
  };

  const handleDelete = async (id) => { 
    if (window.confirm('Are you sure you want to delete this student?')) { 
      try {
        await api.delete(`/admin/students/${id}`); 
        fetchStudents();
        setSnackbar({ open: true, message: 'Deleted successfully', severity: 'success' });
      } catch(err) {
        setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
      }
    } 
  };

  // --- SELECTION & FILTER LOGIC ---
  const filteredStudents = students.filter(student => (
    (filters.department === '' || student.department === filters.department) &&
    (filters.year === '' || student.year === filters.year) &&
    (filters.technology === '' || student.technologiesKnown.includes(filters.technology)) && 
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.registerNumber.includes(searchTerm))
  ));

  const handleSelectAll = (event) => {
    setSelectedIds(event.target.checked ? filteredStudents.map((n) => n._id) : []);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selectedIds, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selectedIds.slice(1));
    else if (selectedIndex === selectedIds.length - 1) newSelected = newSelected.concat(selectedIds.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selectedIds.slice(0, selectedIndex), selectedIds.slice(selectedIndex + 1));
    setSelectedIds(newSelected);
  };

  // --- BULK IMPORT (MOCK) ---
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadProgress(10);
      setTimeout(() => setUploadProgress(100), 1000);
      setTimeout(() => {
        setOpenImport(false);
        setUploadProgress(0);
        setSnackbar({ open: true, message: 'Import successful!', severity: 'success' });
        fetchStudents();
      }, 1500);
    }
  };

  // --- BULK EMAIL (MOCK) ---
  const handleSendEmail = () => {
    console.log(`Sending email to ${selectedIds.length} students:`, emailSubject);
    setOpenEmail(false);
    setSelectedIds([]);
    setSnackbar({ open: true, message: `Email sent to ${selectedIds.length} students!`, severity: 'info' });
  };

  // --- CHART DATA ---
  const placedCount = students.filter(s => s.placementStatus === 'Placed').length;
  const placementRate = students.length > 0 ? ((placedCount / students.length) * 100).toFixed(0) : 0;
  
  // Calculate Avg Package
  const placedWithPackage = students.filter(s => s.placementStatus === 'Placed' && s.ctc > 0);
  const avgPackage = placedWithPackage.length > 0 
    ? (placedWithPackage.reduce((acc, curr) => acc + curr.ctc, 0) / placedWithPackage.length).toFixed(1) 
    : "0";

  // Dept Data
  const deptData = Object.entries(students.reduce((acc, curr) => ({...acc, [curr.department]: (acc[curr.department] || 0) + 1}), {})).map(([k,v]) => ({name:k, value:v}));
  
  // Year Data
  const yearData = ["1st", "2nd", "3rd", "4th"].map(y => ({ name: y, value: students.filter(s => s.year.includes(y)).length }));
  
  // Top Skills
  const techCounts = {}; 
  students.forEach(s => s.technologiesKnown.forEach(t => techCounts[t] = (techCounts[t] || 0) + 1));
  let sortedTech = Object.entries(techCounts).map(([k,v]) => ({name:k, count:v})).sort((a,b) => b.count - a.count).slice(0, 5);
  const maxTechCount = sortedTech.length > 0 ? sortedTech[0].count : 1;

  const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  return (
    <AdminLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }} className="slide-up">
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>Dashboard</Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>Manage students, placements & communications</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => setOpenImport(true)} sx={{ borderRadius: 2, textTransform: 'none' }}>Import CSV</Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenNew} sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#3b82f6' }}>New Student</Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }} className="slide-up">
        <Grid item xs={12} md={4}><KpiCard title="Total Students" value={students.length} subtext="Active Profiles" icon={<People sx={{ color: 'white' }} />} color="#3b82f6" /></Grid>
        <Grid item xs={12} md={4}><KpiCard title="Placement Rate" value={`${placementRate}%`} subtext={`${placedCount} Placed`} icon={<BusinessCenter sx={{ color: 'white' }} />} color="#10b981" /></Grid>
        <Grid item xs={12} md={4}><KpiCard title="Avg Package" value={`₹${avgPackage} LPA`} subtext="Annual CTC" icon={<AttachMoney sx={{ color: 'white' }} />} color="#f59e0b" /></Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Department Split (Donut) */}
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card" sx={{ p: 3, height: 420, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Department Split</Typography>
            <ResponsiveContainer width="100%" height="90%">
               <PieChart>
                 <defs>{deptData.map((e,i) => <linearGradient key={i} id={`grad-${i}`}><stop stopColor={CHART_COLORS[i%5]} stopOpacity={1}/><stop offset="1" stopColor={CHART_COLORS[i%5]} stopOpacity={0.6}/></linearGradient>)}</defs>
                 <Pie data={deptData} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value" cornerRadius={5} stroke="none">
                   {deptData.map((e,i) => <Cell key={i} fill={`url(#grad-${i})`} />)}
                 </Pie>
                 <RechartsTooltip contentStyle={{borderRadius: 12}} />
                 <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                   <tspan x="50%" dy="-10" fontSize="28" fontWeight="bold" fill="#1e293b">{students.length}</tspan>
                   <tspan x="50%" dy="24" fontSize="14" fill="#64748b">Total</tspan>
                 </text>
               </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Enrollment Trends (Area) */}
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card" sx={{ p: 3, height: 420, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Enrollment Trends</Typography>
            <ResponsiveContainer width="100%" height="90%">
               <AreaChart data={yearData}>
                 <defs><linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs>
                 <CartesianGrid vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                 <RechartsTooltip contentStyle={{borderRadius: 8, backgroundColor: '#1e293b', color: '#fff', border:'none'}} itemStyle={{color:'#fff'}} />
                 <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorY)" />
               </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Top Skills (Leaderboard) */}
        <Grid item xs={12} md={4}>
           <Card className="dashboard-card" sx={{ p: 3, height: 420, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
             <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Top In-Demand Skills</Typography>
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                {sortedTech.map((tech, index) => {
                   const percent = (tech.count / maxTechCount) * 100;
                   const color = CHART_COLORS[index % 5];
                   return (
                     <Box key={tech.name}>
                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                           <Avatar variant="rounded" sx={{ bgcolor: `${color}15`, color: color, width: 32, height: 32 }}>{getTechIcon(tech.name)}</Avatar>
                           <Typography variant="body2" fontWeight="600" sx={{ color: '#334155' }}>{tech.name}</Typography>
                         </Box>
                         <Typography variant="caption" fontWeight="bold" sx={{ color: '#64748b' }}>{tech.count}</Typography>
                       </Box>
                       <Box sx={{ width: '100%', bgcolor: '#f1f5f9', borderRadius: 5, height: 6 }}>
                         <Box sx={{ width: `${percent}%`, bgcolor: color, height: '100%', borderRadius: 5, transition: 'width 1s' }} />
                       </Box>
                     </Box>
                   );
                })}
             </Box>
           </Card>
        </Grid>
      </Grid>

      {/* Main Table */}
      <Card className="dashboard-card slide-up" sx={{ overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative' }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #eee' }}>
          <TextField size="small" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ width: 250, bgcolor: 'white' }} />
          <TextField select size="small" label="Dept" value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})} sx={{ minWidth: 120, bgcolor: 'white' }}>
            <MenuItem value="">All</MenuItem>{deptOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </TextField>
          <Box sx={{ flexGrow: 1 }} />
          {selectedIds.length > 0 && <Chip label={`${selectedIds.length} Selected`} color="primary" onDelete={() => setSelectedIds([])} sx={{ fontWeight: 'bold' }} />}
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox indeterminate={selectedIds.length > 0 && selectedIds.length < filteredStudents.length} checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length} onChange={handleSelectAll} /></TableCell>
                <TableCell><strong>Student</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Company</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((s) => {
                const isSelected = selectedIds.indexOf(s._id) !== -1;
                return (
                  <TableRow key={s._id} hover selected={isSelected}>
                    <TableCell padding="checkbox"><Checkbox checked={isSelected} onChange={(event) => handleSelectOne(event, s._id)} /></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', fontWeight: 'bold' }}>{s.name[0]}</Avatar>
                        <Box><Typography variant="subtitle2" fontWeight="600">{s.name}</Typography><Typography variant="caption" color="textSecondary">{s.registerNumber}</Typography></Box>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={s.department} size="small" variant="outlined" /></TableCell>
                    <TableCell>
                        <Chip 
                            label={s.placementStatus || 'Unplaced'} 
                            size="small" 
                            icon={s.placementStatus === 'Placed' ? <BusinessCenter style={{fontSize: 14}}/> : s.placementStatus === 'Higher Studies' ? <School style={{fontSize: 14}}/> : undefined}
                            sx={{ 
                                bgcolor: s.placementStatus === 'Placed' ? '#dcfce7' : s.placementStatus === 'Higher Studies' ? '#dbeafe' : '#f1f5f9',
                                color: s.placementStatus === 'Placed' ? '#166534' : s.placementStatus === 'Higher Studies' ? '#1e40af' : '#64748b',
                                fontWeight: 'bold'
                            }} 
                        />
                    </TableCell>
                    <TableCell>
                        {s.placementStatus === 'Placed' 
                            ? <Typography variant="caption" fontWeight="bold"> {s.company} (₹{s.ctc} LPA) </Typography> 
                            : <Typography variant="caption" color="textSecondary">--</Typography>
                        }
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEdit(s)}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(s._id)}><Delete fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Floating Bulk Actions */}
        {selectedIds.length > 0 && (
          <Paper elevation={4} sx={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, px: 3, py: 1.5, borderRadius: 10, bgcolor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="body2" fontWeight="bold">{selectedIds.length} students selected</Typography>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'gray' }} />
            <Button startIcon={<Mail />} sx={{ color: 'white', textTransform: 'none' }} onClick={() => setOpenEmail(true)}>Send Bulk Email</Button>
            <IconButton size="small" sx={{ color: '#94a3b8' }} onClick={() => setSelectedIds([])}><Close fontSize="small" /></IconButton>
          </Paper>
        )}
      </Card>

      {/* STUDENT FORM DIALOG */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Student' : 'New Student'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField label="Name" name="name" fullWidth value={formData.name} onChange={handleFormChange} />
            <TextField label="Reg No" name="registerNumber" fullWidth value={formData.registerNumber} onChange={handleFormChange} disabled={isEdit} />
            <TextField label="Email" name="email" fullWidth value={formData.email} onChange={handleFormChange} sx={{ gridColumn: 'span 2' }} />
            <FormControl fullWidth><InputLabel>Dept</InputLabel><Select name="department" value={formData.department} label="Dept" onChange={handleFormChange}>{deptOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}</Select></FormControl>
            <FormControl fullWidth><InputLabel>Year</InputLabel><Select name="year" value={formData.year} label="Year" onChange={handleFormChange}><MenuItem value="1st Year">1st Year</MenuItem><MenuItem value="2nd Year">2nd Year</MenuItem><MenuItem value="3rd Year">3rd Year</MenuItem><MenuItem value="4th Year">4th Year</MenuItem></Select></FormControl>
            
            <Divider sx={{ gridColumn: 'span 2', my: 1 }} />
            <Typography variant="subtitle2" sx={{ gridColumn: 'span 2', color: '#64748b' }}>Placement Status</Typography>
            
            <FormControl fullWidth sx={{ gridColumn: 'span 2' }}>
              <InputLabel>Status</InputLabel>
              <Select name="placementStatus" value={formData.placementStatus} label="Status" onChange={handleFormChange}>
                {placementStatusOptions.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>

            {formData.placementStatus === 'Placed' && (
              <>
                 <TextField label="Company" name="company" fullWidth value={formData.company} onChange={handleFormChange} placeholder="e.g. Google" />
                 <TextField label="Package (LPA)" name="ctc" type="number" fullWidth value={formData.ctc} onChange={handleFormChange} placeholder="12.5" />
              </>
            )}

            <FormControl component="fieldset" sx={{ gridColumn: 'span 2', mt: 2 }}>
              <Typography variant="caption" sx={{ mb: 1 }}>Skills</Typography>
              <FormGroup row>
                {techOptions.map(t => (
                  <FormControlLabel key={t} control={<Checkbox checked={formData.technologiesKnown.includes(t)} value={t} onChange={handleTechChange} size="small" />} label={<Typography variant="body2">{t}</Typography>} />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* IMPORT DIALOG */}
      <Dialog open={openImport} onClose={() => setOpenImport(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import CSV</DialogTitle>
        <DialogContent>
          <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 4, textAlign: 'center', cursor: 'pointer', mt: 1 }} onClick={() => fileInputRef.current.click()}>
            <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept=".csv" />
            <CloudUpload sx={{ fontSize: 40, color: '#94a3b8' }} />
            <Typography variant="body2" sx={{ mt: 1 }}>Click to upload student data CSV</Typography>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* EMAIL DIALOG */}
      <Dialog open={openEmail} onClose={() => setOpenEmail(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Compose Email</DialogTitle>
        <DialogContent>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Sending to {selectedIds.length} recipients</Typography>
          <TextField autoFocus margin="dense" label="Subject" fullWidth value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
          <TextField margin="dense" label="Message" fullWidth multiline rows={4} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmail(false)}>Cancel</Button>
          <Button variant="contained" endIcon={<Send />} onClick={handleSendEmail}>Send</Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default AdminDashboard;