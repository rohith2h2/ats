import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultsSection from './components/ResultsSection';
import Footer from './components/Footer';
import { useAppSelector } from './hooks/reduxHooks';

// Styled components
const MainContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

function App() {
  // Get application state from Redux
  const { analysisCompleted } = useAppSelector((state) => state.processing);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <MainContainer maxWidth="lg" component="main">
        {/* App introduction */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            ATS Resume Optimizer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload your resume and job description to analyze your ATS compatibility score,
            identify missing keywords, and optimize your resume for better results.
          </Typography>
        </Box>
        
        {/* Input form for resume upload and job description */}
        <ContentPaper elevation={1}>
          <InputForm />
        </ContentPaper>
        
        {/* Results section (only shown after analysis) */}
        {analysisCompleted && (
          <ContentPaper elevation={1}>
            <ResultsSection />
          </ContentPaper>
        )}
      </MainContainer>
      
      <Footer />
    </Box>
  );
}

export default App; 