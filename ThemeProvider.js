import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create context for theme
const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check if user has a preference stored
  const storedMode = localStorage.getItem('themeMode') || 'light';
  const [mode, setMode] = useState(storedMode);

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Toggle theme function
  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // Define theme settings
  const lightTheme = {
    palette: {
      mode: 'light',
      primary: {
        main: '#f7971e',
        dark: '#e67e00',
        light: '#ffa940',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#3f51b5',
        dark: '#303f9f', 
        light: '#7986cb',
        contrastText: '#ffffff',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
        gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
      },
      success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
      error: {
        main: '#f44336',
        light: '#e57373',
        dark: '#d32f2f',
      },
      warning: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      info: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
      priorityColors: {
        high: '#ff5252',
        medium: '#fb8c00',
        low: '#4caf50',
      },
      action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(0, 0, 0, 0.04)',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 30,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 20px',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #ffd200 0%, #f7971e 100%)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: 'hidden',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 48,
          },
        },
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
    shadows: [
      'none',
      '0px 2px 1px -1px rgba(0,0,0,0.06),0px 1px 1px 0px rgba(0,0,0,0.04),0px 1px 3px 0px rgba(0,0,0,0.03)',
      '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.03)',
      '0px 3px 5px -1px rgba(0,0,0,0.06),0px 5px 8px 0px rgba(0,0,0,0.04),0px 1px 14px 0px rgba(0,0,0,0.03)',
      // ... rest of shadows
    ],
  };

  const darkTheme = {
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffb74d',
        dark: '#f57c00',
        light: '#ffd180',
        contrastText: '#000000',
      },
      secondary: {
        main: '#7986cb',
        dark: '#3f51b5', 
        light: '#c5cae9',
        contrastText: '#000000',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
        gradient: 'linear-gradient(135deg, #2c3e50 0%, #4a5568 100%)',
      },
      success: {
        main: '#81c784',
        light: '#a5d6a7',
        dark: '#4caf50',
      },
      error: {
        main: '#e57373',
        light: '#ef9a9a',
        dark: '#f44336',
      },
      warning: {
        main: '#ffb74d',
        light: '#ffd54f',
        dark: '#ff9800',
      },
      info: {
        main: '#64b5f6',
        light: '#90caf9',
        dark: '#2196f3',
      },
      priorityColors: {
        high: '#f44336',
        medium: '#ff9800',
        low: '#66bb6a',
      },
      action: {
        active: 'rgba(255, 255, 255, 0.7)',
        hover: 'rgba(255, 255, 255, 0.08)',
      },
      divider: 'rgba(255, 255, 255, 0.12)',
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 30,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 20px',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(90deg, #f57c00 0%, #ffb74d 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #ffb74d 0%, #f57c00 100%)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s',
            backgroundColor: '#1e1e1e',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: 'hidden',
            transition: 'all 0.3s',
            backgroundColor: '#2d2d2d',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 48,
          },
        },
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  };

  // Create the theme
  const theme = createTheme(mode === 'light' ? lightTheme : darkTheme);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 