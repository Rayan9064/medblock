"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UploadDialog } from "@/components/PatientDashboard/UploadDialog";
import { ReportCard } from "@/components/PatientDashboard/ReportCard";
import { SearchBar } from "@/components/PatientDashboard/SearchBar";
import { ProfileForm } from "@/components/PatientDashboard/ProfileForm";
import { Button } from "@/components/ui/button";

interface Report {
  name?: string;
  created_at: number;
  reportName?: string;
  patientName?: string;
  doctorName?: string;
  reportType?: string;
  reportDate?: string;
  reportUrl?: string;
  imageUrl?: string;
  ipfsHash?: string;
  encryptionKey?: string;
  [key: string]: string | number | boolean | undefined;
}

const PatientDashboard = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  const walletAddress = "GGJAXBBugajRsrovdqYiDtevoSo9RUwhJHTPUgUvTg3r";

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/solana?walletAddress=${walletAddress}`);
      const data = await response.json();
      
      console.log("API Response:", data);
      
      if (data.success) {
        const nfts = data.medicalReports || [];
        
        const processedNfts = nfts.map((nft: any) => ({
          ...nft,
          created_at: nft.created_at || Date.now(),
          reportName: nft.name || "Unnamed Report",
          patientName: nft.patient || "Unknown Patient",
          doctorName: nft.doctor || "Unknown Doctor",
          reportDate: nft.date || "Unknown Date",
          reportUrl: nft.fileUrl || "",
          imageUrl: nft.image || "",
          ipfsHash: nft.ipfsHash || ""
        }));
        
        console.log("Processed NFTs:", processedNfts);
        setReports(processedNfts);
        
        toast({
          title: "Success",
          description: `Found ${processedNfts.length} medical report(s)`,
        });
      } else {
        console.error("API returned error:", data.error);
        setReports([]);
        toast({
          title: "Warning",
          description: data.error || "No reports returned from API",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching medical reports:", error);
      toast({
        title: "Error",
        description: "Failed to fetch medical reports",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGrantAccess = (doctorId: string) => {
    toast({
      title: "Access Granted",
      description: `Access granted to Dr. ${doctorId}`,
    });
  };

  const handleRevokeAccess = (doctorId: string) => {
    toast({
      title: "Access Revoked",
      description: `Access revoked from Dr. ${doctorId}`,
      variant: "destructive",
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
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 rounded-lg">
              <TabsTrigger value="reports" className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-gray-800/20">My Reports</TabsTrigger>
              <TabsTrigger value="access" className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-gray-800/20">Doctor Access</TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-gray-800/20">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <Button 
                      variant="outline" 
                      onClick={fetchReports}
                      disabled={isLoading}
                      className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30"
                    >
                      {isLoading ? "Refreshing..." : "Refresh"}
                    </Button>
                  </div>
                  <UploadDialog onUploadSuccess={fetchReports} />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {isLoading ? (
                    <div className="col-span-full text-center py-8">Loading reports...</div>
                  ) : reports.length === 0 ? (
                    <div className="col-span-full text-center py-8">No medical reports found</div>
                  ) : (
                    reports.map((report, i) => (
                      <ReportCard
                        key={i}
                        report={report}
                        index={i}
                      />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="access" className="mt-6">
              <div className="space-y-6">
                <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Doctor Access Requests</h3>
                  <div className="divide-y divide-white/10 dark:divide-gray-800/10">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between py-4">
                        <div>
                          <p className="font-medium">Dr. John Doe</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Requested access on March {i}, 2024
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 text-white"
                            onClick={() => handleGrantAccess(`John Doe ${i}`)}
                          >
                            Grant Access
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleRevokeAccess(`John Doe ${i}`)}
                          >
                            Deny
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Currently Authorized Doctors</h3>
                  <div className="divide-y divide-white/10 dark:divide-gray-800/10">
                    {[1].map((i) => (
                      <div key={i} className="flex items-center justify-between py-4">
                        <div>
                          <p className="font-medium">Dr. Jane Smith</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Access granted on March {i}, 2024
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleRevokeAccess(`Jane Smith ${i}`)}
                        >
                          Revoke Access
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                <ProfileForm />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
