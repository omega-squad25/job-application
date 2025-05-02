import express from 'express';

import getProfileController from '../controllers/job-user/view-profile.js';

import authenticate from '../middleware/auth.js';
const router = express.Router();
router.get('/', authenticate, getProfileController.getProfile);
router.get('/user', authenticate, getProfileController.getUser);
export default router;
