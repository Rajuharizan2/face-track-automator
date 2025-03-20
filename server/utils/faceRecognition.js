
/**
 * Utility functions for face recognition
 */

// Compare two face descriptors and return a distance measure (lower is more similar)
const compareDescriptors = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
    return 1.0; // Maximum distance (not similar)
  }
  
  // Euclidean distance calculation
  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    const diff = descriptor1[i] - descriptor2[i];
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
};

module.exports = {
  compareDescriptors
};
