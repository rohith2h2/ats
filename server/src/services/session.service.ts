import logger from '../utils/logger';

// In-memory storage for session data (for development)
// In production, this would be a Redis or other distributed cache
interface SessionData {
  [key: string]: any;
}

// Session expiration time (1 hour in milliseconds)
const SESSION_EXPIRATION = 60 * 60 * 1000;

// Session storage map
const sessionStore: Map<string, { data: SessionData; expires: number }> = new Map();

/**
 * Save session data for a request
 * 
 * @param requestId - Unique ID for the request
 * @param data - Data to store in the session
 */
export const saveSessionData = async (requestId: string, data: SessionData): Promise<void> => {
  try {
    // Set expiration time
    const expires = Date.now() + SESSION_EXPIRATION;
    
    // Store data with expiration
    sessionStore.set(requestId, { data, expires });
    
    logger.debug(`Session data saved for request: ${requestId}`);
    
    // Clean up expired sessions occasionally
    if (Math.random() < 0.1) { // 10% chance to clean up on each write
      cleanupExpiredSessions();
    }
  } catch (error: any) {
    logger.error(`Error saving session data: ${error.message}`);
    throw new Error(`Failed to save session data: ${error.message}`);
  }
};

/**
 * Get session data for a request
 * 
 * @param requestId - Unique ID for the request
 * @returns Session data or null if not found or expired
 */
export const getSessionData = async (requestId: string): Promise<SessionData | null> => {
  try {
    const session = sessionStore.get(requestId);
    
    // Check if session exists and is not expired
    if (!session) {
      logger.debug(`Session not found for request: ${requestId}`);
      return null;
    }
    
    if (session.expires < Date.now()) {
      logger.debug(`Session expired for request: ${requestId}`);
      sessionStore.delete(requestId);
      return null;
    }
    
    // Extend session expiration on access
    session.expires = Date.now() + SESSION_EXPIRATION;
    sessionStore.set(requestId, session);
    
    logger.debug(`Session data retrieved for request: ${requestId}`);
    
    return session.data;
  } catch (error: any) {
    logger.error(`Error retrieving session data: ${error.message}`);
    return null;
  }
};

/**
 * Delete session data for a request
 * 
 * @param requestId - Unique ID for the request
 */
export const deleteSessionData = async (requestId: string): Promise<void> => {
  try {
    sessionStore.delete(requestId);
    logger.debug(`Session data deleted for request: ${requestId}`);
  } catch (error: any) {
    logger.error(`Error deleting session data: ${error.message}`);
  }
};

/**
 * Clean up expired sessions
 */
const cleanupExpiredSessions = (): void => {
  try {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [requestId, session] of sessionStore.entries()) {
      if (session.expires < now) {
        sessionStore.delete(requestId);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      logger.debug(`Cleaned up ${cleanedCount} expired sessions`);
    }
  } catch (error: any) {
    logger.error(`Error cleaning up sessions: ${error.message}`);
  }
}; 