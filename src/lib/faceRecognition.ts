
import * as faceapi from 'face-api.js';

// Initialize face-api models
export const loadModels = async () => {
  try {
    // Load models from public directory
    const MODEL_URL = '/models';
    
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    
    console.log('Models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading models:', error);
    return false;
  }
};

// For demo purposes, we'll simulate face recognition
export const detectFace = async (videoElement: HTMLVideoElement | null) => {
  if (!videoElement) return null;
  
  try {
    // Mock detection for now - in real implementation, this would use actual face-api detection
    // const detections = await faceapi.detectAllFaces(videoElement).withFaceLandmarks().withFaceDescriptors();
    return {
      detected: true,
      confidence: 0.95
    };
  } catch (error) {
    console.error('Face detection error:', error);
    return {
      detected: false,
      confidence: 0
    };
  }
};

// Simulate recognition (in a real app, this would compare with stored face descriptors)
export const recognizeFace = async (videoElement: HTMLVideoElement | null, knownUsers: any[]) => {
  if (!videoElement) return null;
  
  try {
    // In a real implementation, this would:
    // 1. Detect the face in the video
    // 2. Extract face descriptor
    // 3. Compare with known face descriptors
    // 4. Return the best match if confidence is high enough
    
    // For demo, we'll return a random user if face is detected
    const detection = await detectFace(videoElement);
    
    if (detection && detection.detected && knownUsers.length > 0) {
      const randomUser = knownUsers[Math.floor(Math.random() * knownUsers.length)];
      return {
        recognized: true,
        user: randomUser,
        confidence: detection.confidence
      };
    }
    
    return {
      recognized: false,
      user: null,
      confidence: 0
    };
  } catch (error) {
    console.error('Face recognition error:', error);
    return {
      recognized: false,
      user: null,
      confidence: 0
    };
  }
};

// Start webcam
export const startWebcam = async (videoElement: HTMLVideoElement | null) => {
  if (!videoElement) return false;
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }
    });
    videoElement.srcObject = stream;
    
    return new Promise<boolean>((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve(true);
      };
    });
  } catch (error) {
    console.error('Error starting webcam:', error);
    return false;
  }
};

// Stop webcam
export const stopWebcam = (videoElement: HTMLVideoElement | null) => {
  if (!videoElement) return;
  
  try {
    const stream = videoElement.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
    }
  } catch (error) {
    console.error('Error stopping webcam:', error);
  }
};
