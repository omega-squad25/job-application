import express from 'express';
import uploadResumeController from '../controllers/job-user/uploads-file.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Resume upload endpoint
router.post('/upload-resume', uploadResumeController.uploadResume);

// Additional file upload endpoint
router.post(
 '/upload-additional-file',
 uploadResumeController.uploadAdditionalFile
);

export default router;
