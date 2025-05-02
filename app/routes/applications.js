import express from 'express';
import applicationSubmissionController from '../controllers/job-user/submitApplication.js';
import userApplicationsController from '../controllers/job-user/getUserApplications.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to protect all routes
router.use(authenticate);

// Submit job application route (with file uploads)
router.post('/submit/:jobId', applicationSubmissionController.submitApplication);

// Get all applications for the authenticated user with filtering and pagination
router.get('/', userApplicationsController.getUserApplications);

// Get details of a specific application
router.get('/:applicationId', userApplicationsController.getApplicationDetail);

export default router;