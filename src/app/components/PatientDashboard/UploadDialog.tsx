import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadMedicalReportForNFT } from "@/services/pinataService";

const DEFAULT_MEDICAL_IMAGE = "https://placehold.co/600x400?text=Medical+Report";
const PATIENT_NAME = "John Doe"; // This should come from user profile in a real app
// These should be moved to environment variables in a production environment
const PATIENT_WALLET_ADDRESS = process.env.NEXT_PUBLIC_PATIENT_WALLET_ADDRESS || "GGJAXBBugajRsrovdqYiDtevoSo9RUwhJHTPUgUvTg3r";
const DOCTOR_WALLET_ADDRESS = process.env.NEXT_PUBLIC_DOCTOR_WALLET_ADDRESS || "5yKXzYKcZpyJzVxkmQLqwY9HEZ6YSBXdKiypzuuiKrXB";

interface UploadDialogProps {
  onUploadSuccess: () => void;
}

export function UploadDialog({ onUploadSuccess }: UploadDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [reportName, setReportName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reportDate, setReportDate] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      // Check for all required fields
      const requiredFields = {
        reportName,
        doctorName,
        reportDate,
        file
      };
      
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key === 'file' ? 'Report File' : key.replace(/([A-Z])/g, ' $1').trim());
      
      if (missingFields.length > 0) {
        toast({ 
          title: "Missing Information", 
          description: `Please fill in all required fields: ${missingFields.join(', ')}` 
        });
        return;
      }

      // Upload medical report and get CIDs
      const uploadResult = await uploadMedicalReportForNFT(
        file,
        {
          patientName: PATIENT_NAME,
          reportName,
          doctorName,
          date: reportDate,
          thumbnailUrl: DEFAULT_MEDICAL_IMAGE
        }
      );
      
      const { fileCID, metadataCID } = uploadResult;
      
      // Prepare metadata for NFT minting
      const metadata = {
        reportName,
        doctorName,
        date: reportDate,
        created_at: Date.now(),
        patientAddress: PATIENT_WALLET_ADDRESS,
        doctorAddress: DOCTOR_WALLET_ADDRESS,
        imageUrl: DEFAULT_MEDICAL_IMAGE,
        reportUrl: `https://gateway.pinata.cloud/ipfs/${fileCID}`,
        ipfsHash: fileCID,
        metadataCID: metadataCID,
        isPrivate: true
      };

      // Call API to mint NFT
      const response = await fetch('/api/solana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mint NFT');
      }

      toast({
        title: "Success",
        description: "Medical report uploaded successfully",
      });
      
      setOpen(false);
      onUploadSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload medical report",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 text-white border-0"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Report
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-white/20 dark:border-gray-800/20">
        <DialogHeader>
          <DialogTitle>Upload Medical Report</DialogTitle>
          <DialogDescription>
            Upload your medical report securely to the blockchain
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reportName">Report Name</label>
              <Input
                id="reportName"
                placeholder="Enter report name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="doctorName">Doctor Name</label>
              <Input
                id="doctorName"
                placeholder="Enter doctor's name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reportDate">Report Date</label>
              <Input
                id="reportDate"
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="file">Report File</label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isUploading || !file}
              className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 text-white border-0"
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDialog;