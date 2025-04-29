import Job from '../../models/Job.js';
import Joi from 'joi';

const querySchema = Joi.object({
 page: Joi.number().integer().min(1).optional(),
 limit: Joi.number().integer().min(1).max(100).optional(),
}).options({ abortEarly: false });

const getAllJobsAdminController = {
 getAllAdminJobs: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  if (req.user.role !== 'admin') {
   return res.status(403).json({ message: 'Admin access required' });
  }

  const { error, value } = querySchema.validate(req.query);
  if (error) {
   return res
    .status(400)
    .json({ message: error.details.map((d) => d.message) });
  }

  const { page = 1, limit = 10 } = value;

  try {
   const offset = (page - 1) * limit;
   const jobs = await Job.findAll({
    attributes: [
     'id',
     'title',
     'description',
     'location',
     'company',
     'status',
     'createdAt',
    ],
    offset,
    limit,
    order: [['createdAt', 'DESC']],
   });
   // Get job statistics
   const [totalCount, approvedCount, pendingCount] = await Promise.all([
    Job.count(),
    Job.count({ where: { status: 'APPROVED' } }),
    Job.count({ where: { status: 'PENDING' } }),
   ]);

   res.status(200).json({
    message: 'All jobs retrieved successfully',
    data: {
     jobs,
     statistics: {
      totalNumberOfJobs: totalCount,
      totalNumberOfApprovedJobs: approvedCount,
      totalNumberOfPendingJobs: pendingCount,
     },
     pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
     },
    },
   });
  } catch (error) {
   console.error(error);
   res
    .status(500)
    .json({ message: 'Error retrieving jobs', error: error.message });
  }
 },
};
export default getAllJobsAdminController;
