import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { store } from './redux/store';
import './styles/index.css';

// Store reference to render function for theme updates
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Track current dark mode state
let currentDarkMode = store.getState().ui.darkMode;

// Function to render app with current theme
const renderApp = () => {
  // Get current dark mode state from Redux
  const darkMode = store.getState().ui.darkMode;
  
  // Create theme with light/dark mode support
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#19a2b8',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
  });

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
  );
};

// Initial render
renderApp();

// Subscribe to store changes to update theme when dark mode changes
store.subscribe(() => {
  const newDarkMode = store.getState().ui.darkMode;
  
  // Only re-render if dark mode has changed
  if (currentDarkMode !== newDarkMode) {
    currentDarkMode = newDarkMode;
    renderApp();
  }
}); 