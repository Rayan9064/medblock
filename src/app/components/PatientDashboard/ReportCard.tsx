import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { ViewReportDialog } from "./ViewReportDialog";

interface ReportCardProps {
  report: any;
  index: number;
}

export function ReportCard({ report, index }: ReportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 p-6 transition-all hover:bg-white/20 dark:hover:bg-gray-800/20"
    >
      <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-purple-600 via-pink-700 to-orange-300 opacity-50" />
      
      <div className="pl-4">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="font-medium truncate">{report.reportName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By Dr. {report.doctorName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(report.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <ViewReportDialog report={report}>
              <Button 
                variant="outline"
                className="flex-1 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            </ViewReportDialog>
            
            <Button
              variant="outline"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 text-white border-0"
              asChild
            >
              <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ReportCard;