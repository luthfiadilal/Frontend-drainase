import React from 'react';
import { CheckCircle2, Info, ChevronDown, ChevronUp } from 'lucide-react';

const ReportTimelineCard = ({ report, isExpanded, onToggle }) => {
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
      <div 
        className={`p-4 rounded-xl border shadow-sm transition-all cursor-pointer ${isAdminAction ? 'bg-blue-50 border-blue-100 hover:border-blue-300' : 'bg-white border-gray-100 hover:border-gray-300'}`}
        onClick={onToggle}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1.5 sm:gap-0">
          <h4 className={`font-bold text-sm leading-tight ${isAdminAction ? 'text-blue-800' : 'text-gray-900'}`}>{report.reporter_name}</h4>
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block w-max">
            {formatDate(report.report_date)}
          </span>
        </div>
        
        <p className={`text-sm text-gray-600 mb-3 ${!isExpanded ? 'line-clamp-2' : ''}`}>{report.notes || 'Melaporkan kondisi drainase terkini.'}</p>
        
        <div className="flex items-center justify-between text-xs font-semibold">
          <div>
            <span className="text-gray-500 mr-2">Status:</span>
            <span className={`${report.status_result === 'Danger' ? 'text-red-600' : report.status_result === 'Warning' ? 'text-yellow-600' : 'text-green-600'}`}>
              {report.status_result}
            </span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300 cursor-default" onClick={e => e.stopPropagation()}>
            
            {/* Show images if any */}
            {report.DrainageReportImages && report.DrainageReportImages.length > 0 && (
              <div className="mb-4">
                <h5 className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Foto Kondisi</h5>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {report.DrainageReportImages.map(img => (
                    <img key={img.id} src={`http://localhost:5000${img.image_url}`} alt="Bukti" className="h-24 w-24 object-cover rounded-lg border border-gray-200 shrink-0" />
                  ))}
                </div>
              </div>
            )}

            <h5 className="text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-wider">Rincian Penilaian</h5>
            
            {/* Group items by Aspect */}
            {(() => {
              const aspectGroups = {};
              if (report.DrainageReportItems) {
                report.DrainageReportItems.forEach(item => {
                  if (!item.Indicator) return;
                  const aspectName = item.Indicator.Aspect?.name || 'Aspek Umum';
                  if (!aspectGroups[aspectName]) aspectGroups[aspectName] = [];
                  
                  const option = item.Indicator.IndicatorOptions?.find(opt => opt.score === item.selected_score);
                  
                  aspectGroups[aspectName].push({
                    indicatorName: item.Indicator.name,
                    calcValue: parseFloat(item.calculated_value),
                    desc: option ? option.description : ''
                  });
                });
              }

              const groupKeys = Object.keys(aspectGroups);
              if (groupKeys.length === 0) return <p className="text-xs text-gray-400 italic">Detail tidak tersedia.</p>;

              return groupKeys.map((aspectName, idx) => (
                <div key={idx} className="mb-3 last:mb-0 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <h6 className="font-semibold text-xs text-blue-800 mb-2">{aspectName}</h6>
                  <div className="space-y-2.5">
                    {aspectGroups[aspectName].map((ind, i) => {
                      let percentStr = '';
                      if (!isNaN(ind.calcValue)) {
                        percentStr = (ind.calcValue * 100).toFixed(1).replace(/\.0$/, '') + '%';
                      }
                      
                      return (
                        <div key={i} className="text-xs border-b border-gray-200/50 last:border-0 pb-2 last:pb-0">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <span className="font-medium text-gray-700 flex-1 leading-tight">{ind.indicatorName}</span>
                            <span className="font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 bg-blue-100 text-blue-700">
                              {percentStr}
                            </span>
                          </div>
                          {ind.desc && <p className="text-gray-500 italic text-[10px] leading-tight">{ind.desc}</p>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportTimelineCard;
