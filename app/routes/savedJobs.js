import express from 'express';
import SavedJobsController from '../controllers/job-user/savedJobs.js';

import authenticate from '../middleware/auth.js';
const router = express.Router();
router.post('/:jobId', authenticate, SavedJobsController.toggleSaveJob);
router.get('/', authenticate, SavedJobsController.getSavedJobs);
export default router;
