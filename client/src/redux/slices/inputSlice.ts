import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface
interface InputState {
  jobDescription: string;
  resumeFile: File | null;
  resumeFileName: string;
  isValidJobDescription: boolean;
  isValidResumeFile: boolean;
}

// Define the initial state
const initialState: InputState = {
  jobDescription: '',
  resumeFile: null,
  resumeFileName: '',
  isValidJobDescription: false,
  isValidResumeFile: false,
};

// Create the slice
export const inputSlice = createSlice({
  name: 'input',
  initialState,
  reducers: {
    // Update the job description
    setJobDescription: (state, action: PayloadAction<string>) => {
      state.jobDescription = action.payload;
      state.isValidJobDescription = action.payload.length >= 10;
    },
    
    // Update the resume file
    setResumeFile: (state, action: PayloadAction<File | null>) => {
      state.resumeFile = action.payload;
      state.resumeFileName = action.payload ? action.payload.name : '';
      state.isValidResumeFile = !!action.payload;
    },
    
    // Reset all inputs
    resetInputs: (state) => {
      return initialState;
    },
  },
});

// Export actions and reducer
export const { setJobDescription, setResumeFile, resetInputs } = inputSlice.actions;
export default inputSlice.reducer; 