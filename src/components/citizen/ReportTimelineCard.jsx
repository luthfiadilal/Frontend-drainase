import React from 'react';
import { CheckCircle2, Info, ChevronDown, ChevronUp } from 'lucide-react';

const ReportTimelineCard = ({ report, onViewDetail, onViewComments }) => {
  const isAdminAction = report.reporter_name.toLowerCase().includes('admin') || report.reporter_name.toLowerCase().includes('dinas');
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="relative pl-8 mb-4 last:mb-0">
      {/* Timeline Line */}
      <div className="absolute left-3.5 top-8 bottom-[-1rem] w-0.5 bg-gray-200 group-last:hidden"></div>
      
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-3 flex items-center justify-center w-7 h-7 rounded-full border-2 border-white shadow-sm z-10 ${isAdminAction ? 'bg-blue-500' : 'bg-gray-400'}`}>
        {isAdminAction ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Info className="w-3.5 h-3.5 text-white" />}
      </div>

      {/* Card Content */}
      <div className={`p-4 rounded-xl border shadow-sm transition-all ${isAdminAction ? 'bg-blue-50 border-blue-100 hover:border-blue-300' : 'bg-white border-gray-100 hover:border-gray-300'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1.5 sm:gap-0">
          <h4 className={`font-bold text-sm leading-tight ${isAdminAction ? 'text-blue-800' : 'text-gray-900'}`}>{report.reporter_name}</h4>
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block w-max">
            {formatDate(report.report_date)}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.notes || 'Melaporkan kondisi drainase terkini.'}</p>
        
        <div className="flex items-center justify-between text-xs font-semibold mt-3">
          <div>
            <span className="text-gray-500 mr-2">Status:</span>
            <span className={`${report.status_result === 'Danger' ? 'text-red-600' : report.status_result === 'Warning' ? 'text-yellow-600' : 'text-green-600'}`}>
              {report.status_result}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onViewComments} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer flex items-center">
              Komentar
            </button>
            <button onClick={onViewDetail} className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer flex items-center">
              Detail Skor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTimelineCard;
