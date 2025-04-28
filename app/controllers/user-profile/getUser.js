import User from '../../models/User.js';

const UserProfileController = {
 getUser: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
   const user = await User.findOne({
    where: { id: req.user.id },
    attributes: ['id', 'email', 'firstName', 'lastName'],
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

export default UserProfileController;
