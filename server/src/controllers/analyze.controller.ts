import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';
import { extractTextFromResume } from '../services/document.service';
import { analyzeResume } from '../services/ai.service';

export const analyzeController = async (req: Request, res: Response) => {
  try {
    const { jobDescription } = req.body;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({
        status: 'error',
        message: 'Resume file is required',
        errors: [{ code: 'FILE_REQUIRED', field: 'resumeFile', message: 'Resume file is required' }],
      });
    }

    logger.info(`Processing analyze request for file: ${resumeFile.originalname}`);

    // Generate a unique request ID
    const requestId = uuidv4();

    // Extract text from the resume file
    const resumeText = await extractTextFromResume(resumeFile.path);

    // Analyze the resume against the job description
    const analysisResult = await analyzeResume(resumeText, jobDescription, requestId);

    // Return the analysis result
    return res.status(200).json({
      status: 'success',
      data: {
        requestId,
        ...analysisResult,
      },
    });
  } catch (error: any) {
    logger.error(`Error analyzing resume: ${error.message}`);
    
    // Determine the appropriate error response
    if (error.code === 'UNSUPPORTED_FILE_TYPE') {
      return res.status(415).json({
        status: 'error',
        message: 'Unsupported file type',
        errors: [{ code: 'UNSUPPORTED_FILE_TYPE', field: 'resumeFile', message: error.message }],
      });
    }
    
    if (error.code === 'PARSE_ERROR') {
      return res.status(400).json({
        status: 'error',
        message: 'Unable to parse resume',
        errors: [{ code: 'PARSE_ERROR', field: 'resumeFile', message: error.message }],
      });
    }
    
    if (error.code === 'AI_UNAVAILABLE') {
      return res.status(503).json({
        status: 'error',
        message: 'Analysis service temporarily unavailable',
        errors: [{ code: 'AI_UNAVAILABLE', message: error.message }],
      });
    }
    
    // Default to 500 for unknown errors
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
      errors: [{ code: 'SERVER_ERROR', message: 'An unexpected error occurred while processing your request' }],
    });
  } finally {
    // Clean up the uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
}; 