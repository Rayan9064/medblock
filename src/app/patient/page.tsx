"use client";
import { uploadToPinata } from "@/services/pinataService";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye, Download, FileText, Upload } from "lucide-react";
// import PatientNavbar from "@/components/PatientDashboard/Navbar";
// import { fetchMedicalReports } from "@/services/solanaService";

const PatientDashboard = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Upload file to Pinata
  const handleUploadReport = async () => {
    if (!selectedFile) {
      toast({ title: "No File Selected", description: "Please select a file to upload." });
      return;
    }

    setUploading(true);

    try {
      const hash = await uploadToPinata(selectedFile);
      setIpfsHash(hash);
      toast({
        title: "Upload Successful",
        description: `Report uploaded to IPFS. Hash: ${hash}`,
      });
    } catch (error: unknown) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading the report.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

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

  const handleViewReport = (reportId: number) => {
    toast({
      title: "Opening Report",
      description: `Loading medical report #${reportId}`,
    });
  };

  const handleDownloadReport = (reportId: number) => {
    toast({
      title: "Downloading Report",
      description: `Preparing medical report #${reportId} for download`,
    });
  };

  const walletAddress = "GGJAXBBugajRsrovdqYiDtevoSo9RUwhJHTPUgUvTg3r";
  
  interface Report {
    name?: string;
    created_at: number;
    [key: string]: string | number | boolean | undefined;
  }
  
  const [reports, setReports] = useState<Report[]>([]);
  console.log("Medical Reports:", reports);
  console.log("Medical Reports:", reports);

  const fetchdata = async () => {
    try {
      const response = await fetch(`/api/solana?walletAddress=${walletAddress}`);
      const data = await response.json();
      if (data.success && data.nfts) {
        setReports(data.nfts);
        toast({
          title: "Success",
          description: "Medical reports fetched successfully",
        });
      }
    } catch (error) {
      console.error("Error fetching medical reports:", error);
      toast({
        title: "Error",
        description: "Failed to fetch medical reports",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 z-[0] h-screen w-screen bg-medical-950/10 dark:bg-medical-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
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
                <div className="flex items-center space-x-4">
                  <Input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm bg-white/70 dark:bg-gray-900/70"
                  />
                  <Button variant="secondary">Search</Button>
                  <Dialog>
                    <div className="flex gap-2">
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-500 dark:to-pink-400 text-white dark:text-white hover:opacity-90"
                        >
                          <Upload className="h-5 w-5" />
                          <span>New Report</span>
                        </Button>
                      </DialogTrigger>
                      <Button onClick={fetchdata}>Fetch Reports</Button>
                    </div>
                    <DialogContent className="bg-white dark:bg-gray-900">
                    <DialogHeader>
                        <DialogTitle>Upload New Report</DialogTitle>
                        <DialogDescription>
                          Choose a medical report file to upload to the system.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Input type="file" onChange={handleFileChange} className="max-w-sm" />
                        {selectedFile && (
                          <p className="text-sm text-gray-500">
                            Selected file: {selectedFile.name}
                          </p>
                        )}
                        {ipfsHash && (
                          <div className="text-sm text-gray-500">
                            <p>File uploaded successfully!</p>
                            <a
                              href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-medical-600 hover:underline"
                            >
                              View on IPFS
                            </a>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={async () => {
                            await handleUploadReport();
                            if (ipfsHash) {
                              setTimeout(() => {
                                setSelectedFile(null);
                                const dialogClose = document.querySelector('[data-dialog-close]');
                                if (dialogClose instanceof HTMLElement) {
                                  dialogClose.click();
                                }
                              }, 2000);
                            }
                          }}
                          disabled={uploading}
                          className="flex items-center space-x-2 bg-blue-600 text-black hover:bg-blue-700 hover:text-white dark:bg-medical-600 dark:text-white dark:hover:bg-medical-500"
                        >
                          <Upload className="h-5 w-5" />
                          <span>{uploading ? "Uploading..." : "Upload Report"}</span>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:scale-105 transition-all"
                    >
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <div className="rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-4">
                          <FileText className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Medical Report #{i}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Last updated: March {i}, 2024
                      </p>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(i)}
                          className="border-gray-200 dark:border-gray-800"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(i)}
                          className="border-gray-200 dark:border-gray-800"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  {reports.map((report, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:scale-105 transition-all"
                  >
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                    <div className="rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-4">
                      <FileText className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                    </div>
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {report.name || `Medical Report #${i + 1}`}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(report.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReport(i)}
                      className="border-gray-200 dark:border-gray-800"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReport(i)}
                      className="border-gray-200 dark:border-gray-800"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    </div>
                  </motion.div>
                  ))}
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
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input placeholder="John Doe" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <Input type="number" placeholder="30" className="mt-1" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="btn-primary">Save Changes</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
