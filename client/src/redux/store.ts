import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import inputReducer from './slices/inputSlice';
import processingReducer from './slices/processingSlice';
import resultsReducer from './slices/resultsSlice';
import uiReducer from './slices/uiSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    input: inputReducer,
    processing: processingReducer,
    results: resultsReducer,
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Set up listeners for RTK Query
setupListeners(store.dispatch);

// Types for Redux state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 