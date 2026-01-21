import { createTheme } from '@mui/material/styles';

// Transform this into a function that accepts the mode ('light' or 'dark')
const getTheme = (mode) => createTheme({
  palette: {
    mode, // This tells MUI to switch base logic (text colors, etc)
    primary: {
      main: '#5e35b1',
      light: '#9162e4',
      dark: '#280680',
    },
    secondary: {
      main: '#00b0ff',
    },
    background: {
      default: mode === 'dark' ? '#0f172a' : '#f4f6f9',
      paper: mode === 'dark' ? '#1e293b' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f8fafc' : '#1e293b',
      secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600, borderRadius: '8px' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }, // Fixes weird gray overlay in dark mode
      },
    },
    // Fix Input Borders in Dark Mode
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': { borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' },
          '&:hover fieldset': { borderColor: '#5e35b1' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: mode === 'dark' ? '#1e293b' : '#f8fafc',
          color: mode === 'dark' ? '#cbd5e1' : '#475569',
        },
        body: {
          color: mode === 'dark' ? '#e2e8f0' : '#1e293b',
        }
      },
    },
  },
});

export default getTheme;