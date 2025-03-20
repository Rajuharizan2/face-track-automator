
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Building, Clock, MailOpen, Settings as SettingsIcon, User, Key } from "lucide-react";

const systemSettingsSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  adminEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  notifyOnAttendance: z.boolean(),
  startTime: z.string(),
  lateAfterMinutes: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Late after minutes must be a number.",
  }),
  timezone: z.string(),
});

const securitySettingsSchema = z.object({
  minRecognitionConfidence: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 1;
    },
    {
      message: "Confidence must be between 0 and 1.",
    }
  ),
  enableTwoFactorAuth: z.boolean(),
  adminApprovalRequired: z.boolean(),
  logFailedAttempts: z.boolean(),
});

type SystemSettingsValues = z.infer<typeof systemSettingsSchema>;
type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;

const Settings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const systemForm = useForm<SystemSettingsValues>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      companyName: "Acme Corporation",
      adminEmail: "admin@example.com",
      notifyOnAttendance: true,
      startTime: "09:00",
      lateAfterMinutes: "15",
      timezone: "UTC",
    },
  });

  const securityForm = useForm<SecuritySettingsValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      minRecognitionConfidence: "0.7",
      enableTwoFactorAuth: false,
      adminApprovalRequired: true,
      logFailedAttempts: true,
    },
  });

  const onSystemSubmit = (data: SystemSettingsValues) => {
    setIsSubmitting(true);
    // In a real app, this would send the data to your backend
    console.log("System settings:", data);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Settings saved",
        description: "Your system settings have been updated successfully.",
      });
    }, 1000);
  };

  const onSecuritySubmit = (data: SecuritySettingsValues) => {
    setIsSubmitting(true);
    // In a real app, this would send the data to your backend
    console.log("Security settings:", data);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Settings saved",
        description: "Your security settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

        <Tabs defaultValue="system" className="animate-fade-in">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="system" className="pt-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure your organization and attendance settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...systemForm}>
                  <form onSubmit={systemForm.handleSubmit(onSystemSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={systemForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Acme Inc." className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={systemForm.control}
                        name="adminEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admin Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MailOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="admin@example.com" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Notifications and alerts will be sent to this email
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={systemForm.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Work Start Time</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input type="time" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={systemForm.control}
                          name="lateAfterMinutes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Late After (minutes)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormDescription>
                                Minutes after start time to mark as late
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={systemForm.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="UTC">UTC</SelectItem>
                                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                                <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={systemForm.control}
                        name="notifyOnAttendance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Email Notifications
                              </FormLabel>
                              <FormDescription>
                                Send email notifications for attendance events
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
                    
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="pt-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure facial recognition security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={securityForm.control}
                        name="minRecognitionConfidence"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Recognition Confidence</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="1"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum confidence threshold for face recognition (0-1)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <FormField
                          control={securityForm.control}
                          name="enableTwoFactorAuth"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Two-Factor Authentication
                                </FormLabel>
                                <FormDescription>
                                  Require two-factor authentication for admin access
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
                        
                        <FormField
                          control={securityForm.control}
                          name="adminApprovalRequired"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Admin Approval for New Users
                                </FormLabel>
                                <FormDescription>
                                  Require admin approval when adding new users
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
                        
                        <FormField
                          control={securityForm.control}
                          name="logFailedAttempts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Log Failed Recognition Attempts
                                </FormLabel>
                                <FormDescription>
                                  Keep records of failed face recognition attempts
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
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">
                        Changing security settings may affect face recognition accuracy.
                        Test thoroughly after making changes.
                      </p>
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Security Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
