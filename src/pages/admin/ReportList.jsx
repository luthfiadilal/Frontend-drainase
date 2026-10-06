import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import { getReports } from '../../services/masterDataService';
import axiosInstance from '../../api/axiosInstance';
import { AlertTriangle, Clock, MapPin, CheckCircle2, ChevronRight, Wrench, Filter } from 'lucide-react';
import ReportDetailModal from '../../components/common/ReportDetailModal';
import ReportActionModal from '../../components/common/ReportActionModal';
import CustomDatePicker from '../../components/common/CustomDatePicker';

const ReportList = ({ dangerOnly = false }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionReport, setActionReport] = useState(null);
  
  // Filter States
  const [drainages, setDrainages] = useState([]);
  const [filterDrainage, setFilterDrainage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchDrainages();
  }, [dangerOnly]);

  const fetchDrainages = async () => {
    try {
      const res = await axiosInstance.get('/drainages');
      if (res.data.success) {
        setDrainages(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const getVerificationBadge = (status) => {
    switch(status) {
      case 'verified': return <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-bold rounded-md tracking-wider">Verified</span>;
      case 'rejected': return <span className="inline-flex px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[10px] uppercase font-bold rounded-md tracking-wider">Rejected</span>;
      case 'in_progress': return <span className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] uppercase font-bold rounded-md tracking-wider">In Progress</span>;
      case 'completed': return <span className="inline-flex px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] uppercase font-bold rounded-md tracking-wider">Completed</span>;
      default: return <span className="inline-flex px-2 py-0.5 bg-gray-50 text-gray-600 border border-gray-200 text-[10px] uppercase font-bold rounded-md tracking-wider">Pending</span>;
    }
  };

  const openDetail = (report) => {
    setSelectedReport(report);
  };

  const filteredReports = reports.filter(report => {
    const matchDrainage = filterDrainage === 'all' || report.drainage_id === parseInt(filterDrainage);
    const matchStatus = filterStatus === 'all' || report.status_result === filterStatus;
    
    let matchTime = true;
    if (filterStartDate && filterEndDate) {
      const reportDate = new Date(report.report_date);
      const start = new Date(filterStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(filterEndDate);
      end.setHours(23, 59, 59, 999);
      matchTime = reportDate >= start && reportDate <= end;
    }
    
    return matchDrainage && matchStatus && matchTime;
  });

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

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-5 items-center mb-6">
        <div className="flex items-center gap-2 text-gray-700 font-semibold md:pr-4 md:border-r border-gray-100">
          <Filter className="w-5 h-5 text-blue-600" />
          <span>Filter</span>
        </div>
        <div className="w-full sm:flex-1">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Lokasi Drainase</label>
          <select 
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer outline-none text-sm font-medium"
            value={filterDrainage}
            onChange={(e) => setFilterDrainage(e.target.value)}
          >
            <option value="all">Semua Saluran</option>
            {drainages.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        
        {!dangerOnly && (
          <div className="w-full sm:flex-1">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status Kondisi</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer outline-none text-sm font-medium"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="Clear">🟢 Aman (Clear)</option>
              <option value="Warning">🟡 Waspada (Warning)</option>
              <option value="Danger">🔴 Bahaya (Danger)</option>
            </select>
          </div>
        )}

        <div className="w-full sm:flex-1 relative">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Waktu Laporan</label>
          <CustomDatePicker 
            startDate={filterStartDate}
            endDate={filterEndDate}
            onChange={(start, end) => {
              setFilterStartDate(start);
              setFilterEndDate(end);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat laporan...</div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">
          Tidak ada laporan yang sesuai dengan filter yang dipilih.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1.5 items-start">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(report.status_result)}`}>
                    {report.status_result === 'Danger' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {report.status_result === 'Clear' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {report.status_result}
                  </span>
                  <div className="flex items-center mt-1.5">
                    {getVerificationBadge(report.verification_status || 'pending')}
                  </div>
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
        onUpdate={() => {
          fetchReports();
        }}
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
