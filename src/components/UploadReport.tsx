
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, FileText, CheckCircle2 } from "lucide-react";
import { uploadToPinata } from "@/services/pinataService";
import { mintMedicalNFT } from "@/services/solanaService";

interface UploadReportProps {
  onClose: () => void;
}

const steps = [
  { id: 1, title: "Upload Medical Report" },
  { id: 2, title: "Generate Metadata" },
  { id: 3, title: "Upload Metadata" },
  { id: 4, title: "Mint NFT" },
];

export function UploadReport({ onClose }: UploadReportProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportName, setReportName] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportHash, setReportHash] = useState("");
  const [metadataHash, setMetadataHash] = useState("");
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setReportName(file.name);
    }
  };

  const handleUploadReport = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const hash = await uploadToPinata(selectedFile);
      if (hash) {
        setReportHash(hash);
        toast({
          title: "Success",
          description: "Report uploaded to IPFS",
        });
        setCurrentStep(2);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload report",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleGenerateMetadata = async () => {
    const metadata = {
      name: reportName,
      description: "Medical Report",
      image: `ipfs://${reportHash}`,
      attributes: [
        {
          trait_type: "Report Type",
          value: "Medical",
        },
        {
          trait_type: "Upload Date",
          value: new Date().toISOString(),
        },
      ],
    };

    try {
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });
      const metadataFile = new File([metadataBlob], "metadata.json", {
        type: "application/json",
      });

      const hash = await uploadToPinata(metadataFile);
      if (hash) {
        setMetadataHash(hash);
        toast({
          title: "Success",
          description: "Metadata generated and uploaded",
        });
        setCurrentStep(4);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate metadata",
        variant: "destructive",
      });
    }
  };

  const handleMintNFT = async () => {
    setLoading(true);
    try {
      const nftAddress = await mintMedicalNFT(
        `https://gateway.pinata.cloud/ipfs/${metadataHash}`,
        reportName
      );
      toast({
        title: "Success",
        description: `NFT minted successfully! Address: ${nftAddress}`,
      });
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mint NFT",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="mb-8">
          <h2 className="text-lg font-semibold">Upload Medical Report</h2>
          <p className="text-sm text-gray-500">Complete all steps to mint your report as an NFT</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  currentStep >= step.id ? "text-medical-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    currentStep >= step.id
                      ? "border-medical-600 bg-medical-50"
                      : "border-gray-200"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="mt-2 text-xs">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="mb-3 h-10 w-10 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag
                      and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG or DOCX (MAX. 10MB)
                    </p>
                  </div>
                  <Input
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                  />
                </label>
              </div>
              {selectedFile && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-medium">Report Details</h3>
                <div className="space-y-2">
                  <Input
                    placeholder="Report Name"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-medium">Upload Status</h3>
                <p className="text-sm text-gray-500">
                  Report IPFS Hash: {reportHash}
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-medium">NFT Minting</h3>
                <p className="text-sm text-gray-500">
                  Metadata IPFS Hash: {metadataHash}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {currentStep === 1 && (
            <Button onClick={handleUploadReport} disabled={!selectedFile || loading}>
              {loading ? "Uploading..." : "Upload Report"}
            </Button>
          )}
          {currentStep === 2 && (
            <Button onClick={handleGenerateMetadata} disabled={!reportName}>
              Generate & Upload Metadata
            </Button>
          )}
          {currentStep === 4 && (
            <Button onClick={handleMintNFT} disabled={loading}>
              {loading ? "Minting..." : "Mint NFT"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
