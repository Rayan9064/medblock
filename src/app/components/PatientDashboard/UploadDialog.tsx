import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadMedicalReportForNFT } from "@/services/pinataService";

const DEFAULT_MEDICAL_IMAGE = "https://placehold.co/600x400?text=Medical+Report";
// These should be moved to environment variables in a production environment
const PATIENT_WALLET_ADDRESS = process.env.NEXT_PUBLIC_PATIENT_WALLET_ADDRESS || "GGJAXBBugajRsrovdqYiDtevoSo9RUwhJHTPUgUvTg3r";
const DOCTOR_WALLET_ADDRESS = process.env.NEXT_PUBLIC_DOCTOR_WALLET_ADDRESS || "5yKXzYKcZpyJzVxkmQLqwY9HEZ6YSBXdKiypzuuiKrXB";

interface ReportFormData {
  reportName: string;
  patientName: string;
  doctorName: string;
  reportType: string;
  reportDate: string;
}

export const UploadDialog = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReportFormData>({
    reportName: '',
    patientName: '',
    doctorName: '',
    reportType: '',
    reportDate: new Date().toISOString().split('T')[0],
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadReport = async () => {
    console.log("🚀 Starting medical report upload process");
    
    // Check for all required fields
    const requiredFields = {
      reportName: formData.reportName,
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      reportType: formData.reportType,
      reportDate: formData.reportDate,
      file: selectedFile
    };
    
    console.log("✅ Validating form fields:", Object.keys(requiredFields).map(k => `${k}: ${!!requiredFields[k as keyof typeof requiredFields]}`));
    
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key === 'file' ? 'Report File' : key.replace(/([A-Z])/g, ' $1').trim());
    
    if (missingFields.length > 0) {
      console.warn("❌ Missing required fields:", missingFields.join(', '));
      toast({ 
        title: "Missing Information", 
        description: `Please fill in all required fields: ${missingFields.join(', ')}` 
      });
      return;
    }

    if (!selectedFile) {
      return;
    }

    setUploading(true);

    try {
      // Upload medical report and get CIDs
      const uploadResult = await uploadMedicalReportForNFT(
        selectedFile,
        {
          reportName: formData.reportName,
          patientName: formData.patientName,
          doctorName: formData.doctorName,
          date: formData.reportDate,
          thumbnailUrl: DEFAULT_MEDICAL_IMAGE
        }
      );
      
      const { fileCID, metadataCID } = uploadResult;
      console.log(`✅ File uploaded to IPFS with CID: ${fileCID}`);
      console.log(`✅ Metadata uploaded to IPFS with CID: ${metadataCID}`);
      
      // Prepare metadata for NFT minting
      const metadata = {
        reportName: formData.reportName,
        patientName: formData.patientName,
        doctorName: formData.doctorName,
        reportType: formData.reportType,
        date: formData.reportDate,
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

      setIpfsHash(fileCID);
      toast({
        title: "Upload Successful",
        description: `Report uploaded securely and minted as NFT. View on Solana Explorer: ${data.explorerUrl}`,
      });

      // Reset form
      setFormData({
        reportName: '',
        patientName: '',
        doctorName: '',
        reportType: '',
        reportDate: new Date().toISOString().split('T')[0],
      });
      setSelectedFile(null);

    } catch (error: any) {
      console.error("❌ Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || 'An error occurred while processing the report',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Helper function to calculate file hash (optional)
  const calculateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-500 dark:to-pink-400 text-white dark:text-white hover:opacity-90"
        >
          <Upload className="h-5 w-5" />
          <span>New Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-900 w-[95vw] max-w-2xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">Upload New Report</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Fill in the report details and choose a file to upload.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Name</label>
              <Input 
                value={formData.reportName}
                onChange={(e) => setFormData(prev => ({ ...prev, reportName: e.target.value }))}
                placeholder="Annual Checkup Report"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Input 
                value={formData.reportType}
                onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value }))}
                placeholder="Blood Test"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Name</label>
              <Input 
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                placeholder="John Doe"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Doctor Name</label>
              <Input 
                value={formData.doctorName}
                onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                placeholder="Dr. Jane Smith"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Date</label>
              <Input 
                type="date"
                value={formData.reportDate}
                onChange={(e) => setFormData(prev => ({ ...prev, reportDate: e.target.value }))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload File</label>
              <Input 
                type="file" 
                onChange={handleFileChange} 
                accept=".pdf,.doc,.docx"
                className="w-full" 
              />
              {selectedFile && (
                <p className="text-sm text-gray-500 truncate">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:flex-row gap-4">
          <Button
            onClick={handleUploadReport}
            disabled={uploading || !selectedFile || !formData.reportName}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
          >
            {uploading ? (
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
                Upload Report
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;