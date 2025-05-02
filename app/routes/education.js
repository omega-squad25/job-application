import express from 'express';

import EducationController from '../controllers/job-user/education.js';
import authenticate from '../middleware/auth.js';
const router = express.Router();
router.post('/', authenticate, EducationController.addEducation);
router.patch('/:educationId', authenticate, EducationController.editEducation);
export default router;
