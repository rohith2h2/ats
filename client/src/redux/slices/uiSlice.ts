import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface
interface UiState {
  activeTab: number;
  showScoreDetails: boolean;
  showChangeDetails: boolean;
  selectedChangeId: string | null;
  darkMode: boolean;
  focusMode: boolean;
}

// Define the initial state
const initialState: UiState = {
  activeTab: 0,
  showScoreDetails: false,
  showChangeDetails: false,
  selectedChangeId: null,
  darkMode: false,
  focusMode: false,
};

// Create the slice
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Set the active tab
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
    
    // Toggle score details visibility
    toggleScoreDetails: (state) => {
      state.showScoreDetails = !state.showScoreDetails;
    },
    
    // Toggle change details visibility
    toggleChangeDetails: (state) => {
      state.showChangeDetails = !state.showChangeDetails;
    },
    
    // Select a change for detail view
    selectChange: (state, action: PayloadAction<string | null>) => {
      state.selectedChangeId = action.payload;
    },
    
    // Toggle dark mode
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    
    // Toggle focus mode
    toggleFocusMode: (state) => {
      state.focusMode = !state.focusMode;
    },
    
    // Set focus mode directly
    setFocusMode: (state, action: PayloadAction<boolean>) => {
      state.focusMode = action.payload;
    },
    
    // Reset UI state
    resetUi: (state) => {
      return initialState;
    },
  },
});

// Export actions and reducer
export const {
  setActiveTab,
  toggleScoreDetails,
  toggleChangeDetails,
  selectChange,
  toggleDarkMode,
  toggleFocusMode,
  setFocusMode,
  resetUi,
} = uiSlice.actions;

export default uiSlice.reducer; 