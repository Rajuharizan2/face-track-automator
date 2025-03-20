
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, UserCheck, AlertCircle, RefreshCw, RotateCcw, Cctv } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { startWebcam, stopWebcam, detectFace, recognizeFace } from "@/lib/faceRecognition";
import { User, markAttendance } from "@/lib/attendanceData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getActiveCameras } from "@/lib/cameraData";
import { Camera as CameraModel } from "@/lib/cameraModels";
import { useUser } from "@clerk/clerk-react";
import IPCameraStream from "../camera/IPCameraStream";

interface FaceDetectionProps {
  users: User[];
  onAttendanceMarked: () => void;
}

const FaceDetection = ({ users, onAttendanceMarked }: FaceDetectionProps) => {
  const { user: currentUser } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState<User | null>(null);
  const [attendanceType, setAttendanceType] = useState<'in' | 'out'>('in');
  const [error, setError] = useState<string | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const ipImageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // Fetch available cameras
  const { data: cameras = [], isLoading: isLoadingCameras } = useQuery({
    queryKey: ["activeCameras"],
    queryFn: getActiveCameras,
  });

  const selectedCamera = cameras.find(cam => cam.id === selectedCameraId);
  const isIPCamera = selectedCamera?.type === 'ip';

  // Set the first camera as default when cameras are loaded
  useEffect(() => {
    if (cameras.length > 0 && !selectedCameraId) {
      setSelectedCameraId(cameras[0].id);
    }
  }, [cameras, selectedCameraId]);

  // Initialize the video element and cleanup on unmount
  useEffect(() => {
    console.log("Video element reference:", videoRef.current);
    console.log("IP image reference:", ipImageRef.current);
    
    return () => {
      if (isActive && !isIPCamera) {
        stopWebcam(videoRef.current);
      }
    };
  }, [isActive, isIPCamera]);

  const handleStartCamera = async () => {
    setError(null);
    
    if (!selectedCamera) {
      setError("No camera selected");
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Please select a camera first.",
      });
      return;
    }

    if (isIPCamera) {
      // For IP cameras, we just set isActive to true as the stream is handled by IPCameraStream
      setIsActive(true);
      toast({
        title: "IP Camera activated",
        description: "Streaming from IP camera.",
      });
      return;
    }
    
    try {
      console.log("Starting camera with video element:", videoRef.current);
      const result = await startWebcam(videoRef.current);
      
      if (result.success) {
        setIsActive(true);
        toast({
          title: "Camera activated",
          description: "Please position your face in the frame.",
        });
      } else {
        setError(result.error || "Failed to start camera");
        
        // Show permission dialog if it's a permission issue
        if (result.error?.includes("permission")) {
          setShowPermissionDialog(true);
        }
        
        toast({
          variant: "destructive",
          title: "Camera Error",
          description: result.error || "Failed to start camera. Please check permissions.",
        });
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred");
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Failed to start camera. Please check permissions.",
      });
    }
  };

  const handleStopCamera = () => {
    if (!isIPCamera) {
      stopWebcam(videoRef.current);
    }
    setIsActive(false);
    setRecognizedUser(null);
    setError(null);
  };

  const handleRecognize = async () => {
    if (!isActive) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // For IP cameras, we use the image element instead of the video element
      const element = isIPCamera ? ipImageRef.current : videoRef.current;
      const result = await recognizeFace(element, users);
      
      if (result && result.recognized && result.user) {
        setRecognizedUser(result.user);
        
        toast({
          title: "User Recognized!",
          description: `Welcome, ${result.user.name}!`,
        });
      } else {
        setError("Could not recognize user");
        toast({
          variant: "destructive",
          title: "Recognition Failed",
          description: "Could not recognize user. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      setError("Recognition error");
      toast({
        variant: "destructive",
        title: "Recognition Error",
        description: "An error occurred during face recognition.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!recognizedUser) return;
    
    try {
      const result = await markAttendance(recognizedUser.id, attendanceType);
      if (result) {
        toast({
          title: "Attendance Marked",
          description: `${recognizedUser.name} marked ${attendanceType === 'in' ? 'Time In' : 'Time Out'} successfully.`,
        });
        
        // Reset state
        setRecognizedUser(null);
        handleStopCamera();
        onAttendanceMarked();
      }
    } catch (error) {
      console.error(error);
      setError("Failed to mark attendance");
      toast({
        variant: "destructive",
        title: "Attendance Error",
        description: "Failed to mark attendance. Please try again.",
      });
    }
  };

  const handleRetry = () => {
    handleStopCamera();
    setTimeout(() => {
      handleStartCamera();
    }, 500);
  };

  return (
    <>
      <Card className="w-full overflow-hidden animate-fade-in transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Camera selection */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-64">
                <Select
                  value={selectedCameraId}
                  onValueChange={setSelectedCameraId}
                  disabled={isActive || isLoadingCameras}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Camera" />
                  </SelectTrigger>
                  <SelectContent>
                    {cameras.map((camera) => (
                      <SelectItem key={camera.id} value={camera.id}>
                        {camera.name} ({camera.location})
                      </SelectItem>
                    ))}
                    {cameras.length === 0 && (
                      <SelectItem value="none" disabled>
                        No cameras available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {!isActive && (
                <Button
                  onClick={() => window.location.href = "/camera-settings"}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Cctv className="h-4 w-4 mr-2" />
                  Manage Cameras
                </Button>
              )}
            </div>

            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {isActive ? (
                isIPCamera ? (
                  <IPCameraStream 
                    camera={selectedCamera as CameraModel} 
                    ref={ipImageRef}
                    onError={(errorMsg) => {
                      setError(errorMsg);
                      setIsActive(false);
                    }}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }} // Ensure video is visible
                  />
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-16 w-16 text-muted-foreground opacity-50" />
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                </div>
              )}
              
              {recognizedUser && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground p-3 animate-slide-in-up">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{recognizedUser.name}</p>
                      <p className="text-sm opacity-90">{recognizedUser.department}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                  {error.includes && error.includes("permission") && (
                    <div className="mt-2">
                      <Button variant="outline" size="sm" onClick={() => setShowPermissionDialog(true)}>
                        How to fix?
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              {!isActive ? (
                <>
                  <Button 
                    onClick={handleStartCamera} 
                    className="flex-1 gap-2 animate-scale-in"
                    disabled={!selectedCameraId || cameras.length === 0}
                  >
                    <Camera className="h-4 w-4" />
                    Activate Camera
                  </Button>
                  {error && (
                    <Button 
                      onClick={handleRetry} 
                      variant="outline" 
                      className="flex-1 gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Retry
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleStopCamera} 
                    variant="outline" 
                    className="flex-1 gap-2"
                  >
                    Stop Camera
                  </Button>
                  
                  {!recognizedUser ? (
                    <Button 
                      onClick={handleRecognize} 
                      className="flex-1 gap-2"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                      Recognize Face
                    </Button>
                  ) : (
                    <>
                      <div className="flex-1 flex gap-2">
                        <Button
                          variant={attendanceType === 'in' ? 'default' : 'outline'} 
                          className="flex-1"
                          onClick={() => setAttendanceType('in')}
                        >
                          Time In
                        </Button>
                        <Button 
                          variant={attendanceType === 'out' ? 'default' : 'outline'} 
                          className="flex-1"
                          onClick={() => setAttendanceType('out')}
                        >
                          Time Out
                        </Button>
                      </div>
                      <Button onClick={handleMarkAttendance} className="flex-1">
                        Mark Attendance
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
            
            {isActive && !recognizedUser && !error && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <p>Position your face in the frame and click "Recognize Face"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Camera Permission Required</DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-4">
                <p>To use the face recognition feature, you need to allow camera access in your browser.</p>
                
                <Alert>
                  <h4 className="font-medium mb-2">How to enable camera permissions:</h4>
                  <ol className="space-y-2 list-decimal pl-5">
                    <li>Click on the camera/lock icon in your browser's address bar</li>
                    <li>Select "Allow" for camera access</li>
                    <li>Refresh the page</li>
                  </ol>
                </Alert>
                
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    After enabling permissions, click the "Retry" button to activate the camera again.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => {
              setShowPermissionDialog(false);
              handleRetry();
            }}>
              Retry Camera
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FaceDetection;
