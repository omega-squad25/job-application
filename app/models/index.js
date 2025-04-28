import sequelize from '../services/db.js';
import User from './User.js';
import Profile from './Profile.js';
import Job from './Job.js';
import JobSeekerDetail from './JobSeekerDetails.js';
import Skill from './Skills.js';
import JobSeekerSkill from './JobSeekerSkill.js';
import Experience from './Experience.js';
import Education from './Education.js';
import JobApplication from './JobApplications.js';
import SavedJob from './SavedJobs.js';
// User associations
User.hasOne(Profile, {
 foreignKey: 'userId',
 onDelete: 'CASCADE',
 onUpdate: 'CASCADE',
});
User.hasMany(Job, { foreignKey: 'createdBy' });
User.hasOne(JobSeekerDetail, { foreignKey: 'userId' });
User.hasMany(SavedJob, { foreignKey: 'userId' });
// Profile associations
Profile.belongsTo(User, {
 foreignKey: 'userId',
 onDelete: 'CASCADE',
 onUpdate: 'CASCADE',
});
// Profile-JobSeekerDetail relationship
Profile.hasOne(JobSeekerDetail, {
 foreignKey: 'profileId',
 onDelete: 'CASCADE',
});

// Job associations
Job.belongsTo(User, { foreignKey: 'createdBy' });

// JobSeekerDetail associations
JobSeekerDetail.belongsTo(User, { foreignKey: 'userId' });
JobSeekerDetail.belongsTo(Profile, {
 foreignKey: 'profileId',
 onDelete: 'CASCADE',
});

JobSeekerDetail.hasMany(Experience, { foreignKey: 'jobSeekerDetailId' });
JobSeekerDetail.hasMany(Education, { foreignKey: 'jobSeekerDetailId' });

//obSeekerDetail and Skill using JobSeekerSkill as through table
JobSeekerDetail.belongsToMany(Skill, {
 through: JobSeekerSkill,
 foreignKey: 'jobSeekerDetailId',
 otherKey: 'skillId',
});
Skill.belongsToMany(JobSeekerDetail, {
 through: JobSeekerSkill,
 foreignKey: 'skillId',
 otherKey: 'jobSeekerDetailId',
 onDelete: 'CASCADE',
});

//JobApplication association
User.hasMany(JobApplication, { foreignKey: 'userId' });
Job.hasMany(JobApplication, { foreignKey: 'jobId' });
Job.hasMany(SavedJob, { foreignKey: 'jobId' });
JobApplication.belongsTo(User, { foreignKey: 'userId', as: 'user' });
JobApplication.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
JobApplication.belongsTo(JobSeekerDetail, {
 foreignKey: 'jobSeekerDetailId',
 as: 'jobSeekerDetail',
});
JobSeekerDetail.hasMany(JobApplication, { foreignKey: 'jobSeekerDetailId' });

// Experience associations
Experience.belongsTo(JobSeekerDetail, { foreignKey: 'jobSeekerDetailId' });

// Education associations
Education.belongsTo(JobSeekerDetail, { foreignKey: 'jobSeekerDetailId' });
Skill.belongsTo(JobSeekerDetail, { foreignKey: 'jobSeekerDetailId' });

//Saved job association
SavedJob.belongsTo(User, { foreignKey: 'userId' });
SavedJob.belongsTo(Job, { foreignKey: 'jobId' });

// Export all models and sequelize instance
export {
 sequelize,
 User,
 Profile,
 Job,
 JobSeekerDetail,
 Skill,
 JobSeekerSkill,
 Experience,
 Education,
 JobApplication,
 SavedJob,
};
