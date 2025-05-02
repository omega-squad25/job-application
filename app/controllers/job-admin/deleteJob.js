import dotenv from 'dotenv';
import sequelize from '../../services/db.js';
import Job from '../../models/Job.js';
dotenv.config();

const deleteJobController = {
 deleteJob: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  // Check if the user has the admin role
  if (req.user.role !== 'admin') {
   return res.status(403).json({ message: 'Admin access required' });
  }

  const { id } = req.params;

  try {
   let job;

   await sequelize.transaction(async (t) => {
    job = await Job.findByPk(id, { transaction: t });

    if (!job) {
     throw new Error('Job does not exist.');
    }

    await job.destroy({ transaction: t });
   });

   res.status(204).send();
  } catch (error) {
   console.error(error);
   res
    .status(500)
    .json({ message: 'Error updating job', error: error.message });
  }
 },
};

export default deleteJobController;
