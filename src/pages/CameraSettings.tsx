
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Cctv, Webcam } from "lucide-react";
import CameraList from "@/components/camera/CameraList";
import AddCameraForm from "@/components/camera/AddCameraForm";
import { Camera, DEFAULT_WEBCAM, DEFAULT_IP_CAMERA } from "@/lib/cameraModels";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCamera, getCameras, updateCamera, deleteCamera } from "@/lib/cameraData";

const CameraSettings = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isAddingCamera, setIsAddingCamera] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [newCameraType, setNewCameraType] = useState<'webcam' | 'ip'>('webcam');
  const queryClient = useQueryClient();

  // Fetch cameras
  const { data: cameras = [], isLoading } = useQuery({
    queryKey: ["cameras"],
    queryFn: getCameras,
  });

  // Add camera mutation
  const addCameraMutation = useMutation({
    mutationFn: addCamera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      setIsAddingCamera(false);
      toast({
        title: "Camera Added",
        description: "The camera has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add camera: ${error.message}`,
      });
    },
  });

  // Update camera mutation
  const updateCameraMutation = useMutation({
    mutationFn: updateCamera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      setEditingCamera(null);
      toast({
        title: "Camera Updated",
        description: "The camera has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update camera: ${error.message}`,
      });
    },
  });

  // Delete camera mutation
  const deleteCameraMutation = useMutation({
    mutationFn: deleteCamera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast({
        title: "Camera Deleted",
        description: "The camera has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete camera: ${error.message}`,
      });
    },
  });

  const handleAddCamera = (camera: Omit<Camera, 'id'>) => {
    addCameraMutation.mutate(camera);
  };

  const handleUpdateCamera = (id: string, camera: Partial<Camera>) => {
    updateCameraMutation.mutate({ id, camera });
  };

  const handleDeleteCamera = (id: string) => {
    deleteCameraMutation.mutate(id);
  };

  return (
    <AppLayout>
      <div className="grid gap-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Camera Settings</h1>
          {!isAddingCamera && (
            <Button onClick={() => setIsAddingCamera(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Camera
            </Button>
          )}
        </div>

        {isAddingCamera ? (
          <Card>
            <CardHeader>
              <CardTitle>Add New Camera</CardTitle>
              <CardDescription>Set up a new camera in your system</CardDescription>
              <Tabs defaultValue="webcam" className="w-full mt-2">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger 
                    value="webcam" 
                    onClick={() => setNewCameraType("webcam")}
                    className="flex items-center"
                  >
                    <Webcam className="mr-2 h-4 w-4" />
                    Webcam
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ip" 
                    onClick={() => setNewCameraType("ip")}
                    className="flex items-center"
                  >
                    <Cctv className="mr-2 h-4 w-4" />
                    IP Camera
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <AddCameraForm
                defaultValues={newCameraType === 'webcam' ? DEFAULT_WEBCAM : DEFAULT_IP_CAMERA}
                onSubmit={handleAddCamera}
                onCancel={() => setIsAddingCamera(false)}
                isSubmitting={addCameraMutation.isPending}
              />
            </CardContent>
          </Card>
        ) : editingCamera ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit Camera</CardTitle>
              <CardDescription>Update camera settings</CardDescription>
            </CardHeader>
            <CardContent>
              <AddCameraForm
                defaultValues={editingCamera}
                onSubmit={(camera) => handleUpdateCamera(editingCamera.id, camera)}
                onCancel={() => setEditingCamera(null)}
                isSubmitting={updateCameraMutation.isPending}
                isEditing
              />
            </CardContent>
          </Card>
        ) : (
          <CameraList
            cameras={cameras}
            isLoading={isLoading}
            onEdit={setEditingCamera}
            onDelete={handleDeleteCamera}
            isDeleting={deleteCameraMutation.isPending}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default CameraSettings;
