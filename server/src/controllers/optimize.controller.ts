import { Request, Response } from 'express';
import logger from '../utils/logger';
import { getAnalysisResult, optimizeResume, generateFilename } from '../services/ai.service';
import { getSessionData, saveSessionData } from '../services/session.service';

export const optimizeController = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;

    logger.info(`Processing optimize request for requestId: ${requestId}`);

    // Retrieve the analysis result from the session data
    const sessionData = await getSessionData(requestId);
    
    if (!sessionData) {
      return res.status(404).json({
        status: 'error',
        message: 'Analysis not found',
        errors: [{ code: 'ANALYSIS_NOT_FOUND', message: 'The analysis result could not be found or has expired' }],
      });
    }

    const { resumeText, jobDescription, analysisResult } = sessionData;

    // Check if optimization is needed
    if (analysisResult.atsScore >= 92) {
      return res.status(200).json({
        status: 'success',
        data: {
          originalScore: analysisResult.atsScore,
          optimizedScore: analysisResult.atsScore,
          changes: [],
          message: 'Your resume is already well-optimized for this job.',
          suggestedFilename: await generateFilename(resumeText, jobDescription),
        },
      });
    }

    // Generate optimization suggestions
    const optimizationResult = await optimizeResume(resumeText, jobDescription, analysisResult);

    // Save the optimization result in the session data
    await saveSessionData(requestId, {
      ...sessionData,
      optimizationResult,
    });

    // Return the optimization result
    return res.status(200).json({
      status: 'success',
      data: optimizationResult,
    });
  } catch (error: any) {
    logger.error(`Error optimizing resume: ${error.message}`);
    
    // Determine the appropriate error response
    if (error.code === 'SESSION_EXPIRED') {
      return res.status(410).json({
        status: 'error',
        message: 'Session expired',
        errors: [{ code: 'SESSION_EXPIRED', message: 'Your session has expired. Please upload your resume again.' }],
      });
    }
    
    if (error.code === 'AI_UNAVAILABLE') {
      return res.status(503).json({
        status: 'error',
        message: 'Optimization service temporarily unavailable',
        errors: [{ code: 'AI_UNAVAILABLE', message: error.message }],
      });
    }
    
    // Default to 500 for unknown errors
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
      errors: [{ code: 'SERVER_ERROR', message: 'An unexpected error occurred while processing your request' }],
    });
  }
}; 