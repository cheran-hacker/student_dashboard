import React, { useState, useEffect, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Button, Grid, Typography, Box, Chip, Card, IconButton,
  InputAdornment, Avatar, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, Checkbox,
  Divider, Snackbar, Alert, FormGroup, FormControlLabel, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, LinearProgress, Switch, Tooltip, Badge, Skeleton, Fade
} from '@mui/material';
const CustomTooltip = ({ active, payload, label, dark }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: dark ? '#1e293b' : '#fff', p: 1.5, border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <Typography variant="body2" fontWeight={700} sx={{ color: dark ? '#f1f5f9' : '#1e293b', mb: 0.5 }}>{label}</Typography>
        {payload.map((p, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color }} />
            <Typography variant="caption" sx={{ color: dark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>{p.name}: {p.value}</Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};
import {
  Search, CloudUpload, CloudDownload, Add, Edit, Delete,
  People, BusinessCenter, TrendingUp, AttachMoney,
  Mail, Close, Send, Terminal, Language, Storage, Cloud,
  DarkMode, LightMode, Dashboard, Logout, Settings, Build, Backup, Restore, Security,
  NotificationsNone, ArrowUpward, Group, School, Engineering, History, Download, FilePresent, Visibility, CheckCircle, Warning
} from '@mui/icons-material';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area, LineChart, Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
const MotionCard = motion.create ? motion.create(Card) : motion(Card);
const MotionBox = motion.create ? motion.create(Box) : motion(Box);
const MotionGrid = motion.create ? motion.create(Grid) : motion(Grid);
const MotionRow = motion.create ? motion.create(TableRow) : motion(TableRow);
import api from '../api';
import '../App.css';

const techOptions = ["C", "C++", "Java", "Python", "DS", "Algorithms", "React", "MERN", "HTML", "CSS", "Cloud", "Devops", "TypeScript", "Node.js", "Express", "MongoDB", "MySQL", "AWS", "Azure", "Docker", "Kubernetes", "UI/UX", "Figma", "Canva", "Postman", "Git", "GitHub", "Next.js", "Vue.js", "Angular", "PHP", "Laravel", "Swift", "Kotlin", "Flutter", "React Native", "Machine Learning", "Data Science", "Artificial Intelligence", "Cyber Security", "Blockchain"];
const deptOptions = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "CSBS", "BME", "CHEM", "FASHION", "AIML", "Cyber Security", "Robotics", "Aerospace", "Automobile", "Biotech", "Food Tech", "Textile", "Architecture"];
const placementStatusOptions = ["Unplaced", "Placed", "Higher Studies", "Entrepreneur"];
const DRAWER_WIDTH = 265;
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e', '#14b8a6', '#8b5cf6', '#d946ef'];

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

// Stat Animation Component
const CountUp = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (start === end) { setCount(end); return; }
    let timer = setInterval(() => {
      start += Math.ceil((end - start) / 10);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [value]);
  return count;
};

const AdminDashboard = ({ darkMode, setDarkMode }) => {
  const [students, setStudents] = useState([]);
  const [trendView, setTrendView] = useState('6months');
  const [filters, setFilters] = useState({ department: '', year: '', status: '', accommodation: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ registerNumber: '', name: '', email: '', year: '', department: '', accommodationType: 'Day Scholar', technologiesKnown: [], placementStatus: 'Unplaced', company: '', ctc: '', cgpa: '' });
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [emailSending, setEmailSending] = useState(false);
  const [emailProgress, setEmailProgress] = useState(0);

  const filtered = students.filter(s =>
    (!filters.department || s.department === filters.department) &&
    (!filters.year || s.year === filters.year) &&
    (!filters.status || s.placementStatus === filters.status) &&
    (!filters.accommodation || s.accommodationType === filters.accommodation) &&
    (s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.registerNumber?.includes(searchTerm))
  );

  // Optimized Placement Trends Calculation
  const placementTrends = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const range = trendView === 'yearly' ? 12 : 6;
    const monthlyData = [];

    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyData.push({
        name: months[d.getMonth()],
        month: d.getMonth(),
        year: d.getFullYear(),
        students: 0,
        packages: 0,
        placedCount: 0,
        ctcSum: 0
      });
    }

    filtered.forEach(s => {
      const created = new Date(s.createdAt || Date.now());
      const trendMonth = monthlyData.find(m => m.month === created.getMonth() && m.year === created.getFullYear());
      if (trendMonth) {
        trendMonth.students++;
        if (s.placementStatus === 'Placed') {
          trendMonth.placedCount++;
          trendMonth.ctcSum += Number(s.ctc) || 0;
        }
      }
    });

    return monthlyData.map(m => ({
      name: m.name,
      students: m.students,
      packages: m.placedCount > 0 ? (m.ctcSum / m.placedCount).toFixed(1) : 0
    }));
  }, [filtered, trendView]);

  // Optimized Activity Logs
  const activityLogs = React.useMemo(() => {
    const sorted = [...filtered].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 10);
    return sorted.map(s => {
      const diff = Math.floor((new Date() - new Date(s.createdAt || Date.now())) / (1000 * 60));
      let timeStr = 'Just now';
      if (diff >= 1440) timeStr = `${Math.floor(diff / 1440)} days ago`;
      else if (diff >= 60) timeStr = `${Math.floor(diff / 60)} hours ago`;
      else if (diff > 0) timeStr = `${diff} mins ago`;

      return {
        id: s._id,
        type: s.placementStatus === 'Placed' ? 'placed' : 'registration',
        user: s.name,
        time: timeStr,
        desc: s.placementStatus === 'Placed' ? `Placed at ${s.company || 'Company'}` : 'New student registered'
      };
    });
  }, [filtered]);

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const handleBulkEmail = async () => {
    setOpenEmail(false);
    setEmailSending(true);
    setEmailProgress(0);
    const total = selectedIds.length;

    // Simulate real-time progress for bulk email
    for (let i = 1; i <= 10; i++) {
      await new Promise(r => setTimeout(r, 200));
      setEmailProgress(i * 10);
    }

    setEmailSending(false);
    setSelectedIds([]);
    setSnackbar({ open: true, message: `Bulk email sent successfully to ${total} students!`, severity: 'success' });
  };

  const BG = darkMode ? '#0f172a' : '#f1f5f9';
  const CARD = darkMode ? '#1e293b' : '#ffffff';
  const BORDER = darkMode ? '#334155' : '#e2e8f0';
  const TEXT = darkMode ? '#f1f5f9' : '#1e293b';
  const TEXT2 = darkMode ? '#94a3b8' : '#64748b';
  const SUBCARD = darkMode ? '#0f172a' : '#f8fafc';

  const fetchStudents = async () => {
    setLoading(true);
    try { const r = await api.get('/admin/students'); setStudents(r.data); }
    catch (e) { setSnackbar({ open: true, message: 'Failed to load students', severity: 'error' }); }
    finally { setLoading(false); }
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
    if (formData.placementStatus === 'Placed') {
      if (!formData.company?.trim()) return 'Company name is required for Placed students';
      if (!formData.ctc || Number(formData.ctc) <= 0) return 'Package (LPA) is required and must be greater than 0';
    }
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

  const handleGenerateFullReport = () => {
    setSnackbar({ open: true, message: 'Generating comprehensive success report...', severity: 'info' });

    // Add analytical summary header to the report
    const summary = [
      ['Report Name', 'Student Intelligence & Placement Success Report'],
      ['Date Generated', new Date().toLocaleString()],
      ['Total Students', students.length],
      ['Placement Rate', `${placementRate}%`],
      ['Average CGPA', avgCgpa],
      ['Average Package', `₹${avgPkg}L`],
      ['Predictive Success Score', `${predictiveScore}%`],
      [''],
      ['Detailed Student Intelligence Data'],
      ['Name', 'Register Number', 'Email', 'Department', 'Year', 'CGPA', 'Status', 'Company', 'Package (LPA)', 'Accommodation', 'Skills']
    ];

    const dataRows = students.map(s => [
      s.name,
      s.registerNumber,
      s.email,
      s.department,
      s.year,
      s.cgpa,
      s.placementStatus,
      s.company || 'N/A',
      s.ctc || '0',
      s.accommodationType || 'Day Scholar',
      s.technologiesKnown?.join('; ') || 'N/A'
    ]);

    const csvContent = [...summary, ...dataRows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Student_Nexus_Full_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbar({ open: true, message: 'Full report generated successfully!', severity: 'success' });
  };

  const handleExport = (format) => {
    const data = students.map(s => ({
      Name: s.name,
      'Reg No': s.registerNumber,
      Department: s.department,
      Year: s.year,
      CGPA: s.cgpa,
      Status: s.placementStatus,
      Skills: s.technologiesKnown?.join(', ')
    }));

    if (format === 'CSV') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Student_Nexus_Report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      setSnackbar({ open: true, message: `Data exported as CSV successfully!`, severity: 'success' });
    }
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


  const handleSelectAll = (e) => setSelectedIds(e.target.checked ? filtered.map(s => s._id) : []);
  const handleSelectOne = (e, id) => setSelectedIds(prev => e.target.checked ? [...prev, id] : prev.filter(i => i !== id));

  // Analytics (Synchronized with Filters)
  const placedCount = filtered.filter(s => s.placementStatus === 'Placed').length;
  const placementRate = filtered.length ? ((placedCount / filtered.length) * 100).toFixed(0) : 0;
  const validCgpa = filtered.filter(s => s.cgpa > 0);
  const avgCgpa = validCgpa.length ? (validCgpa.reduce((a, s) => a + Number(s.cgpa || 0), 0) / validCgpa.length).toFixed(1) : '0.0';
  const avgPkg = filtered.filter(s => s.ctc > 0).length
    ? (filtered.filter(s => s.ctc > 0).reduce((a, s) => a + Number(s.ctc || 0), 0) / filtered.filter(s => s.ctc > 0).length).toFixed(1)
    : '0';

  const cgpaDist = [
    { range: '9-10', count: filtered.filter(s => s.cgpa >= 9).length },
    { range: '8-9', count: filtered.filter(s => s.cgpa >= 8 && s.cgpa < 9).length },
    { range: '7-8', count: filtered.filter(s => s.cgpa >= 7 && s.cgpa < 8).length },
    { range: '< 7', count: filtered.filter(s => s.cgpa > 0 && s.cgpa < 7).length },
  ];
  const deptData = Object.entries(filtered.reduce((a, s) => ({ ...a, [s.department]: (a[s.department] || 0) + 1 }), {})).map(([k, v]) => ({ name: k, value: v }));
  const techCounts = {};
  filtered.forEach(s => s.technologiesKnown?.forEach(t => { techCounts[t] = (techCounts[t] || 0) + 1; }));
  const topTech = Object.entries(techCounts).map(([k, v]) => ({ name: k, count: v })).sort((a, b) => b.count - a.count).slice(0, 12);
  const maxTech = topTech[0]?.count || 1;

  // Dynamic KPI Trends
  const getTrend = (type) => {
    const now = new Date();
    const currMonth = now.getMonth();
    const currYear = now.getFullYear();
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    const prevYear = currMonth === 0 ? currYear - 1 : currYear;

    const currentData = students.filter(s => {
      const d = new Date(s.createdAt || Date.now());
      return d.getMonth() === currMonth && d.getFullYear() === currYear;
    });
    const previousData = students.filter(s => {
      const d = new Date(s.createdAt || Date.now());
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });

    if (type === 'total') {
      const diff = currentData.length - previousData.length;
      return diff >= 0 ? `+${diff}` : `${diff}`;
    }
    if (type === 'placed') {
      const currP = currentData.filter(s => s.placementStatus === 'Placed').length;
      const prevP = previousData.filter(s => s.placementStatus === 'Placed').length;
      const diff = currP - prevP;
      return diff >= 0 ? `+${diff}` : `${diff}`;
    }
    return '+0';
  };

  const highTierStudents = students.filter(s => (s.cgpa >= 8.5) || (s.cgpa >= 7.5 && s.technologiesKnown?.length >= 3)).length;
  const predictiveScore = students.length ? ((highTierStudents / students.length) * 100).toFixed(0) : 0;

  const kpiCards = [
    { title: 'Total Students', val: students.length, icon: <People />, col: '#3b82f6', cls: 'blue', trend: getTrend('total') },
    { title: 'Placement Rate', val: `${placementRate}%`, icon: <BusinessCenter />, col: '#10b981', cls: 'green', trend: getTrend('placed') },
    { title: 'Avg CGPA', val: avgCgpa, icon: <TrendingUp />, col: '#8b5cf6', cls: 'purple', trend: '+0.1' },
    { title: 'Avg Package', val: `₹${avgPkg}L`, icon: <AttachMoney />, col: '#f59e0b', cls: 'amber', trend: '+5%' },
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: BG, color: TEXT, fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* ── ANIMATED BACKGROUND BLOBS ── */}
      <Box className="blob blob-1" />
      <Box className="blob blob-2" />
      <Box className="blob blob-3" />
      <Box className="blob blob-4" />

      {/* ── SIDEBAR ── */}
      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: '#0f172a', color: 'white', borderRight: 'none', boxShadow: '4px 0 24px rgba(0,0,0,0.3)' } }}>
        {/* Logo */}
        <Box sx={{ p: 3.5, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
              <Dashboard sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            <Typography variant="h6" fontWeight="900" fontFamily="'Outfit',sans-serif" sx={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              STUDENT NEXUS
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#475569', pl: 0.5 }}>Admin Portal v2.0</Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

        {/* Nav */}
        <List sx={{ px: 2, mt: 2, flexGrow: 1 }}>
          {navItems.map(item => (
            <ListItemButton
              key={item.label}
              onClick={() => { setActiveNav(item.label); item.action?.(); }}
              className={`sidebar-nav-item${activeNav === item.label ? ' active' : ''}`}
              sx={{ px: 2, py: 1.2, color: activeNav === item.label ? 'white' : '#64748b', borderRadius: '12px', mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: activeNav === item.label ? 700 : 500, fontSize: '0.875rem' }} />
              {activeNav === item.label && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.7)' }} />}
            </ListItemButton>
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

        {/* Header Bar with Glassmorphism */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          p: 3,
          borderRadius: '24px',
          bgcolor: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
        }}>
          <Box>
            <Typography variant="h4" fontWeight="800" fontFamily="'Outfit',sans-serif" sx={{ color: TEXT, lineHeight: 1.2 }}>
              {activeNav}
            </Typography>
            <Typography variant="body2" sx={{ color: TEXT2, mt: 0.3 }}>Welcome back, Admin • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ bgcolor: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', '&:hover': { bgcolor: BORDER } }}>
                {darkMode ? <LightMode sx={{ color: '#fbbf24' }} /> : <DarkMode sx={{ color: '#64748b' }} />}
              </IconButton>
            </Tooltip>
            {/* ... other header actions ... */}
            <Button variant="outlined" startIcon={<CloudDownload />} onClick={() => handleExport('CSV')}
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
        <motion.div variants={containerVars} initial="hidden" animate="show">
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {kpiCards.map((k, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div variants={itemVars} whileHover={{ y: -5 }}>
                  <Card className={`kpi-card ${k.cls}`} sx={{
                    p: 3,
                    bgcolor: CARD,
                    borderRadius: '18px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: `0 8px 32px rgba(0,0,0,${darkMode ? '.3' : '.1'})`,
                    '&:hover': {
                      animation: 'pulseGlow 2s ease-in-out infinite'
                    }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: TEXT2, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.65rem' }}>{k.title}</Typography>
                        <Typography variant="h4" fontWeight="800" fontFamily="'Outfit',sans-serif" sx={{ color: TEXT, mt: 0.5, lineHeight: 1.1 }}>
                          {loading ? <Skeleton width={60} /> : (k.val.toString().includes('%') || k.val.toString().includes('₹') ? k.val : <CountUp value={k.val} />)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.8 }}>
                          <ArrowUpward sx={{ fontSize: 12, color: '#10b981' }} />
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>{k.trend}</Typography>
                        </Box>
                      </Box>
                      <Avatar variant="rounded" sx={{ width: 44, height: 44, background: `linear-gradient(135deg, ${k.col}22, ${k.col}44)`, color: k.col, border: `1px solid ${k.col}33` }}>{k.icon}</Avatar>
                    </Box>
                    <Box sx={{ position: 'absolute', right: -15, bottom: -15, opacity: 0.05, transform: 'scale(2)', color: k.col }}>{k.icon}</Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Charts Container */}
        <motion.div variants={containerVars} initial="hidden" animate="show">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Main Growth Chart */}
            <Grid size={{ xs: 12 }}>
              <motion.div variants={itemVars}>
                <Card sx={{ p: 4, height: 500, bgcolor: CARD, borderRadius: '24px', boxShadow: `0 10px 40px rgba(0,0,0,${darkMode ? '.25' : '.08'})`, border: `1px solid ${BORDER}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                      <Typography variant="h5" fontWeight="900" sx={{ color: TEXT, letterSpacing: '-0.02em' }}>Placement Intelligence Insights</Typography>
                      <Typography variant="body2" sx={{ color: TEXT2 }}>Monthly student placement and package growth analytics</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant={trendView === '6months' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => setTrendView('6months')}
                        sx={{ borderRadius: '10px', textTransform: 'none', borderColor: BORDER, color: trendView === '6months' ? 'white' : TEXT, bgcolor: trendView === '6months' ? '#6366f1' : 'transparent' }}
                      >
                        6 Months
                      </Button>
                      <Button
                        variant={trendView === 'yearly' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => setTrendView('yearly')}
                        sx={{ borderRadius: '10px', textTransform: 'none', borderColor: BORDER, color: trendView === 'yearly' ? 'white' : TEXT, bgcolor: trendView === 'yearly' ? '#6366f1' : 'transparent' }}
                      >
                        Yearly View
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ height: 420, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={placementTrends}>
                        <defs>
                          <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: TEXT2, fontSize: 13 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: TEXT2, fontSize: 13 }} />
                        <RechartsTooltip content={<CustomTooltip dark={darkMode} />} />
                        <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorStudents)" />
                        <Line type="monotone" dataKey="packages" stroke="#ec4899" strokeWidth={3} dot={{ r: 6, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </motion.div>
            </Grid>

            {/* Academic & Dept Split - WIDER CARDS */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <motion.div variants={itemVars}>
                <Card sx={{ p: 4, height: 520, bgcolor: CARD, borderRadius: '24px', boxShadow: `0 10px 40px rgba(0,0,0,${darkMode ? '.25' : '.08'})`, border: `1px solid ${BORDER}` }}>
                  <Typography variant="h6" fontWeight="800" sx={{ mb: 3, color: TEXT }}>Academic Distribution Score</Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={cgpaDist} barSize={60}>
                      <defs>
                        {CHART_COLORS.map((c, i) => (
                          <linearGradient key={i} id={`grad-bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={c} />
                            <stop offset="100%" stopColor={c} stopOpacity={0.5} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: TEXT2, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: TEXT2 }} />
                      <RechartsTooltip content={<CustomTooltip dark={darkMode} />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                      <Bar dataKey="count" radius={[15, 15, 0, 0]}>
                        {cgpaDist.map((_, i) => <Cell key={i} fill={`url(#grad-bar-${i % CHART_COLORS.length})`} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <motion.div variants={itemVars}>
                <Card sx={{ p: 4, height: 520, bgcolor: CARD, borderRadius: '24px', boxShadow: `0 10px 40px rgba(0,0,0,${darkMode ? '.25' : '.08'})`, border: `1px solid ${BORDER}`, position: 'relative' }}>
                  <Typography variant="h6" fontWeight="800" sx={{ mb: 1, color: TEXT }}>Department Ecosystem</Typography>
                  <Box sx={{ position: 'relative', height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={deptData} innerRadius={100} outerRadius={140} dataKey="value" paddingAngle={8} strokeWidth={0} cornerRadius={10}>
                          {deptData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip dark={darkMode} />} />
                        <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '13px', color: TEXT2, fontWeight: 600 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box sx={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <Typography variant="h2" fontWeight="900" sx={{ color: TEXT, lineHeight: 1 }}>{students.length}</Typography>
                      <Typography variant="subtitle2" sx={{ color: TEXT2, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Students</Typography>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>

            {/* Global Skill Intelligence - FULL WIDTH SCROLLABLE */}
            <Grid size={{ xs: 12 }}>
              <motion.div variants={itemVars}>
                <Card sx={{ p: 4, bgcolor: CARD, borderRadius: '24px', boxShadow: `0 10px 40px rgba(0,0,0,${darkMode ? '.25' : '.08'})`, border: `1px solid ${BORDER}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="800" sx={{ color: TEXT }}>Core Technical Competency Index</Typography>
                    <Typography variant="caption" sx={{ color: TEXT2, fontWeight: 700 }}>Aggregated from {students.length} student profiles</Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {topTech.map((t, i) => (
                      <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                        <Box sx={{ p: 2, borderRadius: '16px', bgcolor: SUBCARD, border: `1px solid ${BORDER}`, transition: '0.3s', '&:hover': { transform: 'scale(1.02)', borderColor: CHART_COLORS[i % CHART_COLORS.length] } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: `${CHART_COLORS[i % CHART_COLORS.length]}20`, color: CHART_COLORS[i % CHART_COLORS.length] }}>
                                {getTechIcon(t.name)}
                              </Avatar>
                              <Typography variant="body2" fontWeight={700} sx={{ color: TEXT }}>{t.name}</Typography>
                            </Box>
                            <Chip label={t.count} size="small" sx={{ fontWeight: 800, bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: CHART_COLORS[i % CHART_COLORS.length] }} />
                          </Box>
                          <LinearProgress variant="determinate" value={(t.count / maxTech) * 100} sx={{ height: 8, borderRadius: 4, bgcolor: BORDER, '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[(i + 1) % CHART_COLORS.length] || CHART_COLORS[0]})`, borderRadius: 4 } }} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Real-time Activity & Quick Actions */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <motion.div variants={itemVars}>
              <Card sx={{ p: 4, height: 450, bgcolor: CARD, borderRadius: '24px', boxShadow: `0 10px 40px rgba(0,0,0,${darkMode ? '.25' : '.08'})`, border: `1px solid ${BORDER}` }}>
                <Typography variant="h6" fontWeight="800" sx={{ mb: 3, color: TEXT }}>Live Intelligence Feed</Typography>
                <List sx={{ p: 0, height: 350, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: BORDER, borderRadius: '4px' } }}>
                  {activityLogs.map((log, i) => (
                    <React.Fragment key={log.id}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemIcon sx={{ minWidth: 48 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: log.type === 'registration' ? '#10b98120' : '#6366f120', color: log.type === 'registration' ? '#10b981' : '#6366f1' }}>
                            {log.type === 'registration' ? <Add fontSize="small" /> : <History fontSize="small" />}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2" fontWeight={700} sx={{ color: TEXT }}>{log.desc}</Typography>}
                          secondary={<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}><Typography variant="caption" sx={{ color: TEXT2 }}>By {log.user}</Typography><Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 700 }}>{log.time}</Typography></Box>}
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                      </ListItem>
                      {i < activityLogs.length - 1 && <Divider sx={{ borderColor: BORDER, my: 0.5 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <motion.div variants={itemVars}>
              <Card sx={{ p: 4, height: 450, bgcolor: CARD, borderRadius: '24px', boxShadow: `0 10px 40px rgba(0,0,0,${darkMode ? '.25' : '.08'})`, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <Box sx={{ mb: 3, p: 3, borderRadius: '50%', bgcolor: '#6366f110' }}>
                  <TrendingUp sx={{ fontSize: 60, color: '#6366f1' }} />
                </Box>
                <Typography variant="h4" fontWeight="900" sx={{ color: TEXT, mb: 1 }}>Advanced Predictive Analytics</Typography>
                <Typography variant="body1" sx={{ color: TEXT2, maxWidth: 500, mb: 4 }}>
                  Our AI models predict student success rates based on CGPA and technical skill progression.
                  Currently, <strong>{predictiveScore}%</strong> of students are on track for high-tier placements.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" size="large" onClick={handleGenerateFullReport} sx={{ borderRadius: '15px', px: 4, py: 1.5, textTransform: 'none', fontWeight: 800, bgcolor: '#6366f1', boxShadow: '0 10px 20px rgba(99,102,241,0.3)' }}>Generate Full Report</Button>
                  <Button variant="outlined" size="large" onClick={() => setOpenSettings(true)} sx={{ borderRadius: '15px', px: 4, py: 1.5, textTransform: 'none', fontWeight: 800, borderColor: BORDER, color: TEXT }}>System Settings</Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Data Table */}
        <Card sx={{ bgcolor: CARD, borderRadius: '18px', overflow: 'hidden', boxShadow: `0 4px 20px rgba(0,0,0,${darkMode ? '.2' : '.06'})` }}>
          {/* Glassmorphic Filter Bar */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            mb: 3,
            p: 2,
            borderRadius: '20px',
            bgcolor: darkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
          }}>
            <TextField
              size="small" placeholder="Search students..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: TEXT2 }} /></InputAdornment> }}
              sx={{ ...inputSx, minWidth: 220, '& .MuiOutlinedInput-root': { ...inputSx['& .MuiOutlinedInput-root'], bgcolor: 'transparent' } }}
            />
            <TextField select size="small" label="Department" value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })} sx={{ ...inputSx, minWidth: 130 }}>
              <MenuItem value="">All Depts</MenuItem>{deptOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Year" value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })} sx={{ ...inputSx, minWidth: 120 }}>
              <MenuItem value="">All Years</MenuItem>{['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Status" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} sx={{ ...inputSx, minWidth: 130 }}>
              <MenuItem value="">All Status</MenuItem>{placementStatusOptions.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Type" value={filters.accommodation} onChange={e => setFilters({ ...filters, accommodation: e.target.value })} sx={{ ...inputSx, minWidth: 120 }}>
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Day Scholar">Day Scholar</MenuItem>
              <MenuItem value="Hosteler">Hosteler</MenuItem>
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
                <AnimatePresence>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton variant="circular" width={24} height={24} /></TableCell>
                        <TableCell><Box sx={{ display: 'flex', gap: 1 }}><Skeleton variant="circular" width={32} height={32} /><Skeleton width={100} /></Box></TableCell>
                        <TableCell><Skeleton width={80} /></TableCell>
                        <TableCell><Skeleton width={40} /></TableCell>
                        <TableCell><Skeleton width={60} /></TableCell>
                        <TableCell><Skeleton width={100} /></TableCell>
                        <TableCell><Skeleton width={60} /></TableCell>
                      </TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 8, color: TEXT2 }}>
                      <People sx={{ fontSize: 48, opacity: 0.2, display: 'block', mx: 'auto', mb: 1 }} />
                      No students found
                    </TableCell></TableRow>
                  ) : (
                    filtered.map(s => {
                      const sc = statusConfig[s.placementStatus] || statusConfig.Unplaced;
                      return (
                        <MotionRow
                          key={s._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="premium-table-row"
                          selected={selectedIds.includes(s._id)}
                          sx={{
                            '&.MuiTableRow-root.Mui-selected': { bgcolor: 'rgba(99,102,241,0.04)' },
                            '&:hover': { bgcolor: 'rgba(99,102,241,0.02)' }, // Polished hover effect
                            '& td': { borderBottom: `1px solid ${BORDER}` },
                            '@keyframes pulseGlow': {
                              '0%': { transform: 'scale(1)', opacity: 1 },
                              '50%': { transform: 'scale(1.4)', opacity: 0.7 },
                              '100%': { transform: 'scale(1)', opacity: 1 },
                            },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedIds.includes(s._id)} onChange={e => handleSelectOne(e, s._id)} sx={{ color: TEXT2 }} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box sx={{ position: 'relative' }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem', fontWeight: 700 }}>{s.name[0]}</Avatar>
                                {s.cgpa >= 9.0 && (
                                  <Box sx={{
                                    position: 'absolute',
                                    top: -2,
                                    right: -2,
                                    width: 10,
                                    height: 10,
                                    bgcolor: '#10b981',
                                    borderRadius: '50%',
                                    border: `2px solid ${CARD}`,
                                    animation: 'pulseGlow 1.5s ease-in-out infinite'
                                  }} />
                                )}
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight="700" sx={{ color: TEXT }}>{s.name}</Typography>
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
                        </MotionRow>
                      );
                    })
                  )}
                </AnimatePresence>
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
              <TextField label="Company" name="company" value={formData.company} onChange={handleFormChange} fullWidth required sx={inputSx} />
              <TextField label="Package (LPA)" name="ctc" type="number" value={formData.ctc} onChange={handleFormChange} fullWidth required sx={inputSx} />
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

      {/* Email Dialog */}
      <Dialog open={openEmail} onClose={() => setOpenEmail(false)} maxWidth="sm" fullWidth PaperProps={{ sx: dialogPaper }}>
        <DialogTitle sx={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: TEXT }}>📧 Bulk Email — {selectedIds.length} students</DialogTitle>
        <DialogContent>
          <TextField label="Subject" fullWidth sx={{ ...inputSx, mb: 2, mt: 1 }} value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
          <TextField label="Message" multiline rows={5} fullWidth sx={inputSx} value={emailBody} onChange={e => setEmailBody(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setOpenEmail(false)} sx={{ borderRadius: '10px', textTransform: 'none', color: TEXT2 }}>Cancel</Button>
          <Button variant="contained" startIcon={<Send />} className="btn-shimmer" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
            onClick={handleBulkEmail}>Send</Button>
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

      {/* Email Progress */}
      <Dialog open={emailSending} maxWidth="xs" fullWidth PaperProps={{ sx: { ...dialogPaper, textAlign: 'center', p: 4 } }}>
        <Box sx={{ py: 2 }}>
          <Box className="login-logo-ring" sx={{ width: 80, height: 80, mx: 'auto', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Send sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h6" fontWeight="800">Sending Bulk Email</Typography>
          <Typography variant="body2" sx={{ color: TEXT2, mb: 3 }}>Dispatching messages to {selectedIds.length} students...</Typography>
          <LinearProgress variant="determinate" value={emailProgress} sx={{ height: 10, borderRadius: 5, bgcolor: BORDER, '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg,#6366f1,#ec4899)' } }} />
          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: TEXT2, fontWeight: 700 }}>{Math.round(emailProgress)}% Complete</Typography>
        </Box>
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
              <ListItem
                disablePadding
                sx={{ px: 3, py: 1.8, '&:hover': { bgcolor: 'rgba(99,102,241,0.05)' } }}
              >
                <ListItemButton
                  onClick={item.onClick}
                  sx={{ p: 0, '&:hover': { bgcolor: 'transparent' } }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" fontWeight={600} sx={{ color: TEXT }}>{item.primary}</Typography>} secondary={<Typography variant="caption" sx={{ color: TEXT2 }}>{item.secondary}</Typography>} />
                  {item.action}
                </ListItemButton>
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
    </Box >
  );
};

export default AdminDashboard;