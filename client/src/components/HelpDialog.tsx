import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="help-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="help-dialog-title">
        <Typography variant="h5">How to Use ATS Resume Optimizer</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <DialogContentText component="div">
          <Typography variant="body1" paragraph>
            The ATS Resume Optimizer helps you improve your resume's compatibility with Applicant Tracking Systems (ATS) and increase your chances of getting past automated filters.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Quick Start Guide
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <UploadFileIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 1: Upload Your Resume" 
                secondary="Drag and drop your resume file or click to select. We support PDF, DOCX, and TXT formats up to 10MB."
              />
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem>
              <ListItemIcon>
                <DescriptionIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 2: Add the Job Description" 
                secondary="Paste the complete job description into the text area. This helps identify relevant keywords and skills."
              />
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem>
              <ListItemIcon>
                <AnalyticsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 3: Review Your Analysis" 
                secondary="Our AI analyzes your resume against the job description and provides an ATS compatibility score with detailed feedback."
              />
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem>
              <ListItemIcon>
                <EmojiObjectsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 4: Get Optimization Suggestions" 
                secondary="View AI-generated suggestions to improve your resume, including missing keywords and content improvements."
              />
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem>
              <ListItemIcon>
                <FileDownloadIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 5: Download Optimized Resume" 
                secondary="Download your optimized resume or the suggestions to manually update your resume."
              />
            </ListItem>
          </List>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Important Tips
            </Typography>
            
            <Typography component="div" variant="body2">
              <ul>
                <li>Use the complete job description for the best results</li>
                <li>Make sure your resume is in a readable format (not scanned images)</li>
                <li>Review each suggestion carefully before incorporating it</li>
                <li>Always tailor your resume for each specific job application</li>
                <li>Be truthful about your qualifications and experience</li>
              </ul>
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3, bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              About ATS Systems
            </Typography>
            
            <Typography variant="body2" paragraph>
              Applicant Tracking Systems (ATS) are software used by employers to manage job applications. These systems scan resumes for keywords and formatting to determine which candidates to forward to hiring managers.
            </Typography>
            
            <Typography variant="body2">
              Our tool helps you optimize your resume for these systems while maintaining a professional and readable format for human reviewers.
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpDialog; 