
import { Camera } from "@/lib/cameraModels";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Cctv, Webcam, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

interface CameraListProps {
  cameras: Camera[];
  isLoading: boolean;
  onEdit: (camera: Camera) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const CameraList = ({
  cameras,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: CameraListProps) => {
  const [cameraToDelete, setCameraToDelete] = useState<Camera | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (cameras.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Cctv className="h-12 w-12 text-muted-foreground opacity-50" />
            <div>
              <h3 className="text-lg font-medium">No Cameras</h3>
              <p className="text-sm text-muted-foreground">
                You haven't added any cameras yet. Add your first camera to start using the face recognition system.
              </p>
            </div>
            <Button onClick={() => window.scrollTo(0, 0)}>
              Add Camera
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cameras.map((camera) => (
          <Card key={camera.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{camera.name}</CardTitle>
                <Badge variant={camera.enabled ? "default" : "outline"}>
                  {camera.enabled ? "Active" : "Disabled"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  {camera.type === 'webcam' ? (
                    <Webcam className="h-4 w-4 mr-2 text-muted-foreground" />
                  ) : (
                    <Cctv className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}
                  <span className="capitalize">{camera.type} Camera</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{camera.location}</span>
                </div>
                {camera.type === 'ip' && (
                  <div className="flex items-center text-sm">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {camera.ipAddress}:{camera.port}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(camera)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCameraToDelete(camera)}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!cameraToDelete} onOpenChange={(open) => !open && setCameraToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Camera</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this camera? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {cameraToDelete && (
            <Alert>
              <AlertTitle>{cameraToDelete.name}</AlertTitle>
              <AlertDescription>
                Location: {cameraToDelete.location}
                <br />
                Type: {cameraToDelete.type === 'webcam' ? 'Webcam' : 'IP Camera'}
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCameraToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (cameraToDelete) {
                  onDelete(cameraToDelete.id);
                  setCameraToDelete(null);
                }
              }}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CameraList;
