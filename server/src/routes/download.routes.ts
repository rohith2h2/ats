import express from 'express';
import { downloadController } from '../controllers/download.controller';
import { validateDownloadRequest } from '../middleware/validation.middleware';

const router = express.Router();

// POST /api/download - Generate and download final resume document
router.post('/', validateDownloadRequest, downloadController);

export default router; 