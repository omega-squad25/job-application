import express from "express";
import createJobController from "../controllers/createJob.js";

import getAllJobsController from "../controllers/getAllJobs.js";
import getJobByIdController from "../controllers/getOneJobWithDetails.js";
import authenticate from "../middleware/auth.js";
const router = express.Router();
router.get("/", getAllJobsController.getAllJobs);
router.get("/:id", getJobByIdController.getOneJobWithDetails);
router.post("/", authenticate, createJobController.createJob);

export default router;
