import { createTheme } from '@mui/material/styles';

// Transform this into a function that accepts the mode ('light' or 'dark')
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#6366f1', // Indigo 500
      light: '#818cf8', // Indigo 400
      dark: '#4f46e5', // Indigo 600
    },
    secondary: {
      main: '#ec4899', // Pink 500
    },
    background: {
      default: mode === 'dark' ? '#0b0f1a' : '#f8fafc',
      paper: mode === 'dark' ? '#111827' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f3f4f6' : '#1e293b',
      secondary: mode === 'dark' ? '#9ca3af' : '#64748b',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "system-ui", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600, borderRadius: '12px' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: mode === 'dark' ? '#0b0f1a' : '#f8fafc',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: mode === 'dark' ? '#1f2937' : '#e2e8f0',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: mode === 'dark' ? '#374151' : '#cbd5e1',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { 
          backgroundImage: 'none',
          borderRadius: '16px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '& fieldset': { borderColor: mode === 'dark' ? '#1f2937' : '#e2e8f0' },
          '&:hover fieldset': { borderColor: '#6366f1' },
          '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '2px' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: mode === 'dark' ? '#1f2937' : '#f8fafc',
          color: mode === 'dark' ? '#9ca3af' : '#475569',
          fontWeight: 600,
          borderBottom: mode === 'dark' ? '1px solid #374151' : '1px solid #e2e8f0',
        },
        body: {
          color: mode === 'dark' ? '#d1d5db' : '#1e293b',
          borderColor: mode === 'dark' ? '#1f2937' : '#f1f5f9',
        }
      },
    },
  },
});

export default getTheme;