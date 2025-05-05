import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface
interface ProcessingState {
  isAnalyzing: boolean;
  isOptimizing: boolean;
  isDownloading: boolean;
  analysisCompleted: boolean;
  optimizationCompleted: boolean;
  currentStep: 'idle' | 'analyzing' | 'optimizing' | 'completed';
  requestId: string;
  error: string | null;
}

// Define the initial state
const initialState: ProcessingState = {
  isAnalyzing: false,
  isOptimizing: false,
  isDownloading: false,
  analysisCompleted: false,
  optimizationCompleted: false,
  currentStep: 'idle',
  requestId: '',
  error: null,
};

// Create the slice
export const processingSlice = createSlice({
  name: 'processing',
  initialState,
  reducers: {
    // Start the analysis process
    startAnalysis: (state) => {
      state.isAnalyzing = true;
      state.currentStep = 'analyzing';
      state.error = null;
    },
    
    // Complete the analysis process
    completeAnalysis: (state, action: PayloadAction<string>) => {
      state.isAnalyzing = false;
      state.analysisCompleted = true;
      state.requestId = action.payload;
      state.currentStep = 'completed';
    },
    
    // Start the optimization process
    startOptimization: (state) => {
      state.isOptimizing = true;
      state.currentStep = 'optimizing';
      state.error = null;
    },
    
    // Complete the optimization process
    completeOptimization: (state) => {
      state.isOptimizing = false;
      state.optimizationCompleted = true;
      state.currentStep = 'completed';
    },
    
    // Start the download process
    startDownload: (state) => {
      state.isDownloading = true;
    },
    
    // Complete the download process
    completeDownload: (state) => {
      state.isDownloading = false;
    },
    
    // Set an error
    setError: (state, action: PayloadAction<string>) => {
      state.isAnalyzing = false;
      state.isOptimizing = false;
      state.isDownloading = false;
      state.error = action.payload;
    },
    
    // Reset all processing state
    resetProcessing: (state) => {
      return initialState;
    },
  },
});

// Export actions and reducer
export const {
  startAnalysis,
  completeAnalysis,
  startOptimization,
  completeOptimization,
  startDownload,
  completeDownload,
  setError,
  resetProcessing,
} = processingSlice.actions;

export default processingSlice.reducer; 