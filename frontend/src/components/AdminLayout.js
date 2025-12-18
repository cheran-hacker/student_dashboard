import React from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Typography, AppBar, Toolbar, Avatar, useTheme 
} from '@mui/material';
import { Dashboard, People, Settings, Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme(); // Access the current theme (Dark or Light)

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Students', icon: <People />, path: '/admin/dashboard' }, 
    { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: `calc(100% - ${drawerWidth}px)`, 
          ml: `${drawerWidth}px`, 
          bgcolor: 'background.paper', // Dynamic: White in Light Mode, Dark Grey in Dark Mode
          color: 'text.primary', 
          boxShadow: 'none', 
          borderBottom: `1px solid ${theme.palette.divider}` 
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Admin Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" fontWeight="bold">Administrator</Typography>
            <Avatar sx={{ bgcolor: 'primary.main', width: 35, height: 35 }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            // LOGIC: In Dark Mode, use Paper color. In Light Mode, use the classic Dark Sidebar.
            bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#1e293b', 
            color: theme.palette.mode === 'dark' ? 'text.primary' : 'white',
            borderRight: `1px solid ${theme.palette.divider}`
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" sx={{ 
            color: theme.palette.mode === 'dark' ? 'text.primary' : 'white', 
            fontWeight: 'bold', 
            letterSpacing: 1 
          }}>
            EDU<span style={{ color: '#3b82f6' }}>CRM</span>
          </Typography>
        </Toolbar>
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': { 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', 
                    borderLeft: '4px solid #3b82f6' 
                  },
                  '&:hover': { 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.05)' 
                  },
                  mb: 1
                }}
              >
                <ListItemIcon sx={{ 
                  color: theme.palette.mode === 'dark' ? 'text.secondary' : 'white', 
                  minWidth: 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          
          <ListItem disablePadding sx={{ mt: 'auto' }}>
            <ListItemButton onClick={handleLogout} sx={{ color: '#ef4444' }}>
              <ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}><Logout /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        bgcolor: 'background.default', // This switches from Light Grey to Dark Blue automatically
        p: 3, 
        minHeight: '100vh',
        color: 'text.primary'
      }}>
        <Toolbar /> 
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;