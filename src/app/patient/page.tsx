"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UploadDialog } from "@/components/PatientDashboard/UploadDialog";
import { ReportCard } from "@/components/PatientDashboard/ReportCard";
import { SearchBar } from "@/components/PatientDashboard/SearchBar";
import { ProfileForm } from "@/components/PatientDashboard/ProfileForm";
import ViewReportDialog from "@/components/PatientDashboard/ViewReportDialog";
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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const walletAddress = "GGJAXBBugajRsrovdqYiDtevoSo9RUwhJHTPUgUvTg3r";

  const fetchdata = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/solana?walletAddress=${walletAddress}`);
      const data = await response.json();
      
      console.log("API Response:", data); // For debugging
      
      if (data.success) {
        // Check if response contains medicalReports (correct property name from API)
        const nfts = data.medicalReports || [];
        
        // Process NFTs to ensure they have created_at property
        const processedNfts = nfts.map((nft: any) => ({
          ...nft,
          created_at: nft.created_at || Date.now(),
          reportName: nft.name || "Unnamed Report", // Ensure reportName exists
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
    fetchdata();
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

  const handleViewReport = async (reportId: number) => {
    try {
      const report = reports[reportId];
      if (!report) throw new Error("Report not found");

      // Set the selected report and open the dialog
      setSelectedReport(report);
      setViewDialogOpen(true);
      
      toast({
        title: "Opening Report",
        description: `Loading medical report details`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open report",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = async (reportId: number) => {
    try {
      const report = reports[reportId];
      if (!report) throw new Error("Report not found");

      toast({
        title: "Downloading Report",
        description: `Preparing medical report for download`,
      });
      
      if (!report.reportUrl) {
        throw new Error("Report URL not available");
      }
      
      if (!report.encryptionKey) {
        // No encryption key - just open the URL
        window.open(report.reportUrl, '_blank');
        toast({
          title: "Download Started",
          description: "Your report is being downloaded (encrypted)",
          variant: "default",
        });
        return;
      }
      
      // Fetch the encrypted file from IPFS
      console.log("Fetching encrypted file from:", report.reportUrl);
      const response = await fetch(report.reportUrl, {
        method: 'GET',
        cache: 'no-cache', // Avoid caching issues
        headers: {
          'Accept': '*/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.statusText}`);
      }
      
      const encryptedBlob = await response.blob();
      console.log("Encrypted blob received, size:", encryptedBlob.size, "bytes");
      
      if (encryptedBlob.size === 0) {
        throw new Error("Received empty file from IPFS");
      }
      
      // Import the encryption key
      console.log("Importing encryption key...");
      const binaryStr = atob(report.encryptionKey);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        bytes.buffer,
        { name: "AES-GCM", length: 256 },  // Must exactly match key generation params
        false,
        ["decrypt"]
      );
      
      // Decrypt the file using our decryptFile function
      console.log("Decrypting file...");
      const { decryptFile } = await import('@/services/encryptionService');
      const decryptedData = await decryptFile(encryptedBlob, cryptoKey);
      
      // Set an appropriate MIME type based on the file extension or report type
      let mimeType = "application/pdf"; // Default to PDF
      
      if (report.reportUrl.endsWith(".jpg") || report.reportUrl.endsWith(".jpeg")) {
        mimeType = "image/jpeg";
      } else if (report.reportUrl.endsWith(".png")) {
        mimeType = "image/png";
      } else if (report.reportUrl.endsWith(".docx")) {
        mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }
      
      // Create a new blob with the correct MIME type
      const decrypted = new Blob([decryptedData], { type: mimeType });
      console.log("Decryption complete, blob size:", decrypted.size, "bytes");
      
      // Create a download link for the decrypted file
      const downloadUrl = URL.createObjectURL(decrypted);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = report.reportName || 'medical-report';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the URL object
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 100);
      
      toast({
        title: "Download Complete",
        description: "Your decrypted report has been downloaded",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: "Failed to download and decrypt report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 z-[0] h-screen w-screen bg-medical-950/10 dark:bg-medical-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      {/* View Report Dialog */}
      <ViewReportDialog 
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        report={selectedReport}
      />
      
      <div className="container relative mx-auto px-4 py-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl">
              <TabsTrigger value="reports">My Reports</TabsTrigger>
              <TabsTrigger value="access">Doctor Access</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="mt-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  <UploadDialog />
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
                        onView={handleViewReport}
                        onDownload={handleDownloadReport}
                      />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="access" className="mt-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="space-y-6">
                <h3 className="text-lg font-medium">Doctor Access Requests</h3>
                <div className="divide-y">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-4"
                    >
                      <div>
                        <p className="font-medium">Dr. John Doe</p>
                        <p className="text-sm text-gray-500">
                          Requested access on March {i}, 2024
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="default"
                          className="btn-primary"
                          onClick={() => handleGrantAccess(`John Doe ${i}`)}
                        >
                          Grant Access
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleRevokeAccess(`John Doe ${i}`)}
                        >
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium">Currently Authorized Doctors</h3>
                  <div className="mt-4 divide-y">
                    {[1].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-4"
                      >
                        <div>
                          <p className="font-medium">Dr. Jane Smith</p>
                          <p className="text-sm text-gray-500">
                            Access granted on March {i}, 2024
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="text-red-600"
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

            <TabsContent value="profile" className="mt-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Profile Information</h3>
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
