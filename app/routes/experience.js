import express from 'express';

import ExperienceController from '../controllers/job-user/experience.js';
import authenticate from '../middleware/auth.js';
const router = express.Router();
router.post('/', authenticate, ExperienceController.addExperience);
router.patch(
 '/:experienceId',
 authenticate,
 ExperienceController.editExperience
);
export default router;
