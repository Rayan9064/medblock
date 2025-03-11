"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, BellRing } from "lucide-react";
// import DoctorNavbar from "@/components/DoctorDashboard/Navbar";

const DoctorDashboard = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect to home if wallet not connected
  

  const handleRequestAccess = (patientId: string) => {
    toast({
      title: "Access Requested",
      description: `Access request sent to Patient ${patientId}`,
    });
  };

  const handleViewReport = (reportId: number) => {
    toast({
      title: "Opening Report",
      description: `Loading medical report #${reportId}`,
    });
  };

  return (
    <div className="min-h-screenabsolute top-0 z-[0] h-screen w-screen bg-medical-950/10 dark:bg-medical-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      {/* Header */}
      {/* <DoctorNavbar /> */}

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <Tabs defaultValue="patients" className="w-full">
            <TabsList className="grid w-full grid-cols-3  bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl">
              <TabsTrigger value="patients">Patient List</TabsTrigger>
              <TabsTrigger value="requests">Access Requests</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="patients" className="medical-card mt-6  bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                  <Button variant="secondary">Search</Button>
                </div>

                <div className="divide-y">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-4"
                    >
                      <div>
                        <p className="font-medium">Patient #{i}</p>
                        <p className="text-sm text-gray-500">
                          Last visit: March {i}, 2024
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="text-medical-600"
                        onClick={() => handleRequestAccess(`${i}`)}
                      >
                        Request Access
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requests" className="medical-card mt-6  bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Approved Reports</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="medical-card">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Patient #{i}</p>
                          <p className="text-sm text-gray-500">
                            Report #: MED-2024-{i}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(i)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="medical-card mt-6  bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Recent Updates</h3>
                <div className="divide-y">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="py-4">
                      <div className="flex items-start space-x-3">
                        <div className="rounded-full bg-medical-100 p-2">
                          <BellRing className="h-4 w-4 text-medical-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Access Granted by Patient #{i}
                          </p>
                          <p className="text-sm text-gray-500">
                            March {i}, 2024 at 2:30 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;