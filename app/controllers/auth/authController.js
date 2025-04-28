import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sequelize from '../../services/db.js';
import Profile from '../../models/Profile.js';
import JobSeekerDetail from '../../models/JobSeekerDetails.js';
dotenv.config();

const authController = {
 signup: async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  let role;
  let isAdmin;

  try {
   // Validate password and confirmPassword match
   if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
   }

   // Password strength validation
   if (password.length < 8) {
    return res
     .status(400)
     .json({ message: 'Password must be at least 8 characters long' });
   }
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   if (!passwordRegex.test(password)) {
    return res.status(400).json({
     message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    });
   }

   // Determine role
   if (email && email.toLowerCase().includes('user@admin.com')) {
    console.log('Admin email detected:', email);
    role = 'admin';
    isAdmin = true;
   } else {
    role = 'user';
    isAdmin = false;
   }

   const { user, profile, jobSeekerDetail } = await sequelize.transaction(
    async (t) => {
     // Check for existing user
     const existingUser = await User.findOne({
      where: { email },
      transaction: t,
     });
     if (existingUser) {
      throw new Error('Email already exists');
     }

     // Hash password
     const hashedPassword = await bcrypt.hash(password, 10);

     // Create new user
     const user = await User.create(
      {
       fullName,
       email,
       password: hashedPassword,
       provider: 'email',
       role: role,
       isAdmin: isAdmin,
      },
      { transaction: t }
     );

     // Create a profile for the new user
     const profile = await Profile.create(
      {
       userId: user.id,
       fullName,
      },
      { transaction: t }
     );

     // Create a JobSeekerDetail linked to the Profile
     const jobSeekerDetail = await JobSeekerDetail.create(
      {
       userId: user.id,
       profileId: profile.id,
       fullName,
      },
      { transaction: t }
     );

     return { user, profile, jobSeekerDetail };
    }
   );

   // Generate JWT token
   const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
   );

   res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
     id: user.id,
     email: user.email,
     role: user.role,
     isAdmin: user.isAdmin,
     profile: {
      id: profile.id,
      userId: profile.userId,
     },
     jobSeekerDetail: {
      id: jobSeekerDetail.id,
      profileId: jobSeekerDetail.profileId,
     },
    },
   });
  } catch (error) {
   console.error(error);
   res.status(500).json({ message: error.message || 'Error registering user' });
  }
 },

 // Login API
 login: async (req, res) => {
  const { email, password } = req.body;

  try {
   // Find user by email
   const user = await User.findOne({ where: { email } });
   if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
   }

   // Compare password
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
   }

   // Generate JWT token
   const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
   );

   res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, email: user.email, isAdmin: user.isAdmin },
   });
  } catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Error logging in' });
  }
 },
};
export default authController;
