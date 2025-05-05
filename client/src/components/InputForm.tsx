import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Paper, 
  LinearProgress,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setJobDescription, setResumeFile } from '../redux/slices/inputSlice';
import { 
  startAnalysis, 
  completeAnalysis, 
  setError 
} from '../redux/slices/processingSlice';
import { setAnalysisResult } from '../redux/slices/resultsSlice';
import { useAnalyzeResumeMutation } from '../redux/api/apiSlice';

// Styled components
const DropzoneContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  border: `2px dashed ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const FilePreview = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const InputForm: React.FC = () => {
  // Local state
  const [jobDescriptionError, setJobDescriptionError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Redux state and dispatch
  const dispatch = useAppDispatch();
  const { jobDescription, resumeFile, resumeFileName, isValidJobDescription, isValidResumeFile } = 
    useAppSelector((state) => state.input);
  const { isAnalyzing } = useAppSelector((state) => state.processing);

  // RTK Query mutation
  const [analyzeResume, { isLoading }] = useAnalyzeResumeMutation();

  // File upload handler using react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFileError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      setFileError('File is too large. Maximum size is 10MB.');
      return;
    }
    
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setFileError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    
    dispatch(setResumeFile(file));
  }, [dispatch]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    multiple: false,
  });

  // Job description change handler
  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setJobDescription(value));
    
    if (value.length < 10) {
      setJobDescriptionError('Job description must be at least 10 characters');
    } else {
      setJobDescriptionError(null);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidJobDescription || !isValidResumeFile) {
      if (!isValidJobDescription) {
        setJobDescriptionError('Please enter a valid job description');
      }
      if (!isValidResumeFile) {
        setFileError('Please upload a resume file');
      }
      return;
    }
    
    try {
      dispatch(startAnalysis());
      
      // Create form data for API call
      const formData = new FormData();
      formData.append('jobDescription', jobDescription);
      if (resumeFile) {
        formData.append('resumeFile', resumeFile);
      }
      
      // Call the API
      const result = await analyzeResume(formData).unwrap();
      
      // Update state with results
      dispatch(setAnalysisResult(result.data));
      dispatch(completeAnalysis(result.data.requestId));
      
    } catch (error: any) {
      console.error('Error analyzing resume:', error);
      dispatch(setError(error.message || 'Failed to analyze resume'));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={3}>
        {/* Job Description Input */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Job Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            error={!!jobDescriptionError}
            helperText={jobDescriptionError}
            disabled={isAnalyzing}
            variant="outlined"
          />
        </Grid>
        
        {/* Resume Upload Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Upload Resume
          </Typography>
          <DropzoneContainer 
            {...getRootProps()} 
            className={isDragActive ? 'dropzone active' : 'dropzone'}
            sx={{ 
              opacity: isAnalyzing ? 0.7 : 1,
              borderColor: isAnalyzing ? theme => theme.palette.primary.main : undefined,
              backgroundColor: isAnalyzing ? 'rgba(25, 118, 210, 0.05)' : undefined
            }}
          >
            <input {...getInputProps()} disabled={isAnalyzing} />
            {isAnalyzing ? (
              <>
                <CircularProgress size={48} color="primary" sx={{ mb: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Analyzing resume...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take a few moments
                </Typography>
              </>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" gutterBottom>
                  {isDragActive 
                    ? "Drop your resume file here..." 
                    : "Drag & drop your resume file here, or click to select"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: PDF, DOCX, TXT (Max: 10MB)
                </Typography>
              </>
            )}
          </DropzoneContainer>
          
          {fileError && (
            <Alert severity="error" sx={{ mt: 2 }}>{fileError}</Alert>
          )}
          
          {resumeFile && !isAnalyzing && (
            <FilePreview>
              <ArticleIcon color="primary" />
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {resumeFileName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(resumeFile.size / 1024).toFixed(1)} KB
              </Typography>
            </FilePreview>
          )}
        </Grid>
        
        {/* Submit Button */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isAnalyzing || !isValidJobDescription || !isValidResumeFile}
            sx={{ py: 1.5 }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
          
          {isAnalyzing && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress />
              <Typography align="center" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Our AI is reviewing your resume against the job description.
                This typically takes 15-30 seconds.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default InputForm; 