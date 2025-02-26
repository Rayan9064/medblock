
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Eye, Download, FileText, Plus } from "lucide-react";
import { UploadReport } from "@/components/UploadReport";

const PatientDashboard = () => {
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Redirect to home if wallet not connected
  if (!connected) {
    navigate("/");
    return null;
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-50 to-white">
      {showUploadModal && (
        <UploadReport onClose={() => setShowUploadModal(false)} />
      )}

      {/* Header */}
      <nav className="border-b bg-white/50 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-medical-600">
                Patient Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="medical-card px-4 py-2">
                <p className="text-sm text-gray-500">Connected Wallet</p>
                <p className="text-sm font-medium text-gray-900">
                  {publicKey?.toBase58().slice(0, 4)}...
                  {publicKey?.toBase58().slice(-4)}
                </p>
              </div>
              <WalletMultiButton className="btn-primary" />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports">My Reports</TabsTrigger>
              <TabsTrigger value="access">Doctor Access</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="medical-card mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Input
                      type="text"
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                    <Button variant="secondary">Search</Button>
                  </div>
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-medical-600 text-white hover:bg-medical-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Upload New Report
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="medical-card cursor-pointer hover:scale-105"
                    >
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <div className="rounded-lg bg-medical-100 p-4">
                          <FileText className="h-8 w-8 text-medical-600" />
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900">
                        Medical Report #{i}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Last updated: March {i}, 2024
                      </p>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(i)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(i)}
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

            <TabsContent value="access" className="medical-card mt-6">
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

            <TabsContent value="profile" className="medical-card mt-6">
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
