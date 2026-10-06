import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import RegionMap from '../../components/map/RegionMap';
import { Activity, Map as MapIcon, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
import { getDrainages, getReports } from '../../services/masterDataService';
import { io } from 'socket.io-client';
import axiosInstance from '../../api/axiosInstance';
import ReportTimelineCard from '../../components/citizen/ReportTimelineCard';
import ReportDetailModal from '../../components/common/ReportDetailModal';
import ReportCommentModal from '../../components/common/ReportCommentModal';
const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm flex items-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-default min-w-[130px] flex-1">
    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl flex items-center justify-center mr-2.5 sm:mr-4 shrink-0 ${bgColorClass}`}>
      <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${colorClass}`} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 truncate">{title}</p>
      <h4 className="text-base sm:text-2xl font-extrabold text-gray-900 truncate leading-none">{value}</h4>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, danger: 0, safe: 0, newReports: 5 });
  const [reports, setReports] = useState([]);

  // Interactive Map States
  const [selectedDrainage, setSelectedDrainage] = useState(null);
  const [selectedDrainageReports, setSelectedDrainageReports] = useState([]);
  const [detailReport, setDetailReport] = useState(null);
  const [commentReport, setCommentReport] = useState(null);

  const handleMarkerClick = async (drainage) => {
    setSelectedDrainage(drainage);
    try {
      const res = await axiosInstance.get('/drainage-reports');
      if (res.data.success) {
        const filtered = res.data.data.filter(r => r.drainage_id === drainage.id);
        setSelectedDrainageReports(filtered);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Fetch drainages for stats
    getDrainages()
      .then(res => {
        if(res && res.success) {
          const drainages = res.data;
          const total = drainages.length;
          const danger = drainages.filter(d => d.current_condition_status === 'Danger').length;
          const safe = drainages.filter(d => !d.current_condition_status || d.current_condition_status === 'Clear').length;
          setStats(prev => ({ ...prev, total, danger, safe }));
          setReports(drainages.slice(0, 4));
        }
      }).catch(err => console.error(err));

    // Fetch reports for new reports stats
    getReports()
      .then(res => {
        if(res && res.success) {
          const newReports = res.data.filter(r => r.verification_status === 'pending' || !r.verification_status).length;
          setStats(prev => ({ ...prev, newReports }));
        }
      }).catch(err => console.error(err));

    // Listen for socket events to update stats dynamically
    const socketUrl = import.meta.env.VITE_WS_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000");
    const socket = io(socketUrl, { transports: ['websocket'] });

    socket.on("new_report", (data) => {
      // Re-fetch drainages and reports silently to update stats perfectly without page refresh
      getDrainages().then(res => {
        if(res && res.success) {
          const drainages = res.data;
          const total = drainages.length;
          const danger = drainages.filter(d => d.current_condition_status === 'Danger' || d.current_condition_status === 'Bahaya').length;
          const safe = drainages.filter(d => !d.current_condition_status || d.current_condition_status === 'Clear' || d.current_condition_status === 'Aman').length;
          setStats(prev => ({ ...prev, total, danger, safe }));
          setReports(drainages.slice(0, 4));
        }
      });
      getReports().then(res => {
        if(res && res.success) {
          const newReports = res.data.filter(r => r.verification_status === 'pending' || !r.verification_status).length;
          setStats(prev => ({ ...prev, newReports }));
        }
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Pemetaan Drainase Terintegrasi GIS</p>
        </div>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="snap-start shrink-0 w-[42%] sm:w-auto sm:flex-1 flex"><StatCard title="Total Drainase" value={stats.total} icon={MapIcon} colorClass="text-blue-600" bgColorClass="bg-blue-50" /></div>
        <div className="snap-start shrink-0 w-[42%] sm:w-auto sm:flex-1 flex"><StatCard title="Laporan Baru" value={stats.newReports} icon={Activity} colorClass="text-purple-600" bgColorClass="bg-purple-50" /></div>
        <div className="snap-start shrink-0 w-[42%] sm:w-auto sm:flex-1 flex"><StatCard title="Status Bahaya" value={stats.danger} icon={AlertTriangle} colorClass="text-red-600" bgColorClass="bg-red-50" /></div>
        <div className="snap-start shrink-0 w-[42%] sm:w-auto sm:flex-1 flex"><StatCard title="Status Aman" value={stats.safe} icon={CheckCircle2} colorClass="text-green-600" bgColorClass="bg-green-50" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 -mx-4 md:mx-0">
          <Card title="Peta Sebaran Wilayah & Kondisi" className="h-[500px] md:h-[600px] border-x-0 md:border-x rounded-none md:rounded-2xl shadow-none md:shadow-sm" bodyClassName="p-0 md:p-4 relative flex-1 flex flex-col">
            <div className="w-full h-full flex-1 relative z-0 md:rounded-xl overflow-hidden md:border border-gray-100 shadow-inner md:shadow-sm">
              <RegionMap onMarkerClick={handleMarkerClick} />
            </div>
          </Card>
        </div>
        
        {/* Desktop Detail Card */}
        {selectedDrainage && (
          <div className="hidden lg:block">
            <Card title="Detail Drainase" className="h-[600px] flex flex-col" bodyClassName="p-0 flex-1 flex flex-col overflow-hidden relative">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedDrainage.name}</h2>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {selectedDrainage.address}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDrainage(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold p-1.5 bg-white rounded-md shadow-sm border border-gray-100"
                >
                  &times;
                </button>
              </div>
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wider">Status Terkini</h3>
                <div className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                  <div>
                    <p className="text-[11px] text-gray-500 mb-1">Tingkat kesehatan</p>
                    <p className="text-xl font-black text-gray-900">
                      {selectedDrainage.current_total_score
                        ? (parseFloat(selectedDrainage.current_total_score) <= 1
                            ? (parseFloat(selectedDrainage.current_total_score) * 100).toFixed(1).replace(/\.0$/, "")
                            : parseFloat(selectedDrainage.current_total_score).toFixed(1).replace(/\.0$/, "")) + "%"
                        : "0%"}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg font-bold text-xs ${selectedDrainage.current_condition_status === "Danger" ? "bg-red-100 text-red-700" : selectedDrainage.current_condition_status === "Warning" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {selectedDrainage.current_condition_status || "Clear"}
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">Riwayat Laporan</h3>
                {selectedDrainageReports.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-6">Belum ada riwayat laporan.</p>
                ) : (
                  <div className="relative pt-1 space-y-3">
                    {selectedDrainageReports.map((report) => (
                      <ReportTimelineCard
                        key={report.id}
                        report={report}
                        onViewDetail={() => setDetailReport(report)}
                        onViewComments={() => setCommentReport(report)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
        
        {/* List Card (Hidden on Desktop if selected) */}
        <div className={selectedDrainage ? "block lg:hidden" : "block"}>
          <Card title="Drainase Terdaftar" className="h-[500px] md:h-[600px] flex flex-col" bodyClassName="p-4 flex-1 overflow-y-auto">
            <div className="space-y-4">
                {reports.map((item, i) => {
                  const isDanger = item.current_condition_status === 'Danger';
                  const isWarning = item.current_condition_status === 'Warning';
                  const bgClass = isDanger ? 'bg-red-50' : isWarning ? 'bg-yellow-50' : 'bg-emerald-50';
                  const iconColor = isDanger ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-emerald-600';
                  const IconComp = isDanger || isWarning ? AlertTriangle : CheckCircle2;
                  
                  return (
                    <div key={item.id || i} onClick={() => handleMarkerClick(item)} className="flex items-start p-3 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                    <div className={`w-10 h-10 rounded-full ${bgClass} flex-shrink-0 flex items-center justify-center mr-3`}>
                      <IconComp className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-gray-800">{item.name}</h5>
                      <p className="text-xs text-gray-500 mt-1">{item.type || 'Drainase'} • Status: <span className={`font-medium ${iconColor}`}>{item.current_condition_status || 'Clear'}</span></p>
                    </div>
                  </div>
                );
              })}
              {reports.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Belum ada data.</p>}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Mobile Detail Modal */}
      {selectedDrainage && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-gray-900/50 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="bg-white w-full max-h-[85vh] rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-start sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedDrainage.name}</h2>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {selectedDrainage.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedDrainage(null)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1.5 bg-white rounded-md shadow-sm border border-gray-100"
              >
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wider">Status Terkini</h3>
              <div className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-lg shadow-sm mb-6">
                <div>
                  <p className="text-[11px] text-gray-500 mb-1">Tingkat kesehatan</p>
                  <p className="text-xl font-black text-gray-900">
                    {selectedDrainage.current_total_score
                      ? (parseFloat(selectedDrainage.current_total_score) <= 1
                          ? (parseFloat(selectedDrainage.current_total_score) * 100).toFixed(1).replace(/\.0$/, "")
                          : parseFloat(selectedDrainage.current_total_score).toFixed(1).replace(/\.0$/, "")) + "%"
                      : "0%"}
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg font-bold text-xs ${selectedDrainage.current_condition_status === "Danger" ? "bg-red-100 text-red-700" : selectedDrainage.current_condition_status === "Warning" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                  {selectedDrainage.current_condition_status || "Clear"}
                </div>
              </div>

              <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">Riwayat Laporan</h3>
              {selectedDrainageReports.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">Belum ada riwayat laporan.</p>
              ) : (
                <div className="relative pt-1 space-y-3">
                  {selectedDrainageReports.map((report) => (
                    <ReportTimelineCard
                      key={report.id}
                      report={report}
                      onViewDetail={() => setDetailReport(report)}
                      onViewComments={() => setCommentReport(report)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ReportDetailModal 
        report={detailReport} 
        onClose={() => setDetailReport(null)} 
      />
      <ReportCommentModal 
        report={commentReport}
        onClose={() => setCommentReport(null)}
      />
    </div>
  );
};

export default Dashboard;