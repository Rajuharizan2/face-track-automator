
import * as faceapi from 'face-api.js';

// API endpoint
const API_URL = 'http://localhost:5000/api';

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

// Detect face and extract face descriptor
export const detectFace = async (videoElement: HTMLVideoElement | null) => {
  if (!videoElement) return null;
  
  try {
    // This now uses actual face-api detection instead of mock data
    const detections = await faceapi.detectSingleFace(videoElement)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (detections) {
      return {
        detected: true,
        confidence: detections.detection.score,
        descriptor: Array.from(detections.descriptor)
      };
    }
    
    return {
      detected: false,
      confidence: 0,
      descriptor: null
    };
  } catch (error) {
    console.error('Face detection error:', error);
    return {
      detected: false,
      confidence: 0,
      descriptor: null
    };
  }
};

// Recognize face using the backend API
export const recognizeFace = async (videoElement: HTMLVideoElement | null, knownUsers: any[]) => {
  if (!videoElement) return null;
  
  try {
    // Detect face and get descriptor
    const detection = await detectFace(videoElement);
    
    if (detection && detection.detected && detection.descriptor) {
      // Send descriptor to backend for recognition
      const response = await fetch(`${API_URL}/recognition/identify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descriptor: detection.descriptor }),
      });
      
      if (!response.ok) {
        throw new Error('Recognition API request failed');
      }
      
      const result = await response.json();
      return result;
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
        videoElement.play();
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

// Enroll a user's face
export const enrollFace = async (videoElement: HTMLVideoElement | null, userId: string) => {
  if (!videoElement) return null;
  
  try {
    const detection = await detectFace(videoElement);
    
    if (detection && detection.detected && detection.descriptor) {
      // Send descriptor to backend for enrollment
      const response = await fetch(`${API_URL}/recognition/enroll/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descriptor: detection.descriptor }),
      });
      
      if (!response.ok) {
        throw new Error('Face enrollment API request failed');
      }
      
      return await response.json();
    }
    
    return {
      success: false,
      message: 'No face detected'
    };
  } catch (error) {
    console.error('Face enrollment error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};
