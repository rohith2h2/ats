import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AnalysisResult, OptimizationResult } from '../slices/resultsSlice';

// Base API configuration
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    // Analyze resume endpoint
    analyzeResume: builder.mutation<
      { status: string; data: AnalysisResult & { requestId: string } },
      FormData
    >({
      query: (formData) => ({
        url: '/analyze',
        method: 'POST',
        body: formData,
      }),
    }),

    // Optimize resume endpoint
    optimizeResume: builder.mutation<
      { status: string; data: OptimizationResult },
      { requestId: string }
    >({
      query: (data) => ({
        url: '/optimize',
        method: 'POST',
        body: data,
      }),
    }),

    // Download optimized resume endpoint
    downloadResume: builder.mutation<
      Blob,
      { requestId: string; acceptedChanges: string[]; filename: string }
    >({
      query: (data) => ({
        url: '/download',
        method: 'POST',
        body: data,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

// Export hooks for using the API
export const {
  useAnalyzeResumeMutation,
  useOptimizeResumeMutation,
  useDownloadResumeMutation,
} = apiSlice; 