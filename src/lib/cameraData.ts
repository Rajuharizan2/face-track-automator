
import { v4 as uuidv4 } from 'uuid';
import { Camera } from './cameraModels';

// Mock data for development
const mockCameras: Camera[] = [
  {
    id: "1",
    name: "Main Entrance",
    type: "webcam",
    location: "Front Desk",
    enabled: true,
    createdAt: "2023-07-01T12:00:00Z",
    updatedAt: "2023-07-01T12:00:00Z"
  },
  {
    id: "2",
    name: "Lobby Camera",
    type: "ip",
    location: "Lobby",
    enabled: true,
    ipAddress: "192.168.1.101",
    port: 554,
    username: "admin",
    password: "",
    rtspUrl: "/stream1",
    imageRefreshRate: 1000,
    createdAt: "2023-07-02T14:30:00Z",
    updatedAt: "2023-07-02T14:30:00Z"
  }
];

// API endpoints
const API_URL = 'http://localhost:5000/api';
const CAMERAS_ENDPOINT = `${API_URL}/cameras`;

// Get all cameras
export const getCameras = async (): Promise<Camera[]> => {
  try {
    // Use localStorage to persist cameras
    const storedCameras = localStorage.getItem('cameras');
    if (storedCameras) {
      return JSON.parse(storedCameras);
    }

    // If no stored cameras, try the API
    const response = await fetch(CAMERAS_ENDPOINT);
    if (!response.ok) {
      throw new Error('Failed to fetch cameras');
    }
    
    const cameras = await response.json();
    return cameras;
  } catch (error) {
    console.warn('Using mock camera data:', error);
    
    // Initialize localStorage with mock data if not set
    if (!localStorage.getItem('cameras')) {
      localStorage.setItem('cameras', JSON.stringify(mockCameras));
    }
    
    // Return mock data as fallback during development
    return localStorage.getItem('cameras') 
      ? JSON.parse(localStorage.getItem('cameras')!) 
      : mockCameras;
  }
};

// Get a camera by ID
export const getCamera = async (id: string): Promise<Camera | undefined> => {
  try {
    // Try localStorage first
    const storedCameras = localStorage.getItem('cameras');
    if (storedCameras) {
      const cameras = JSON.parse(storedCameras);
      const camera = cameras.find((c: Camera) => c.id === id);
      if (camera) return camera;
    }

    // If not in localStorage, try the API
    const response = await fetch(`${CAMERAS_ENDPOINT}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch camera');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching camera:', error);
    
    // Fallback to mock data during development
    const storedCameras = localStorage.getItem('cameras');
    if (storedCameras) {
      const cameras = JSON.parse(storedCameras);
      return cameras.find((c: Camera) => c.id === id);
    }
    return mockCameras.find(camera => camera.id === id);
  }
};

// Add a camera
export const addCamera = async (camera: Omit<Camera, 'id'>): Promise<Camera> => {
  try {
    const newCamera = {
      ...camera,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Try API first
    const response = await fetch(CAMERAS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCamera),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add camera');
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Using local storage for camera data:', error);
    
    // Fallback to localStorage during development
    const newCamera = {
      ...camera,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const storedCameras = localStorage.getItem('cameras');
    const cameras = storedCameras ? JSON.parse(storedCameras) : [];
    cameras.push(newCamera);
    localStorage.setItem('cameras', JSON.stringify(cameras));
    
    return newCamera;
  }
};

// Update a camera
export const updateCamera = async ({ id, camera }: { id: string, camera: Partial<Camera> }): Promise<Camera> => {
  try {
    // Try API first
    const response = await fetch(`${CAMERAS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...camera, updatedAt: new Date().toISOString() }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update camera');
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Using local storage for camera update:', error);
    
    // Fallback to localStorage during development
    const storedCameras = localStorage.getItem('cameras');
    
    if (storedCameras) {
      const cameras = JSON.parse(storedCameras);
      const index = cameras.findIndex((c: Camera) => c.id === id);
      
      if (index !== -1) {
        cameras[index] = { 
          ...cameras[index], 
          ...camera, 
          updatedAt: new Date().toISOString() 
        };
        
        localStorage.setItem('cameras', JSON.stringify(cameras));
        return cameras[index];
      }
    }
    
    throw new Error('Camera not found');
  }
};

// Delete a camera
export const deleteCamera = async (id: string): Promise<boolean> => {
  try {
    // Try API first
    const response = await fetch(`${CAMERAS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete camera');
    }
    
    return true;
  } catch (error) {
    console.warn('Using local storage for camera deletion:', error);
    
    // Fallback to localStorage during development
    const storedCameras = localStorage.getItem('cameras');
    
    if (storedCameras) {
      const cameras = JSON.parse(storedCameras);
      const filteredCameras = cameras.filter((c: Camera) => c.id !== id);
      localStorage.setItem('cameras', JSON.stringify(filteredCameras));
      return true;
    }
    
    return false;
  }
};

// Get active cameras (enabled cameras)
export const getActiveCameras = async (): Promise<Camera[]> => {
  const cameras = await getCameras();
  return cameras.filter(camera => camera.enabled);
};
