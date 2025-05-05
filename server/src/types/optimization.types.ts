/**
 * Analysis result from GPT-4 for resume compatibility with job description
 */
export interface AnalysisResult {
  /**
   * ATS compatibility score (0-100)
   */
  atsScore: number;
  
  /**
   * Whether the resume needs optimization
   */
  needsOptimization: boolean;
  
  /**
   * Identified keywords from the job description
   */
  keywords: {
    /**
     * Keywords that were found in the resume
     */
    matched: string[];
    
    /**
     * Keywords that were not found in the resume
     */
    missing: string[];
  };
  
  /**
   * Detailed analysis of the resume compatibility
   */
  analysisDetails: string;
}

/**
 * Optimization result from GPT-4 for resume improvement
 */
export interface OptimizationResult {
  /**
   * Expected ATS score after applying all changes
   */
  optimizedScore: number;
  
  /**
   * List of suggested changes to improve ATS compatibility
   */
  changes: Change[];
  
  /**
   * General suggestions for improving the resume
   */
  generalSuggestions: string[];
  
  /**
   * Suggested filename for the optimized resume
   */
  suggestedFilename: string;
}

/**
 * Represents a single suggested change to the resume
 */
export interface Change {
  /**
   * Unique identifier for the change
   */
  id: string;
  
  /**
   * Section of the resume where the change should be applied
   */
  section: string;
  
  /**
   * Original text from the resume
   */
  original: string;
  
  /**
   * Suggested replacement text
   */
  suggested: string;
  
  /**
   * Reason for suggesting this change
   */
  reason: string;
}

/**
 * Session data structure for storing request information
 */
export interface SessionData {
  /**
   * Original resume text content
   */
  resumeText: string;
  
  /**
   * Original job description text
   */
  jobDescription: string;
  
  /**
   * Analysis result from the AI
   */
  analysisResult: AnalysisResult;
  
  /**
   * Optimization result (if optimization was performed)
   */
  optimizationResult?: OptimizationResult;
} 