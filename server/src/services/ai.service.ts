import OpenAI from 'openai';
import logger from '../utils/logger';
import { saveSessionData, getSessionData } from './session.service';
import { AnalysisResult, OptimizationResult } from '../types/optimization.types';

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze a resume against a job description
 * 
 * @param resumeText - Text content of the resume
 * @param jobDescription - Job description to compare against
 * @param requestId - Unique ID for the request
 * @returns Analysis result with ATS score and keyword matches
 */
export const analyzeResume = async (
  resumeText: string,
  jobDescription: string,
  requestId: string
): Promise<AnalysisResult> => {
  try {
    logger.info(`Analyzing resume for request: ${requestId}`);
    
    // Create the prompt for GPT-4
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyst. Compare the provided resume with the job description requirements and calculate an ATS compatibility score from 0-100. Provide detailed reasoning for your score and identify matched and missing keywords. Return your analysis in JSON format.`;
    
    const userPrompt = `
    Job Description:
    ${jobDescription}

    Resume:
    ${resumeText}

    Return your analysis in this exact JSON format:
    {
      "atsScore": number,
      "needsOptimization": boolean,
      "keywords": {
        "matched": ["string"],
        "missing": ["string"]
      },
      "analysisDetails": "string"
    }`;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 1000,
    });
    
    // Parse the response
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw {
        code: 'AI_UNAVAILABLE',
        message: 'Failed to get analysis from AI service',
      };
    }
    
    // Parse the JSON response
    const analysisResult = JSON.parse(content) as AnalysisResult;
    
    // Save the session data for later use
    await saveSessionData(requestId, {
      resumeText,
      jobDescription,
      analysisResult,
    });
    
    return analysisResult;
  } catch (error: any) {
    logger.error(`Error analyzing resume: ${error.message}`);
    
    // Handle API errors
    if (error.response && error.response.status) {
      logger.error(`OpenAI API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
      throw {
        code: 'AI_UNAVAILABLE',
        message: 'AI service temporarily unavailable. Please try again later.',
      };
    }
    
    // Rethrow the error
    throw error;
  }
};

/**
 * Get the analysis result for a specific request
 * 
 * @param requestId - The unique request ID
 * @returns The analysis result or null if not found
 */
export const getAnalysisResult = async (requestId: string): Promise<AnalysisResult | null> => {
  const sessionData = await getSessionData(requestId);
  
  if (!sessionData || !sessionData.analysisResult) {
    return null;
  }
  
  return sessionData.analysisResult;
};

/**
 * Optimize a resume based on analysis results
 * 
 * @param resumeText - Original resume text content
 * @param jobDescription - Original job description text
 * @param analysisResult - Previous analysis result
 * @returns Optimization suggestions
 */
export const optimizeResume = async (
  resumeText: string,
  jobDescription: string,
  analysisResult: AnalysisResult
): Promise<OptimizationResult> => {
  try {
    logger.info(`Optimizing resume with ATS score: ${analysisResult.atsScore}`);
    
    // Create the prompt for GPT-4
    const systemPrompt = `You are an expert resume optimizer for ATS compatibility. Analyze the resume against the job description and suggest specific modifications to improve ATS score. Do not fabricate experience or qualifications. Focus on reorganizing, rephrasing, and highlighting relevant experience. Return your suggestions in JSON format with specific changes.`;
    
    const userPrompt = `
    Job Description:
    ${jobDescription}

    Resume:
    ${resumeText}

    Current ATS Score: ${analysisResult.atsScore}
    Missing Keywords: ${JSON.stringify(analysisResult.keywords.missing)}

    Return your optimization in this exact JSON format:
    {
      "optimizedScore": number,
      "changes": [
        {
          "id": "string",
          "section": "string",
          "original": "string",
          "suggested": "string",
          "reason": "string"
        }
      ],
      "generalSuggestions": ["string"],
      "suggestedFilename": "string"
    }`;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });
    
    // Parse the response
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw {
        code: 'AI_UNAVAILABLE',
        message: 'Failed to get optimization from AI service',
      };
    }
    
    // Parse the JSON response
    const optimizationResult = JSON.parse(content) as OptimizationResult;
    
    return optimizationResult;
  } catch (error: any) {
    logger.error(`Error optimizing resume: ${error.message}`);
    
    // Handle API errors
    if (error.response && error.response.status) {
      logger.error(`OpenAI API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
      throw {
        code: 'AI_UNAVAILABLE',
        message: 'AI service temporarily unavailable. Please try again later.',
      };
    }
    
    // Rethrow the error
    throw error;
  }
};

/**
 * Generate an intelligent filename for the resume
 * 
 * @param resumeText - Resume text to extract applicant name from
 * @param jobDescription - Job description to extract position and company
 * @returns Suggested filename for the resume
 */
export const generateFilename = async (
  resumeText: string,
  jobDescription: string
): Promise<string> => {
  try {
    // Create the prompt for GPT-4
    const systemPrompt = `Generate a resume filename based on the applicant's name and job details. Follow the format: [FirstName]_[LastName]_[Position]_[Company].`;
    
    const userPrompt = `
    Extract the applicant's name from this resume:
    ${resumeText.substring(0, 1000)}

    Extract the job title and company from this job description:
    ${jobDescription.substring(0, 500)}

    Generate a filename with the format: [FirstName]_[LastName]_[Position]_[Company]
    Filename should only include letters, numbers, and underscores. No spaces or special characters.`;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use a smaller model for cost efficiency
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 50,
    });
    
    // Parse the response
    const suggestedFilename = response.choices[0]?.message?.content?.trim() || 'Resume';
    
    // Clean the filename to ensure it contains only valid characters
    const cleanedFilename = suggestedFilename
      .replace(/[^\w\d_]/g, '_') // Replace special characters with underscores
      .replace(/_+/g, '_'); // Replace multiple underscores with a single one
    
    return cleanedFilename;
  } catch (error: any) {
    logger.error(`Error generating filename: ${error.message}`);
    
    // Return a default filename on error
    return `Resume_${new Date().toISOString().split('T')[0]}`;
  }
}; 