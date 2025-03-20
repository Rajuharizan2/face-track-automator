
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateDailyReport, generateUserReport, getUsers, User } from "@/lib/attendanceData";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, CalendarDays, Download, RefreshCw } from "lucide-react";
import { format } from "date-fns";

const reportSchema = z.object({
  reportType: z.enum(["daily", "user"]),
  date: z.date().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  userId: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportGeneratorProps {
  users: User[];
}

const ReportGenerator = ({ users }: ReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: "daily",
      date: new Date(),
    },
  });

  const reportType = form.watch("reportType");

  const generateReport = async (data: ReportFormValues) => {
    setIsGenerating(true);
    try {
      let report;
      
      if (data.reportType === "daily" && data.date) {
        const dateStr = format(data.date, "yyyy-MM-dd");
        report = await generateDailyReport(dateStr);
      } else if (data.reportType === "user" && data.userId && data.startDate && data.endDate) {
        const startDateStr = format(data.startDate, "yyyy-MM-dd");
        const endDateStr = format(data.endDate, "yyyy-MM-dd");
        report = await generateUserReport(data.userId, startDateStr, endDateStr);
      } else {
        throw new Error("Invalid report parameters");
      }
      
      // In a real app, this would trigger a download
      // For now, we'll just show a success message
      toast({
        title: "Report Generated",
        description: `${report.filename} has been generated successfully.`,
      });
      
      console.log("Report data:", report.data);
      
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate report. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Report Generator
        </CardTitle>
        <CardDescription>
          Generate attendance reports by date or by user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(generateReport)} className="space-y-5">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily Report</SelectItem>
                      <SelectItem value="user">User Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {reportType === "daily" && (
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal flex justify-between"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarDays className="h-4 w-4 opacity-70" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {reportType === "user" && (
              <>
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select User</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const startDate = form.getValues("startDate");
                                return (
                                  date > new Date() || 
                                  (startDate && date < startDate)
                                );
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            
            <Button type="submit" className="w-full mt-6" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
