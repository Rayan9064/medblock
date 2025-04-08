/**
 * @deprecated This component is no longer used as we now directly link to IPFS files.
 * The Pinata API returns JSON metadata which contains the original file link.
 * Keeping this file for reference in case we need to reimplement previewing functionality.
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ViewReportDialogProps {
  report: any;
  children: React.ReactNode;
}

export function ViewReportDialog({ report, children }: ViewReportDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-white/20 dark:border-gray-800/20">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="relative">
              <span className="absolute -inset-4 opacity-20 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 blur"></span>
              {report.reportName}
            </span>
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>By Dr. {report.doctorName}</span>
              <span>•</span>
              <span>{new Date(report.created_at).toLocaleDateString()}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="aspect-[16/9] overflow-hidden rounded-lg bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
            <iframe
              src={report.reportUrl}
              className="h-full w-full"
              title={report.reportName}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 rounded-lg bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 p-4">
              <h4 className="font-medium">Report Details</h4>
              <dl className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <dt>Report Type:</dt>
                  <dd>{report.reportType || "Medical Report"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Date Created:</dt>
                  <dd>{new Date(report.created_at).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Doctor:</dt>
                  <dd>{report.doctorName}</dd>
                </div>
              </dl>
            </div>
            
            <div className="space-y-2 rounded-lg bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 p-4">
              <h4 className="font-medium">Blockchain Info</h4>
              <dl className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <dt>IPFS Hash:</dt>
                  <dd className="truncate max-w-[180px]" title={report.ipfsHash}>
                    {report.ipfsHash}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Status:</dt>
                  <dd className="text-green-500">Verified</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
          >
            Close
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 text-white border-0"
          >
            <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;