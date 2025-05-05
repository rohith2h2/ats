import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for results
export interface AnalysisResult {
  atsScore: number;
  needsOptimization: boolean;
  keywords: {
    matched: string[];
    missing: string[];
  };
  analysisDetails: string;
}

export interface Change {
  id: string;
  section: string;
  original: string;
  suggested: string;
  reason: string;
  accepted: boolean;
}

export interface OptimizationResult {
  originalScore: number;
  optimizedScore: number;
  changes: Change[];
  generalSuggestions: string[];
  suggestedFilename: string;
}

// Define the state interface
interface ResultsState {
  analysisResult: AnalysisResult | null;
  optimizationResult: OptimizationResult | null;
  acceptedChanges: string[];
  filename: string;
}

// Define the initial state
const initialState: ResultsState = {
  analysisResult: null,
  optimizationResult: null,
  acceptedChanges: [],
  filename: '',
};

// Create the slice
export const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    // Set the analysis result
    setAnalysisResult: (state, action: PayloadAction<AnalysisResult>) => {
      state.analysisResult = action.payload;
    },
    
    // Set the optimization result
    setOptimizationResult: (state, action: PayloadAction<OptimizationResult>) => {
      state.optimizationResult = action.payload;
      
      // By default, accept all changes
      state.acceptedChanges = action.payload.changes.map((change) => change.id);
      
      // Set the suggested filename
      state.filename = action.payload.suggestedFilename;
    },
    
    // Toggle a change's acceptance
    toggleChangeAcceptance: (state, action: PayloadAction<string>) => {
      const changeId = action.payload;
      
      if (state.acceptedChanges.includes(changeId)) {
        state.acceptedChanges = state.acceptedChanges.filter((id) => id !== changeId);
      } else {
        state.acceptedChanges.push(changeId);
      }
    },
    
    // Update the filename
    setFilename: (state, action: PayloadAction<string>) => {
      state.filename = action.payload;
    },
    
    // Reset all results
    resetResults: (state) => {
      return initialState;
    },
  },
});

// Export actions and reducer
export const {
  setAnalysisResult,
  setOptimizationResult,
  toggleChangeAcceptance,
  setFilename,
  resetResults,
} = resultsSlice.actions;

export default resultsSlice.reducer; 