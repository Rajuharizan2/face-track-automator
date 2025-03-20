
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { saveUserData, getUsersData, getUserById, updateUserData, deleteUserData } = require('../utils/database');

// Set up storage for face images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/faces';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getUsersData();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new user with face data
router.post('/', upload.single('faceImage'), async (req, res) => {
  try {
    const { name, email, department, role } = req.body;
    
    if (!name || !email || !department || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const profileImage = req.file ? `/uploads/faces/${req.file.filename}` : '/placeholder.svg';
    
    const newUser = {
      id: uuidv4(),
      name,
      email,
      department,
      role,
      profileImage,
      faceDescriptor: req.body.faceDescriptor || null,
      createdAt: new Date().toISOString()
    };
    
    await saveUserData(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', upload.single('faceImage'), async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await getUserById(userId);
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updates = req.body;
    
    if (req.file) {
      updates.profileImage = `/uploads/faces/${req.file.filename}`;
      
      // Delete old profile image if it's not the placeholder
      if (existingUser.profileImage && existingUser.profileImage !== '/placeholder.svg') {
        const oldImagePath = path.join(__dirname, '..', existingUser.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    const updatedUser = { ...existingUser, ...updates, updatedAt: new Date().toISOString() };
    await updateUserData(userId, updatedUser);
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await getUserById(userId);
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete profile image if it's not the placeholder
    if (existingUser.profileImage && existingUser.profileImage !== '/placeholder.svg') {
      const imagePath = path.join(__dirname, '..', existingUser.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await deleteUserData(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
