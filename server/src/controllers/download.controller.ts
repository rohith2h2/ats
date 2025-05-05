import { Request, Response } from 'express';
import logger from '../utils/logger';
import { getSessionData } from '../services/session.service';
import { generateOptimizedResume } from '../services/document.service';

export const downloadController = async (req: Request, res: Response) => {
  try {
    const { requestId, acceptedChanges, filename } = req.body;

    logger.info(`Processing download request for requestId: ${requestId}`);

    // Retrieve the session data
    const sessionData = await getSessionData(requestId);

    if (!sessionData) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found',
        errors: [{ code: 'SESSION_NOT_FOUND', message: 'The session could not be found or has expired' }],
      });
    }

    const { resumeText, optimizationResult } = sessionData;

    if (!optimizationResult) {
      return res.status(400).json({
        status: 'error',
        message: 'Optimization not found',
        errors: [{ code: 'OPTIMIZATION_NOT_FOUND', message: 'Resume must be optimized before downloading' }],
      });
    }

    // Apply accepted changes to generate the final resume
    const pdfBuffer = await generateOptimizedResume(resumeText, optimizationResult, acceptedChanges);

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    
    // Send the PDF file
    return res.send(pdfBuffer);
  } catch (error: any) {
    logger.error(`Error generating resume download: ${error.message}`);

    // Determine the appropriate error response
    if (error.code === 'SESSION_EXPIRED') {
      return res.status(410).json({
        status: 'error',
        message: 'Session expired',
        errors: [{ code: 'SESSION_EXPIRED', message: 'Your session has expired. Please upload your resume again.' }],
      });
    }
    
    if (error.code === 'GENERATION_ERROR') {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to generate resume',
        errors: [{ code: 'GENERATION_ERROR', message: error.message }],
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