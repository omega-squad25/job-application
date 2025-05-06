import express from "express";

import SkillController from "../controllers/job-user/skill.js";
import authenticate from "../middleware/auth.js";
const router = express.Router();
router.get("/", authenticate, SkillController.getSkills);
router.post("/", authenticate, SkillController.addSkill);
router.patch("/:skillId", authenticate, SkillController.editSkill);
export default router;
