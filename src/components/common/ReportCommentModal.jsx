import React from 'react';
import { X } from 'lucide-react';
import ReportComments from '../citizen/ReportComments';

const ReportCommentModal = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Komentar Warga</h2>
            <p className="text-sm text-gray-500 mt-1">{report.Drainage?.name || 'Drainase'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden relative">
          <ReportComments reportId={report.id} />
        </div>
      </div>
    </div>
  );
};

export default ReportCommentModal;
