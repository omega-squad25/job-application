import Job from '../../models/Job.js';
import Joi from 'joi';

const paramsSchema = Joi.object({
 id: Joi.string().uuid().required(),
}).options({ abortEarly: false });

const getJobByIdController = {
 getOneJobWithDetails: async (req, res) => {
  const { error, value } = paramsSchema.validate({ id: req.params.id });
  if (error) {
   return res.status(400).json({
    message: 'Invalid job ID',
    errors: error.details.map((d) => d.message),
   });
  }

  try {
   const job = await Job.findOne({
    where: {
     id: value.id,
     status: 'approved',
    },
    attributes: [
     'id',
     'title',
     'description',
     'location',
     'company',
     'createdAt',
    ],
   });

   if (!job) {
    return res.status(404).json({
     message: 'Job not found or not approved',
    });
   }

   res.status(200).json({
    message: 'Job retrieved successfully',
    data: job,
   });
  } catch (error) {
   console.error('Error fetching job:', error);
   res.status(500).json({
    message: 'Internal server error while retrieving job',
    error: error.message,
   });
  }
 },
};

export default getJobByIdController;
