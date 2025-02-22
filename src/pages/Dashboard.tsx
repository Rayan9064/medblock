
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Dashboard = () => {
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect to home if wallet is not connected
  if (!connected) {
    navigate("/");
    return null;
  }

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      // Implement NFT minting logic here
      toast({
        title: "Report uploaded successfully",
        description: "Your medical report has been securely stored as an NFT",
      });
    } catch (error) {
      toast({
        title: "Error uploading report",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Medical Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage your medical reports securely on the blockchain
              </p>
            </div>
            <div className="flex items-center space-x-4 flex-wrap gap-4">
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

          <div className="medical-card">
            <Tabs defaultValue="reports" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reports">My Medical Reports</TabsTrigger>
                <TabsTrigger value="upload">Upload & Mint Report</TabsTrigger>
              </TabsList>
              <TabsContent value="reports">
                <div className="space-y-6">
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
                            <svg
                              className="h-8 w-8 text-medical-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-900">
                          Medical Report #{i}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Last updated: March {i}, 2024
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="upload">
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-medical-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-medical-500 focus-within:ring-offset-2 hover:text-medical-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="application/pdf"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              // Handle file upload
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF up to 10MB
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleUpload}
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Minting NFT...</span>
                        </div>
                      ) : (
                        "Upload & Mint Report"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
