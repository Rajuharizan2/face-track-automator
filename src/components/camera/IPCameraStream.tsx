
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Camera } from "@/lib/cameraModels";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IPCameraStreamProps {
  camera: Camera;
  onError?: (error: string) => void;
}

const IPCameraStream = forwardRef<HTMLImageElement, IPCameraStreamProps>(
  ({ camera, onError }, ref) => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    
    // Create a URL for the camera stream
    const createCameraUrl = () => {
      if (camera.type !== 'ip') return null;
      
      // In a real environment, we would use the server to proxy the request
      // to avoid CORS issues, but for demo purposes, we're using a sample image
      
      // This would be the actual implementation in a real scenario:
      // const auth = camera.username ? 
      //   `${encodeURIComponent(camera.username)}:${encodeURIComponent(camera.password || '')}@` 
      //   : '';
      // return `http://${auth}${camera.ipAddress}:${camera.port}${camera.rtspUrl || ''}`;
      
      // For the demo, we use a random placeholder image with a cache breaker to simulate changes
      return `https://picsum.photos/640/480?random=${Date.now()}-${retryCount}`;
    };
    
    // Load the IP camera image
    useEffect(() => {
      if (!camera || camera.type !== 'ip') return;
      
      const loadImage = () => {
        setIsLoading(true);
        setError(null);
        
        const url = createCameraUrl();
        if (!url) {
          setError("Invalid camera configuration");
          setIsLoading(false);
          if (onError) onError("Invalid camera configuration");
          return;
        }
        
        setImageUrl(url);
      };
      
      // Initial load
      loadImage();
      
      // Set up refresh interval based on camera refresh rate
      const interval = setInterval(() => {
        loadImage();
        setRetryCount(prev => prev + 1);
      }, camera.imageRefreshRate || 1000);
      
      return () => {
        clearInterval(interval);
      };
    }, [camera, onError, retryCount]);
    
    // Handle image load error
    const handleImageError = () => {
      setIsLoading(false);
      setError(`Failed to load camera feed from ${camera.ipAddress}`);
      if (onError) onError(`Failed to load camera feed from ${camera.ipAddress}`);
    };
    
    // Handle image load success
    const handleImageLoad = () => {
      setIsLoading(false);
      setError(null);
    };
    
    // Forward the ref to the image element
    useImperativeHandle(ref, () => {
      const imageElement = document.getElementById(`ip-camera-${camera.id}`) as HTMLImageElement;
      return imageElement;
    });
    
    if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black/10">
          <Alert variant="destructive" className="w-3/4 max-w-md">
            <AlertDescription>
              {error}
              <div className="mt-2">
                <p className="text-xs">
                  Camera: {camera.name} at {camera.ipAddress}:{camera.port}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    
    return (
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <RefreshCw className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
        <img
          id={`ip-camera-${camera.id}`}
          ref={ref}
          src={imageUrl}
          onError={handleImageError}
          onLoad={handleImageLoad}
          alt={`${camera.name} stream`}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      </div>
    );
  }
);

IPCameraStream.displayName = "IPCameraStream";

export default IPCameraStream;
