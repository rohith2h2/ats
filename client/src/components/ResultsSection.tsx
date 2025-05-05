import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  Button,
  Grid,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Alert,
  TextField,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setFilename, toggleChangeAcceptance } from '../redux/slices/resultsSlice';
import { setActiveTab } from '../redux/slices/uiSlice';
import { 
  startOptimization, 
  completeOptimization, 
  startDownload, 
  completeDownload, 
  setError 
} from '../redux/slices/processingSlice';
import { useOptimizeResumeMutation, useDownloadResumeMutation } from '../redux/api/apiSlice';

// Interface for tab panel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`results-tabpanel-${index}`}
      aria-labelledby={`results-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ResultsSection: React.FC = () => {
  // Redux state and dispatch
  const dispatch = useAppDispatch();
  const { analysisResult, optimizationResult, acceptedChanges, filename } = 
    useAppSelector((state) => state.results);
  const { requestId, isOptimizing, isDownloading } = 
    useAppSelector((state) => state.processing);
  const { activeTab } = useAppSelector((state) => state.ui);

  // RTK Query mutations
  const [optimizeResume] = useOptimizeResumeMutation();
  const [downloadResume] = useDownloadResumeMutation();

  // Local state for filename input
  const [filenameError, setFilenameError] = useState<string | null>(null);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setActiveTab(newValue));
  };

  // Handle optimize button click
  const handleOptimize = async () => {
    if (!requestId || !analysisResult) return;

    try {
      dispatch(startOptimization());
      
      const result = await optimizeResume({ requestId }).unwrap();
      
      dispatch(completeOptimization());
      
      // Switch to the optimization tab
      dispatch(setActiveTab(1));
    } catch (error: any) {
      console.error('Error optimizing resume:', error);
      dispatch(setError(error.message || 'Failed to optimize resume'));
    }
  };

  // Handle download button click
  const handleDownload = async () => {
    if (!requestId || !optimizationResult) return;

    // Validate filename
    if (!filename.trim()) {
      setFilenameError('Filename is required');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(filename)) {
      setFilenameError('Filename can only contain letters, numbers, underscores, and hyphens');
      return;
    }

    try {
      dispatch(startDownload());
      
      const blob = await downloadResume({
        requestId,
        acceptedChanges,
        filename,
      }).unwrap();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      dispatch(completeDownload());
    } catch (error: any) {
      console.error('Error downloading resume:', error);
      dispatch(setError(error.message || 'Failed to download resume'));
    }
  };

  // Handle filename change
  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '_');
    dispatch(setFilename(value));
    setFilenameError(null);
  };

  // Handle change toggle
  const handleChangeToggle = (changeId: string) => {
    dispatch(toggleChangeAcceptance(changeId));
  };

  // Render score with color
  const renderScore = (score: number) => {
    let color = 'error.main';
    if (score >= 90) color = 'success.main';
    else if (score >= 70) color = 'warning.main';

    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress 
          variant="determinate" 
          value={score} 
          size={80} 
          thickness={5} 
          sx={{ color }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" component="div" color="text.secondary">
            {score}
          </Typography>
        </Box>
      </Box>
    );
  };

  if (!analysisResult) {
    return (
      <Alert severity="error">No analysis results available</Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Resume Analysis Results
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Analysis" />
          <Tab label="Optimization" disabled={!optimizationResult} />
        </Tabs>
        
        <Divider />
        
        {/* Analysis Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                ATS Compatibility Score
              </Typography>
              {renderScore(analysisResult.atsScore)}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {analysisResult.atsScore >= 90 
                  ? 'Excellent! Your resume is well-optimized for ATS.' 
                  : analysisResult.atsScore >= 70 
                    ? 'Good, but there\'s room for improvement.' 
                    : 'Your resume needs significant optimization.'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Keyword Analysis
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Matched Keywords
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {analysisResult.keywords.matched.length > 0 ? (
                    analysisResult.keywords.matched.map((keyword, index) => (
                      <Chip 
                        key={index} 
                        label={keyword} 
                        color="success" 
                        size="small" 
                        icon={<CheckCircleIcon />} 
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No keyword matches found
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Missing Keywords
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {analysisResult.keywords.missing.length > 0 ? (
                    analysisResult.keywords.missing.map((keyword, index) => (
                      <Chip 
                        key={index} 
                        label={keyword} 
                        color="error" 
                        size="small" 
                        icon={<ErrorIcon />} 
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No missing keywords - great job!
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Analysis Details
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Typography variant="body2" whiteSpace="pre-line">
                  {analysisResult.analysisDetails}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                onClick={handleOptimize}
                disabled={isOptimizing || !analysisResult.needsOptimization}
                startIcon={<EmojiObjectsIcon />}
              >
                {isOptimizing 
                  ? 'Optimizing...' 
                  : analysisResult.needsOptimization 
                    ? 'Get Optimization Suggestions' 
                    : 'Resume Already Optimized'}
              </Button>
              
              {isOptimizing && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress />
                </Box>
              )}
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Optimization Tab */}
        <TabPanel value={activeTab} index={1}>
          {optimizationResult ? (
            <Grid container spacing={4}>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Score Improvement
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center' }}>
                  {renderScore(optimizationResult.originalScore)}
                  <Typography variant="h4">→</Typography>
                  {renderScore(optimizationResult.optimizedScore)}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Potential improvement: +{(optimizationResult.optimizedScore - optimizationResult.originalScore).toFixed(1)} points
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Suggested Filename
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter filename (letters, numbers, underscores, hyphens only)"
                  value={filename}
                  onChange={handleFilenameChange}
                  error={!!filenameError}
                  helperText={filenameError}
                  InputProps={{
                    endAdornment: <Typography variant="body2">.pdf</Typography>,
                  }}
                  sx={{ mb: 3 }}
                />
                
                <Typography variant="h6" gutterBottom>
                  General Suggestions
                </Typography>
                <List dense>
                  {optimizationResult.generalSuggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <EmojiObjectsIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Suggested Changes ({acceptedChanges.length}/{optimizationResult.changes.length} selected)
                </Typography>
                
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {optimizationResult.changes.map((change) => (
                    <React.Fragment key={change.id}>
                      <ListItem 
                        sx={{ 
                          bgcolor: acceptedChanges.includes(change.id) ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                          transition: '0.3s',
                        }}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={acceptedChanges.includes(change.id)}
                            onChange={() => handleChangeToggle(change.id)}
                            color="primary"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {change.section}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography 
                                variant="body2" 
                                component="div" 
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                Original:
                              </Typography>
                              <Paper 
                                variant="outlined" 
                                sx={{ 
                                  p: 1, 
                                  backgroundColor: 'background.default',
                                  textDecoration: acceptedChanges.includes(change.id) ? 'line-through' : 'none',
                                  color: acceptedChanges.includes(change.id) ? 'text.disabled' : 'text.primary',
                                }}
                              >
                                <Typography variant="body2">
                                  {change.original}
                                </Typography>
                              </Paper>
                              
                              <Typography 
                                variant="body2" 
                                component="div" 
                                color="text.secondary"
                                sx={{ mt: 2, mb: 1 }}
                              >
                                Suggested:
                              </Typography>
                              <Paper 
                                variant="outlined" 
                                sx={{ 
                                  p: 1, 
                                  backgroundColor: acceptedChanges.includes(change.id) ? 'rgba(76, 175, 80, 0.1)' : 'background.default',
                                  borderColor: acceptedChanges.includes(change.id) ? 'success.main' : 'divider',
                                }}
                              >
                                <Typography variant="body2">
                                  {change.suggested}
                                </Typography>
                              </Paper>
                              
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ mt: 2 }}
                              >
                                Reason: {change.reason}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  onClick={handleDownload}
                  disabled={isDownloading || acceptedChanges.length === 0 || !filename}
                  startIcon={<DownloadIcon />}
                >
                  {isDownloading ? 'Generating PDF...' : 'Download Optimized Resume'}
                </Button>
                
                {isDownloading && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress />
                  </Box>
                )}
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>
                Loading optimization results...
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ResultsSection; 