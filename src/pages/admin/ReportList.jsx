import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import { getReports } from '../../services/masterDataService';
import { AlertTriangle, Clock, MapPin, CheckCircle2, ChevronRight, Wrench } from 'lucide-react';
import ReportDetailModal from '../../components/common/ReportDetailModal';
import ReportActionModal from '../../components/common/ReportActionModal';

const ReportList = ({ dangerOnly = false }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionReport, setActionReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [dangerOnly]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReports(dangerOnly ? 'Danger' : '');
      if (res && res.success) {
        setReports(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const openDetail = (report) => {
    setSelectedReport(report);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {dangerOnly ? 'Penanganan Darurat (Danger)' : 'Semua Laporan Warga'}
          </h1>
          <p className="text-gray-500 mt-1">
            {dangerOnly ? 'Daftar saluran yang membutuhkan tindakan segera.' : 'Riwayat seluruh laporan kondisi saluran drainase.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat laporan...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">
          Belum ada laporan {dangerOnly ? 'kritis' : ''}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(report.status_result)}`}>
                    {report.status_result === 'Danger' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {report.status_result === 'Clear' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {report.status_result}
                  </span>
                </div>
                <div className="text-xs text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(report.report_date)}
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {report.Drainage?.name || 'Drainase Tidak Diketahui'}
              </h3>
              <p className="text-sm text-gray-500 flex items-start mb-4">
                <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-gray-400" />
                {report.Drainage?.address || '-'}
              </p>

              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
                <p className="text-gray-600 mb-1"><strong>Pelapor:</strong> {report.reporter_name}</p>
                <p className="text-gray-600"><strong>Catatan:</strong> {report.notes || 'Tidak ada catatan'}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-semibold text-gray-700">
                    Skor: {report.total_score ? (parseFloat(report.total_score) * 100).toFixed(2).replace(/\.00$/, '') + '%' : '0%'}
                  </span>
                  <button 
                    onClick={() => openDetail(report)}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                  >
                    Lihat Detail
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                {report.verification_status !== 'completed' && report.status_result !== 'Clear' && (
                  <button
                    onClick={() => setActionReport(report)}
                    className="w-full mt-2 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors px-3 py-2 rounded-lg"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Lakukan Perbaikan
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ReportDetailModal 
        report={selectedReport} 
        onClose={() => setSelectedReport(null)} 
      />
      
      <ReportActionModal
        report={actionReport}
        onClose={() => setActionReport(null)}
        onSuccess={() => {
          setActionReport(null);
          fetchReports();
        }}
      />
    </div>
  );
};

export default ReportList;
