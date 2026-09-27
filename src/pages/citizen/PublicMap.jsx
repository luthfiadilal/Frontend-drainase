import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axiosInstance from '../../api/axiosInstance';
import { AlertTriangle, Info, MapPin, CheckCircle2, Clock, Droplets, ArrowRight } from 'lucide-react';

const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const PublicMap = () => {
  const [drainages, setDrainages] = useState([]);
  const [regions, setRegions] = useState(null);
  const [selectedDrainage, setSelectedDrainage] = useState(null);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const [drRes, regRes] = await Promise.all([
        axiosInstance.get('/drainages'),
        axiosInstance.get('/regions')
      ]);
      if (drRes.data.success) setDrainages(drRes.data.data);
      if (regRes.data.success) setRegions(regRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDrainageReports = async (drainageId) => {
    try {
      const res = await axiosInstance.get('/drainage-reports');
      if (res.data.success) {
        // Filter in frontend or backend. Doing in frontend for simplicity since backend doesn't have drainage_id filter yet
        const filtered = res.data.data.filter(r => r.drainage_id === drainageId);
        setReports(filtered);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkerClick = (drainage) => {
    setSelectedDrainage(drainage);
    fetchDrainageReports(drainage.id);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const coordsToLatLng = (coords) => new L.LatLng(coords[0], coords[1]);

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row relative">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden absolute top-4 left-4 right-4 z-[1000] flex justify-between items-center bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mr-2 shadow-md">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-gray-900 text-sm">SI-Drainase</h1>
        </div>
        <button onClick={() => navigate('/login')} className="text-blue-600 text-xs font-semibold px-3 py-1.5 bg-blue-50 rounded-lg">
          Login Admin
        </button>
      </div>
      {/* Header Mobile / Title Overlay */}
      <div className="absolute top-4 right-4 z-[1000] hidden md:block">
        <button onClick={() => navigate('/login')} className="bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 text-sm font-medium py-2 px-4 rounded-xl shadow-sm border border-gray-200 transition-colors">
          Login Admin
        </button>
      </div>

      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 max-w-sm hidden md:block">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mr-3 shadow-md">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900">SI-Drainase Publik</h1>
            <p className="text-xs text-gray-500">Peta Interaktif Saluran Air & Laporan</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm"><div className="w-3 h-3 rounded-full bg-[#28A745] mr-2"></div> Aman (Clear)</div>
          <div className="flex items-center text-sm"><div className="w-3 h-3 rounded-full bg-[#FFC107] mr-2"></div> Waspada (Warning)</div>
          <div className="flex items-center text-sm"><div className="w-3 h-3 rounded-full bg-[#DC3545] mr-2"></div> Bahaya (Danger)</div>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative z-0 h-[50vh] md:h-full">
        <MapContainer center={[-7.3274, 108.2232]} zoom={13} style={{ width: '100%', height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {regions && (
            <GeoJSON 
              data={regions} 
              coordsToLatLng={coordsToLatLng}
              style={(feature) => ({
                fillColor: feature.properties.risk_color || '#3b82f6',
                weight: 2,
                opacity: 1,
                color: feature.properties.risk_color || '#94a3b8',
                dashArray: '3',
                fillOpacity: 0.15
              })}
            />
          )}

          {drainages.map(d => (
            <Marker 
              key={d.id} 
              position={[d.latitude, d.longitude]}
              icon={createCustomIcon(d.current_pin_color || '#6C757D')}
              eventHandlers={{ click: () => handleMarkerClick(d) }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Side Panel for Reports */}
      <div className={`w-full md:w-96 bg-white border-l border-gray-100 shadow-2xl flex flex-col transition-all duration-300 z-10 ${selectedDrainage ? 'h-[50vh] md:h-full' : 'hidden'}`}>
        {selectedDrainage && (
          <>
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedDrainage.name}</h2>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {selectedDrainage.address}
                </p>
              </div>
              <button onClick={() => setSelectedDrainage(null)} className="text-gray-400 hover:text-gray-600 font-bold p-2 bg-white rounded-lg shadow-sm border border-gray-100">&times;</button>
            </div>
            
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Status Terkini</h3>
              <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Skor Kerusakan</p>
                  <p className="text-2xl font-black text-gray-900">{selectedDrainage.current_total_score || '0.00'}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl font-bold text-sm ${selectedDrainage.current_condition_status === 'Danger' ? 'bg-red-100 text-red-700' : selectedDrainage.current_condition_status === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {selectedDrainage.current_condition_status || 'Clear'}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Berita / Riwayat Laporan</h3>
              
              {reports.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">Belum ada riwayat laporan untuk drainase ini.</p>
              ) : (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {reports.map((report) => {
                    const isAdminAction = report.reporter_name.toLowerCase().includes('admin') || report.reporter_name.toLowerCase().includes('dinas');
                    return (
                      <div key={report.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md ${isAdminAction ? 'bg-blue-500' : 'bg-gray-400'}`}>
                          {isAdminAction ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Info className="w-5 h-5 text-white" />}
                        </div>
                        <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm ${isAdminAction ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-bold text-sm ${isAdminAction ? 'text-blue-800' : 'text-gray-900'}`}>{report.reporter_name}</h4>
                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{formatDate(report.report_date)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{report.notes || 'Menyampaikan kondisi drainase terkini.'}</p>
                          <div className="flex items-center text-xs font-semibold">
                            <span className="text-gray-500 mr-2">Status Klasifikasi:</span>
                            <span className={`${report.status_result === 'Danger' ? 'text-red-600' : report.status_result === 'Warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                              {report.status_result}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
               <button onClick={() => navigate('/lapor', { state: { drainageId: selectedDrainage.id } })} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex justify-center items-center transition-colors shadow-lg shadow-blue-500/30">
                Buat Laporan Drainase Ini <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicMap;
