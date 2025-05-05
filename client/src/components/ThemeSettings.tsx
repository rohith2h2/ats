import React from 'react';
import { 
  Box, 
  IconButton, 
  Popover, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Switch,
  Divider,
  Typography
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import TranslateIcon from '@mui/icons-material/Translate';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { toggleDarkMode, toggleFocusMode } from '../redux/slices/uiSlice';
import { RootState } from '../redux/store';

const ThemeSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { darkMode, focusMode } = useAppSelector((state: RootState) => state.ui);
  
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };
  
  const handleFocusModeToggle = () => {
    dispatch(toggleFocusMode());
  };
  
  const open = Boolean(anchorEl);
  const id = open ? 'theme-settings-popover' : undefined;
  
  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open theme settings"
        aria-describedby={id}
        onClick={handleClick}
        sx={{ ml: 1 }}
      >
        <SettingsIcon />
      </IconButton>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 300, p: 1 }}>
          <Typography variant="subtitle1" sx={{ p: 2, pb: 1 }}>
            Display Settings
          </Typography>
          
          <List disablePadding>
            <ListItem>
              <ListItemIcon>
                <DarkModeIcon />
              </ListItemIcon>
              <ListItemText primary="Dark Mode" />
              <Switch
                edge="end"
                checked={darkMode}
                onChange={handleDarkModeToggle}
                inputProps={{
                  'aria-labelledby': 'dark-mode-switch',
                }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CenterFocusStrongIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Focus Mode" 
                secondary="Hide non-essential UI elements"
              />
              <Switch
                edge="end"
                checked={focusMode}
                onChange={handleFocusModeToggle}
                inputProps={{
                  'aria-labelledby': 'focus-mode-switch',
                }}
              />
            </ListItem>
            
            <Divider />
            
            {/* Future settings (currently disabled) */}
            <ListItem disabled>
              <ListItemIcon>
                <TextFormatIcon />
              </ListItemIcon>
              <ListItemText primary="Font Size" secondary="Default" />
            </ListItem>
            
            <ListItem disabled>
              <ListItemIcon>
                <AccessibilityNewIcon />
              </ListItemIcon>
              <ListItemText primary="Accessibility" secondary="Default" />
            </ListItem>
            
            <ListItem disabled>
              <ListItemIcon>
                <TranslateIcon />
              </ListItemIcon>
              <ListItemText primary="Language" secondary="English (US)" />
            </ListItem>
          </List>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', p: 2, pt: 1 }}>
            More settings coming soon
          </Typography>
        </Box>
      </Popover>
    </>
  );
};

export default ThemeSettings; 