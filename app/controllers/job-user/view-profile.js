import Profile from '../../models/Profile.js';
import Skill from '../../models/Skills.js';
import Experience from '../../models/Experience.js';
import Education from '../../models/Education.js';
import User from '../../models/User.js';
import JobSeekerDetail from '../../models/JobSeekerDetails.js';
const getProfileController = {
 getProfile: async (req, res) => {
  const userId = req.user.id;

  try {
   const profile = await Profile.findOne({
    where: { userId },
    attributes: ['id', 'fullName', 'jobTitle', 'location', 'createdAt'],
    include: [
     {
      model: JobSeekerDetail,
      attributes: ['id'],
      include: [
       {
        model: Experience,
        attributes: [
         'id',
         'jobTitle',
         'company',
         'location',
         'startDate',
         'endDate',
         'responsibility',
        ],
       },
       {
        model: Education,
        attributes: [
         'id',
         'degree',
         'institution',
         'fieldOfStudy',
         'startDate',
         'endDate',
        ],
       },
       {
        model: Skill,
        attributes: ['id', 'name', 'yearsOfExperience'],
       },
      ],
     },
    ],
   });

   if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
   }

   res.status(200).json({
    message: 'Profile retrieved successfully',
    data: profile,
   });
  } catch (error) {
   console.error('Error fetching profile:', error);
   res.status(500).json({
    message: 'Error retrieving profile',
    error: error.message,
   });
  }
 },

 getUser: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
   const user = await User.findOne({
    where: { id: req.user.id },
    attributes: ['id', 'fullName', 'email', 'firstName', 'lastName'],
   });

   if (!user) {
    return res.status(404).json({ message: 'User not found' });
   }

   return res.status(200).json({
    message: 'User profile retrieved successfully',
    user,
   });
  } catch (error) {
   console.error('Error fetching user profile:', error);
   return res.status(500).json({ message: 'Internal server error' });
  }
 },
};

export default getProfileController;
