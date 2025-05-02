import sequelize from '../../services/db.js';
import JobApplication from '../../models/JobApplications.js';
import Job from '../../models/Job.js';
import { formatDistanceToNow } from 'date-fns';

const userApplicationsController = {
 /**
  * Get all job applications for the authenticated user
  * @param {Object} req -
  * @param {Object} res 
  */
 getUserApplications: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const userId = req.user.id;
  const {
   status,
   sort = 'submittedAt',
   order = 'DESC',
   limit = 10,
   page = 1,
  } = req.query;

  try {
   const whereConditions = { userId };

   // Add status filter if provided
   if (status) {
    whereConditions.status = status;
   }

   // Pagination
   const offset = (page - 1) * limit;

   // Get applications with related job info
   const { count, rows: applications } = await JobApplication.findAndCountAll({
    where: whereConditions,
    attributes: [
     'id',
     'status',
     'submittedAt',
     [
      sequelize.literal(`
              CASE 
                WHEN submittedAt IS NOT NULL 
                THEN submittedAt 
              END
            `),
      'appliedAt',
     ],
    ],
    include: [
     {
      model: Job,
      attributes: ['id', 'title', 'company', 'location', 'description'],
      as: 'job',
     },
    ],
    order: [[sort, order]],
    limit: parseInt(limit),
    offset: parseInt(offset),
   });
   const appliedJobs = applications[0].job;
  
   const formattedApplications = applications.map((application) => {
    const applicationData = application.toJSON();
    return {
     ...applicationData,
     appliedWhen: formatDistanceToNow(new Date(application.submittedAt), {
      addSuffix: true,
     }),
    };
   });

  
   const totalPages = Math.ceil(count / limit);

   return res.status(200).json({
    success: true,
    data: {
     applications: formattedApplications,
     appliedJobs,
     pagination: {
      total: count,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
     },
    },
   });
  } catch (error) {
   console.error('Error fetching user applications:', error);
   return res.status(500).json({
    success: false,
    message: 'Error fetching applications',
    error: error.message,
   });
  }
 },

 /**
  * Get details of a specific application for the authenticated user
  * @param {Object} req 
  * @param {Object} res 
  */
 getApplicationDetail: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const userId = req.user.id;
  const { applicationId } = req.params;

  if (!applicationId) {
   return res.status(400).json({
    success: false,
    message: 'Application ID is required',
   });
  }

  try {
   const application = await JobApplication.findOne({
    where: {
     id: applicationId,
     userId,
    },
    include: [
     {
      model: Job,
      attributes: [
       'id',
       'title',
       'company',
       'location',
       'description',
       'requirements',
       'salary',
       'applicationDeadline',
      ],
      as: 'job',
     },
    ],
   });

   if (!application) {
    return res.status(404).json({
     success: false,
     message: 'Application not found',
    });
   }

   return res.status(200).json({
    success: true,
    data: application,
   });
  } catch (error) {
   console.error('Error fetching application details:', error);
   return res.status(500).json({
    success: false,
    message: 'Error fetching application details',
    error: error.message,
   });
  }
 },
};

export default userApplicationsController;
