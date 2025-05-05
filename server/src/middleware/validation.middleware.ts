import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from '../utils/logger';

// Define validation schemas
const analyzeRequestSchema = Joi.object({
  jobDescription: Joi.string().required().min(10).max(10000)
    .messages({
      'string.empty': 'Job description is required',
      'string.min': 'Job description must be at least 10 characters',
      'string.max': 'Job description cannot exceed 10,000 characters',
      'any.required': 'Job description is required',
    }),
  // Note: The resume file will be validated by multer middleware
});

const optimizeRequestSchema = Joi.object({
  requestId: Joi.string().required().uuid()
    .messages({
      'string.empty': 'Request ID is required',
      'string.guid': 'Invalid request ID format',
      'any.required': 'Request ID is required',
    }),
});

const downloadRequestSchema = Joi.object({
  requestId: Joi.string().required().uuid()
    .messages({
      'string.empty': 'Request ID is required',
      'string.guid': 'Invalid request ID format',
      'any.required': 'Request ID is required',
    }),
  acceptedChanges: Joi.array().items(Joi.string()).required()
    .messages({
      'array.base': 'Accepted changes must be an array',
      'any.required': 'Accepted changes are required',
    }),
  filename: Joi.string().required().min(1).max(255)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .messages({
      'string.empty': 'Filename is required',
      'string.min': 'Filename must be at least 1 character',
      'string.max': 'Filename cannot exceed 255 characters',
      'string.pattern.base': 'Filename can only contain letters, numbers, underscores, and hyphens',
      'any.required': 'Filename is required',
    }),
});

// Validation middleware functions
export const validateAnalyzeRequest = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'Resume file is required',
      errors: [{ code: 'FILE_REQUIRED', field: 'resumeFile', message: 'Resume file is required' }],
    });
  }

  const { error } = analyzeRequestSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => ({
      code: detail.type.toUpperCase(),
      field: detail.path.join('.'),
      message: detail.message,
    }));
    
    logger.warn(`Validation error in analyze request: ${JSON.stringify(errors)}`);
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors,
    });
  }
  
  next();
};

export const validateOptimizeRequest = (req: Request, res: Response, next: NextFunction) => {
  const { error } = optimizeRequestSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => ({
      code: detail.type.toUpperCase(),
      field: detail.path.join('.'),
      message: detail.message,
    }));
    
    logger.warn(`Validation error in optimize request: ${JSON.stringify(errors)}`);
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors,
    });
  }
  
  next();
};

export const validateDownloadRequest = (req: Request, res: Response, next: NextFunction) => {
  const { error } = downloadRequestSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => ({
      code: detail.type.toUpperCase(),
      field: detail.path.join('.'),
      message: detail.message,
    }));
    
    logger.warn(`Validation error in download request: ${JSON.stringify(errors)}`);
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors,
    });
  }
  
  next();
}; 