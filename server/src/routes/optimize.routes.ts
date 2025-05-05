import express from 'express';
import { optimizeController } from '../controllers/optimize.controller';
import { validateOptimizeRequest } from '../middleware/validation.middleware';

const router = express.Router();

// POST /api/optimize - Generate optimized resume based on analysis
router.post('/', validateOptimizeRequest, optimizeController);

export default router; 