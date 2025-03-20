
export interface Camera {
  id: string;
  name: string;
  type: 'webcam' | 'ip';
  location: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  // IP camera specific fields
  ipAddress?: string;
  port?: number;
  username?: string;
  password?: string;
  rtspUrl?: string;
  imageRefreshRate?: number; // For IP cameras, refresh rate in ms
}

// Default camera settings
export const DEFAULT_WEBCAM: Omit<Camera, 'id'> = {
  name: 'Default Webcam',
  type: 'webcam',
  location: 'Main Entrance',
  enabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_IP_CAMERA: Omit<Camera, 'id'> = {
  name: 'IP Camera',
  type: 'ip',
  location: 'Lobby',
  enabled: true,
  ipAddress: '192.168.1.100',
  port: 554,
  username: '',
  password: '',
  rtspUrl: '/stream',
  imageRefreshRate: 1000,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
