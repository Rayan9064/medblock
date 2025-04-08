/**
 * @deprecated This component is no longer used as we now directly link to IPFS files.
 * The Pinata API returns JSON metadata which contains the original file link.
 * Keeping this file for reference in case we need to reimplement previewing functionality.
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ViewReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    name?: string;
    created_at: number;
    reportName?: string;
    patientName?: string;
    doctorName?: string;
    reportType?: string;
    reportDate?: string;
    reportUrl?: string;
    ipfsHash?: string;  // CID of the file on IPFS
    [key: string]: string | number | boolean | undefined;
  } | null;
}

export function ViewReportDialog({ isOpen, onClose, report }: ViewReportDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);

  // Function to fetch the file using our Pinata API route
  const fetchFile = async (ipfsHash: string) => {
    console.log("Fetching file with CID:", ipfsHash);
    
    try {
      const response = await fetch(`/api/pinata?ipfsHash=${ipfsHash}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch file from Pinata API");
      }

      const contentType = response.headers.get('Content-Type');
      const blob = await response.blob();
      
      // Use the content type from the response, or fall back to application/pdf
      const typedBlob = new Blob([blob], { type: contentType || 'application/pdf' });
      const blobUrl = URL.createObjectURL(typedBlob);
      
      console.log("File fetched successfully, created blob URL:", blobUrl);
      console.log("Content-Type:", contentType);
      
      return { blob: typedBlob, url: blobUrl };
    } catch (error) {
      console.error("Error fetching file:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Reset state when dialog opens with a new report
    if (isOpen && report) {
      setIsLoading(true);
      setError(null);
      setFileUrl(null);
      setFileBlob(null);
      
      const loadReport = async () => {
        try {
          if (!report.ipfsHash && !report.reportUrl) {
            throw new Error("No IPFS hash or URL available for this report");
          }
          
          console.log("Report details:", { 
            name: report.reportName,
            ipfsHash: report.ipfsHash,
            url: report.reportUrl
          });
          
          // If we have an IPFS hash, fetch from gateway
          if (report.ipfsHash) {
            const { blob, url } = await fetchFile(report.ipfsHash);
            setFileBlob(blob);
            setFileUrl(url);
          } 
          // Otherwise, use the reportUrl directly (legacy support)
          else if (report.reportUrl) {
            console.log("Using direct report URL");
            const response = await fetch(report.reportUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            setFileUrl(blobUrl);
            setFileBlob(blob);
          }
          
          setIsLoading(false);
        } catch (err) {
          console.error("Failed to load report:", err);
          setError(err instanceof Error ? err.message : "Could not load the report. Please try again later.");
          setIsLoading(false);
        }
      };
      
      loadReport();
      
      // Cleanup blob URL when component unmounts or dialog closes
      return () => {
        if (fileUrl && fileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(fileUrl);
        }
      };
    }
  }, [isOpen, report]);

  const handleDownload = async () => {
    if (!report) return;
    
    try {
      if (fileBlob) {
        const downloadUrl = URL.createObjectURL(fileBlob);
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
          title: "Download Started",
          description: "Your report is being downloaded",
        });
      } else if (report.ipfsHash) {
        setIsLoading(true);
        
        try {
          const { blob } = await fetchFile(report.ipfsHash);
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = report.reportName || 'medical-report';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          setTimeout(() => {
            URL.revokeObjectURL(downloadUrl);
          }, 100);
          
          toast({
            title: "Download Started",
            description: "Your report is being downloaded",
          });
        } catch (err) {
          console.error("Failed to download file:", err);
          toast({
            title: "Download Failed",
            description: "Could not download the file",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        toast({
          title: "Download Failed",
          description: "No file information available",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Failed to download report:", err);
      toast({
        title: "Download Failed",
        description: "Could not download the report",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white dark:bg-gray-900 w-[95vw] max-w-4xl h-[80vh] max-h-[800px] mx-auto flex flex-col">
        <DialogHeader className="flex flex-row justify-between items-center">
          <div>
            <DialogTitle className="text-xl sm:text-2xl">
              {report?.reportName || report?.name || "Medical Report"}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {report ? (
                <span>
                  {report.reportType && `Type: ${report.reportType} • `}
                  Created: {new Date(report.created_at).toLocaleDateString()}
                </span>
              ) : (
                "Loading report details..."
              )}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto my-4 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading medical report...</p>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center p-4">
              <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-center text-red-600 dark:text-red-400">{error}</p>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                The report may be unavailable or you may not have permission to access it.
              </p>
            </div>
          ) : fileUrl ? (
            <div className="h-full relative">
              {fileBlob?.type?.includes('image') ? (
                // Image viewer for image files
                <img 
                  src={fileUrl} 
                  alt={report?.reportName || "Medical Report"}
                  className="max-w-full max-h-full object-contain mx-auto" 
                />
              ) : fileBlob?.type?.includes('pdf') ? (
                // PDF viewer using object tag with iframe fallback
                <object 
                  data={fileUrl} 
                  type="application/pdf"
                  className="w-full h-full" 
                >
                  <p className="text-center p-4">
                    Your browser doesn't support direct PDF viewing.
                    <Button 
                      onClick={handleDownload} 
                      className="ml-2"
                      variant="outline"
                    >
                      Download instead
                    </Button>
                  </p>
                </object>
              ) : (
                // Fallback for other file types
                <div className="flex flex-col items-center justify-center h-full">
                  <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    This file type ({fileBlob?.type}) cannot be previewed directly.
                  </p>
                  <Button 
                    onClick={handleDownload} 
                    className="mt-4"
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download to view
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-4">
              <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-center text-gray-600 dark:text-gray-400">
                Preview not available for this report format.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {report?.patientName && <p>Patient: {report.patientName}</p>}
            {report?.doctorName && <p>Doctor: {report.doctorName}</p>}
          </div>
          <Button onClick={handleDownload} disabled={isLoading || !report?.ipfsHash && !report?.reportUrl}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;