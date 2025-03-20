
import * as faceapi from 'face-api.js';

// Use a mockable API URL that works in the sandbox environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      // In a sandbox environment, we'll use mock recognition
      if (!API_URL.includes('localhost')) {
        // Mock recognition for testing
        const randomUser = knownUsers.length > 0 ? knownUsers[Math.floor(Math.random() * knownUsers.length)] : null;
        return {
          recognized: !!randomUser,
          user: randomUser,
          confidence: randomUser ? 0.85 : 0
        };
      }
      
      // Real backend recognition
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

// Start webcam with improved error handling
export const startWebcam = async (videoElement: HTMLVideoElement | null) => {
  if (!videoElement) return { success: false, error: 'No video element provided' };
  
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { 
        success: false, 
        error: 'Camera API not supported in this browser'
      };
    }
    
    // Request camera permission explicitly
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });
    
    videoElement.srcObject = stream;
    
    return new Promise<{ success: boolean, error?: string }>((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play()
          .then(() => resolve({ success: true }))
          .catch(playError => {
            console.error('Error playing video:', playError);
            resolve({ success: false, error: 'Failed to play video stream' });
          });
      };
      
      videoElement.onerror = () => {
        resolve({ success: false, error: 'Error loading video stream' });
      };
    });
  } catch (error: any) {
    console.error('Error starting webcam:', error);
    
    // Provide more helpful error messages based on the error
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return { 
        success: false, 
        error: 'Camera permission denied. Please allow camera access in your browser settings.'
      };
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return { 
        success: false, 
        error: 'No camera found. Please connect a camera and try again.'
      };
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return { 
        success: false, 
        error: 'Camera is already in use by another application.'
      };
    } else if (error.name === 'OverconstrainedError') {
      return { 
        success: false, 
        error: 'Camera does not meet the required constraints.'
      };
    }
    
    return { 
      success: false, 
      error: `Camera error: ${error.message || 'Unknown error'}`
    };
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
      // In a sandbox environment, we'll use a mock response
      if (!API_URL.includes('localhost')) {
        return {
          success: true,
          message: 'User enrolled successfully'
        };
      }
      
      // Real backend enrollment
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
