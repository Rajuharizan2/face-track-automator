
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Camera } from "@/lib/cameraModels";

// Define validation schema based on camera type
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  enabled: z.boolean().default(true),
  type: z.enum(["webcam", "ip"]),
});

const ipCameraSchema = baseSchema.extend({
  ipAddress: z.string().min(1, "IP Address is required"),
  port: z.coerce.number().int().min(1, "Port is required"),
  username: z.string().optional(),
  password: z.string().optional(),
  rtspUrl: z.string().optional(),
  imageRefreshRate: z.coerce.number().int().min(200, "Minimum refresh rate is 200ms").default(1000),
});

const webcamSchema = baseSchema;

interface AddCameraFormProps {
  defaultValues: Partial<Camera>;
  onSubmit: (camera: Omit<Camera, 'id'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing?: boolean;
}

const AddCameraForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing = false,
}: AddCameraFormProps) => {
  const isIpCamera = defaultValues.type === "ip";
  const [formType, setFormType] = useState(isIpCamera ? "ip" : "webcam");
  
  // Select schema based on camera type
  const schema = formType === "ip" ? ipCameraSchema : webcamSchema;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues.name || "",
      location: defaultValues.location || "",
      enabled: defaultValues.enabled !== undefined ? defaultValues.enabled : true,
      type: defaultValues.type || "webcam",
      ...(isIpCamera ? {
        ipAddress: defaultValues.ipAddress || "",
        port: defaultValues.port || 554,
        username: defaultValues.username || "",
        password: defaultValues.password || "",
        rtspUrl: defaultValues.rtspUrl || "/stream",
        imageRefreshRate: defaultValues.imageRefreshRate || 1000,
      } : {}),
    },
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    const now = new Date().toISOString();
    onSubmit({
      ...data,
      createdAt: defaultValues.createdAt || now,
      updatedAt: now,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic camera information */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Camera Name</FormLabel>
                <FormControl>
                  <Input placeholder="Main Entrance Camera" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Main Entrance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Camera Type</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <Label
                      htmlFor="webcam-type"
                      className={`px-4 py-2 rounded cursor-pointer ${
                        field.value === "webcam"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                      onClick={() => {
                        field.onChange("webcam");
                        setFormType("webcam");
                      }}
                    >
                      Webcam
                    </Label>
                    <Label
                      htmlFor="ip-type"
                      className={`px-4 py-2 rounded cursor-pointer ${
                        field.value === "ip"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                      onClick={() => {
                        field.onChange("ip");
                        setFormType("ip");
                      }}
                    >
                      IP Camera
                    </Label>
                    <input
                      type="radio"
                      id="webcam-type"
                      value="webcam"
                      className="hidden"
                      checked={field.value === "webcam"}
                      onChange={() => {
                        field.onChange("webcam");
                        setFormType("webcam");
                      }}
                    />
                    <input
                      type="radio"
                      id="ip-type"
                      value="ip"
                      className="hidden"
                      checked={field.value === "ip"}
                      onChange={() => {
                        field.onChange("ip");
                        setFormType("ip");
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Enabled
                  </FormLabel>
                  <FormDescription>
                    Turn this camera on or off
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* IP Camera specific fields */}
        {form.watch("type") === "ip" && (
          <div className="space-y-4 border rounded-md p-4">
            <h3 className="text-lg font-medium">IP Camera Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="554" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (Optional)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rtspUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RTSP Path (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="/stream" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageRefreshRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refresh Rate (ms)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Interval in milliseconds between frame updates
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Camera" : "Add Camera"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddCameraForm;
