import React from 'react';
import { X, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const ReportDetailModal = ({ report, onClose }) => {
  if (!report) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusStyle = (status) => {
    if (status === 'Danger') return 'bg-red-100 text-red-800 border-red-200';
    if (status === 'Warning') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Detail Laporan</h2>
            <p className="text-sm text-gray-500 mt-1">{report.Drainage?.name || 'Drainase'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          <div className="bg-white p-5 rounded-xl border border-gray-100 mb-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(report.status_result)}`}>
                  {report.status_result === 'Danger' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {report.status_result === 'Clear' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {report.status_result}
                </span>
              </div>
              <div className="text-xs text-gray-400 flex items-center bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(report.report_date)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1 uppercase font-semibold tracking-wider">Pelapor</p>
                <p className="font-medium text-gray-900">{report.reporter_name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1 uppercase font-semibold tracking-wider">Total Skor</p>
                <p className="font-bold text-blue-600 text-lg">
                  {report.total_score ? (parseFloat(report.total_score) * 100).toFixed(2).replace(/\.00$/, '') + '%' : '0%'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-xs mb-1 uppercase font-semibold tracking-wider">Catatan</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{report.notes || 'Tidak ada catatan'}</p>
              </div>
            </div>
          </div>

          {report.DrainageReportImages && report.DrainageReportImages.length > 0 && (
            <div className="mb-6">
              <h5 className="text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center">
                <div className="h-px bg-gray-200 flex-1 mr-3"></div>
                Foto Kondisi ({report.DrainageReportImages.length})
                <div className="h-px bg-gray-200 flex-1 ml-3"></div>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {report.DrainageReportImages.map(img => (
                  <div key={img.id} className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                    <img src={`http://localhost:5000${img.image_url}`} alt="Bukti" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h5 className="text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center">
              <div className="h-px bg-gray-200 flex-1 mr-3"></div>
              Rincian Penilaian
              <div className="h-px bg-gray-200 flex-1 ml-3"></div>
            </h5>
            
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
              if (groupKeys.length === 0) return <p className="text-sm text-gray-400 italic text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">Detail penilaian tidak tersedia.</p>;

              return groupKeys.map((aspectName, idx) => (
                <div key={idx} className="mb-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h6 className="font-bold text-sm text-blue-800 mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                    {aspectName}
                  </h6>
                  <div className="space-y-3">
                    {aspectGroups[aspectName].map((ind, i) => {
                      let percentStr = '';
                      if (!isNaN(ind.calcValue)) {
                        percentStr = (ind.calcValue * 100).toFixed(1).replace(/\.0$/, '') + '%';
                      }
                      
                      return (
                        <div key={i} className="text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex justify-between items-start gap-3">
                            <span className="font-semibold text-gray-800 flex-1">{ind.indicatorName}</span>
                            <span className="font-bold px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700 whitespace-nowrap shadow-sm">
                              {percentStr}
                            </span>
                          </div>
                          {ind.desc && <p className="text-gray-500 mt-1.5 text-xs">{ind.desc}</p>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end bg-white shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
