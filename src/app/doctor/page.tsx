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
    <div className="relative min-h-screen">
      <div className="absolute top-0 z-[0] h-screen w-screen bg-purple-950/10 dark:bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      <div className="container relative mx-auto px-4 py-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <Tabs defaultValue="patients" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 rounded-lg">
              <TabsTrigger value="patients" className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-gray-800/20">Patient List</TabsTrigger>
              <TabsTrigger value="requests" className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-gray-800/20">Access Requests</TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-gray-800/20">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="patients" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20"
                  />
                  <Button 
                    variant="outline"
                    className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30"
                  >
                    Search
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 rounded-lg p-6 transition-all hover:bg-white/20 dark:hover:bg-gray-800/20"
                    >
                      <div className="flex flex-col space-y-4">
                        <div>
                          <h3 className="font-medium">Patient #{i}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last visit: March {i}, 2024
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 text-white border-0"
                          onClick={() => handleRequestAccess(`${i}`)}
                        >
                          Request Access
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Approved Reports</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 rounded-lg p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Patient #{i}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Report #: MED-2024-{i}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(i)}
                          className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30"
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

            <TabsContent value="notifications" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Recent Updates</h3>
                <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 rounded-lg divide-y divide-white/10 dark:divide-gray-800/10">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 p-2">
                          <BellRing className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Access Granted by Patient #{i}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
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