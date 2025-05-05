import fs from 'fs';
import path from 'path';
// @ts-ignore
import pdf from 'pdf-parse';
// @ts-ignore
import mammoth from 'mammoth';
// @ts-ignore
import htmlPdf from 'html-pdf';
import logger from '../utils/logger';
import { OptimizationResult } from '../types/optimization.types';

/**
 * Extract text from a resume file based on its file type
 * 
 * @param filePath - Path to the uploaded resume file
 * @returns Extracted text content from the resume
 */
export const extractTextFromResume = async (filePath: string): Promise<string> => {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    
    // Extract text based on file type
    switch (fileExtension) {
      case '.pdf':
        return extractTextFromPdf(filePath);
        
      case '.docx':
        return extractTextFromDocx(filePath);
        
      case '.txt':
        return fs.readFileSync(filePath, 'utf-8');
        
      default:
        throw {
          code: 'UNSUPPORTED_FILE_TYPE',
          message: `Unsupported file type: ${fileExtension}. Please upload a PDF, DOCX, or TXT file.`,
        };
    }
  } catch (error: any) {
    logger.error(`Error extracting text from resume: ${error.message}`);
    
    // Rethrow as a formatted error
    if (error.code === 'UNSUPPORTED_FILE_TYPE') {
      throw error;
    }
    
    throw {
      code: 'PARSE_ERROR',
      message: `Failed to extract text from resume: ${error.message}`,
    };
  }
};

/**
 * Extract text from a PDF file
 * 
 * @param filePath - Path to the PDF file
 * @returns Extracted text content
 */
const extractTextFromPdf = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error: any) {
    logger.error(`Error parsing PDF: ${error.message}`);
    throw {
      code: 'PARSE_ERROR',
      message: `Failed to parse PDF file: ${error.message}`,
    };
  }
};

/**
 * Extract text from a DOCX file
 * 
 * @param filePath - Path to the DOCX file
 * @returns Extracted text content
 */
const extractTextFromDocx = async (filePath: string): Promise<string> => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error: any) {
    logger.error(`Error parsing DOCX: ${error.message}`);
    throw {
      code: 'PARSE_ERROR',
      message: `Failed to parse DOCX file: ${error.message}`,
    };
  }
};

/**
 * Generate an optimized resume PDF with the accepted changes
 * 
 * @param originalText - Original resume text
 * @param optimizationResult - Result from the optimization process
 * @param acceptedChanges - IDs of changes that were accepted by the user
 * @returns Buffer containing the generated PDF
 */
export const generateOptimizedResume = async (
  originalText: string,
  optimizationResult: OptimizationResult,
  acceptedChanges: string[]
): Promise<Buffer> => {
  try {
    // Apply the accepted changes to the original text
    let optimizedText = originalText;
    
    // Filter only the accepted changes
    const changes = optimizationResult.changes.filter(change => 
      acceptedChanges.includes(change.id)
    );
    
    // Apply each change to the text
    // Note: This is a simplified implementation
    // A real implementation would need to handle section identification and proper text replacement
    for (const change of changes) {
      optimizedText = optimizedText.replace(change.original, change.suggested);
    }
    
    // Convert the text to HTML for PDF generation
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Optimized Resume</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          h1, h2, h3 {
            color: #000;
          }
          .resume {
            max-width: 800px;
            margin: 0 auto;
          }
          .section {
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="resume">
          <pre>${optimizedText}</pre>
        </div>
      </body>
      </html>
    `;
    
    // Generate PDF from HTML
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      htmlPdf.create(html, {
        format: 'Letter',
        border: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      }).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
    
    return pdfBuffer;
  } catch (error: any) {
    logger.error(`Error generating optimized resume: ${error.message}`);
    throw {
      code: 'GENERATION_ERROR',
      message: `Failed to generate optimized resume: ${error.message}`,
    };
  }
}; 