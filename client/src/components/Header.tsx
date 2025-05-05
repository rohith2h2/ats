import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7, HelpOutline } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { toggleDarkMode } from '../redux/slices/uiSlice';
import ThemeSettings from './ThemeSettings';
import HelpDialog from './HelpDialog';
import { RootState } from '../redux/store';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state: RootState) => state.ui);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const handleThemeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleHelpOpen = () => {
    setHelpDialogOpen(true);
  };

  const handleHelpClose = () => {
    setHelpDialogOpen(false);
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ATS Resume Optimizer
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleHelpOpen} aria-label="help">
              <HelpOutline />
            </IconButton>
            <IconButton color="inherit" onClick={handleThemeToggle} aria-label="toggle theme">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <ThemeSettings />
          </Box>
        </Toolbar>
      </AppBar>
      
      <HelpDialog open={helpDialogOpen} onClose={handleHelpClose} />
    </>
  );
};

export default Header; 