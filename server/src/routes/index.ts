import express from 'express';
import analyzeRoutes from './analyze.routes';
import optimizeRoutes from './optimize.routes';
import downloadRoutes from './download.routes';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/analyze', analyzeRoutes);
router.use('/optimize', optimizeRoutes);
router.use('/download', downloadRoutes);

export default router; 