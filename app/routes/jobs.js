import express from 'express';
import createJobController from '../controllers/job-admin/createJob.js';
import updateJobController from '../controllers/job-admin/updateJob.js';
import getAllJobsController from '../controllers/job-user/getAllJobs.js';
import getAllJobsAdminController from '../controllers/job-admin/getAllJobs.js';
import getJobByIdController from '../controllers/job-user/getOneJobWithDetails.js';
import deleteJobController from '../controllers/job-admin/deleteJob.js';
import authenticate from '../middleware/auth.js';
const router = express.Router();
router.get('/', getAllJobsController.getAllJobs);
router.get('/admin', authenticate, getAllJobsAdminController.getAllAdminJobs);

router.get('/:id', getJobByIdController.getOneJobWithDetails);
router.patch('/status/:id', authenticate, updateJobController.updateJobStatus);
router.patch(
 '/job-details/:id',
 authenticate,
 updateJobController.editJobDetails
);
router.delete('/:id', authenticate, deleteJobController.deleteJob);

router.post('/', authenticate, createJobController.createJob);

export default router;
