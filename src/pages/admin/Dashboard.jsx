import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import RegionMap from '../../components/map/RegionMap';
import { Activity, Map as MapIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-default">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 ${bgColorClass}`}>
      <Icon className={`w-7 h-7 ${colorClass}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h4 className="text-2xl font-extrabold text-gray-900">{value}</h4>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, danger: 0, safe: 0, newReports: 5 });
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch drainages for stats
    axiosInstance.get('/drainages')
      .then(res => {
        if(res.data.success) {
          const drainages = res.data.data;
          const total = drainages.length;
          const danger = drainages.filter(d => d.status === 'Danger').length;
          const safe = drainages.filter(d => d.status === 'Safe').length;
          setStats(prev => ({ ...prev, total, danger, safe }));
          setReports(drainages.slice(0, 4));
        }
      }).catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Pemetaan Drainase Terintegrasi GIS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Drainase" value={stats.total} icon={MapIcon} colorClass="text-blue-600" bgColorClass="bg-blue-50" />
        <StatCard title="Laporan Baru" value={stats.newReports} icon={Activity} colorClass="text-purple-600" bgColorClass="bg-purple-50" />
        <StatCard title="Status Bahaya" value={stats.danger} icon={AlertTriangle} colorClass="text-red-600" bgColorClass="bg-red-50" />
        <StatCard title="Status Aman" value={stats.safe} icon={CheckCircle2} colorClass="text-green-600" bgColorClass="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2">
          <Card title="Peta Sebaran Wilayah & Kondisi" className="h-[450px] flex flex-col p-0">
            <div className="w-full h-full flex-1 relative z-0">
              <RegionMap />
            </div>
          </Card>
        </div>
        <div>
          <Card title="Drainase Terdaftar">
            <div className="space-y-4">
              {reports.map((item, i) => (
                <div key={item.id || i} className="flex items-start p-3 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                  <div className={`w-10 h-10 rounded-full ${item.status === 'Danger' ? 'bg-red-100' : 'bg-blue-100'} flex-shrink-0 flex items-center justify-center mr-3`}>
                    {item.status === 'Danger' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800">{item.name}</h5>
                    <p className="text-xs text-gray-500 mt-1">{item.type} • Status: {item.status}</p>
                  </div>
                </div>
              ))}
              {reports.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Belum ada data.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;