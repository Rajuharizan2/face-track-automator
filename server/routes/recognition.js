
const express = require('express');
const router = express.Router();
const { getUsersData } = require('../utils/database');
const { compareDescriptors } = require('../utils/faceRecognition');

// Recognize a face from a descriptor
router.post('/identify', async (req, res) => {
  try {
    const { descriptor } = req.body;
    
    if (!descriptor) {
      return res.status(400).json({ message: 'Face descriptor is required' });
    }
    
    const users = await getUsersData();
    const usersWithFaceData = users.filter(user => user.faceDescriptor);
    
    if (usersWithFaceData.length === 0) {
      return res.status(404).json({ message: 'No users with face data found' });
    }
    
    let bestMatch = null;
    let bestDistance = 0.6; // Threshold for recognition, lower is more strict
    
    for (const user of usersWithFaceData) {
      const distance = compareDescriptors(descriptor, JSON.parse(user.faceDescriptor));
      
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = user;
      }
    }
    
    if (bestMatch) {
      res.json({
        recognized: true,
        user: bestMatch,
        confidence: 1 - bestDistance
      });
    } else {
      res.json({
        recognized: false,
        user: null,
        confidence: 0
      });
    }
  } catch (error) {
    console.error('Error in face recognition:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Store face descriptor for a user
router.post('/enroll/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { descriptor } = req.body;
    
    if (!descriptor) {
      return res.status(400).json({ message: 'Face descriptor is required' });
    }
    
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user with face descriptor
    const updatedUser = {
      ...user,
      faceDescriptor: JSON.stringify(descriptor),
      updatedAt: new Date().toISOString()
    };
    
    await updateUserData(userId, updatedUser);
    
    res.json({
      message: 'Face enrolled successfully',
      user: {
        ...updatedUser,
        faceDescriptor: undefined // Don't send the descriptor back
      }
    });
  } catch (error) {
    console.error('Error enrolling face:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
