import Job from "../models/Job.js";
import Joi from "joi";

const querySchema = Joi.object({
 page: Joi.number().integer().min(1).optional(),
 limit: Joi.number().integer().min(1).max(100).optional(),
}).options({ abortEarly: false });

const getAllJobsController = {
 getAllJobs: async (req, res) => {
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
     "id",
     "title",
     "description",
     "location",
     "company",

     "createdAt",
    ],
    offset,
    limit,
    order: [["createdAt", "DESC"]],
   });

   const totalCount = await Job.count();

   res.status(200).json({
    message: "Jobs retrieved successfully",
    data: {
     jobs,
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
    .json({ message: "Error retrieving jobs", error: error.message });
  }
 },
};
export default getAllJobsController;
