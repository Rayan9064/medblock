import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download } from "lucide-react";

interface ReportCardProps {
  report: {
    name?: string;
    created_at: number;
    reportName?: string;
    patientName?: string;
    doctorName?: string;
    reportType?: string;
    reportDate?: string;
    [key: string]: string | number | boolean | undefined;
  };
  index: number;
  onView: (index: number) => void;
  onDownload: (index: number) => void;
}

export const ReportCard = ({ report, index, onView, onDownload }: ReportCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:scale-105 transition-all"
    >
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <div className="rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-4">
          <FileText className="h-8 w-8 text-purple-600 dark:text-purple-300" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {report.reportName || report.name || `Medical Report #${index + 1}`}
        </h3>
        
        <div className="space-y-1">
          {report.patientName && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Patient: {report.patientName}
            </p>
          )}
          {report.doctorName && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Doctor: {report.doctorName}
            </p>
          )}
          {report.reportType && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Type: {report.reportType}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created: {new Date(report.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(index)}
            className="border-gray-200 dark:border-gray-800"
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(index)}
            className="border-gray-200 dark:border-gray-800"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;