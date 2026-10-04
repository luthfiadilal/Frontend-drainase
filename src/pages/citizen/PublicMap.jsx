import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client";
import axiosInstance from "../../api/axiosInstance";
import {
  AlertTriangle,
  Info,
  MapPin,
  CheckCircle2,
  Clock,
  Droplets,
  ArrowRight,
} from "lucide-react";
import logoLight from "../../assets/images/LOGO-DRAINASE2.jpg";
import ReportTimelineCard from "../../components/citizen/ReportTimelineCard";
import ReportDetailModal from "../../components/common/ReportDetailModal";
import ReportCommentModal from "../../components/common/ReportCommentModal";
import alertSoundFile from "../../assets/sound-effect/mixkit-software-interface-start-2574.wav";
import infoSoundFile from "../../assets/sound-effect/mixkit-digital-quick-tone-2866.wav";

const createCustomIcon = (color, isDanger = false) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        ${isDanger ? `<div class="animate-ping absolute inset-0 rounded-full" style="background-color: ${color}; opacity: 0.75;"></div>` : ''}
        <div class="relative z-10" style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const PublicMap = () => {
  const [drainages, setDrainages] = useState([]);
  const [regions, setRegions] = useState(null);
  const [selectedDrainage, setSelectedDrainage] = useState(null);
  const [reports, setReports] = useState([]);
  const [detailReport, setDetailReport] = useState(null);
  const [commentReport, setCommentReport] = useState(null);
  const [dangerDrainageId, setDangerDrainageId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [infoToastMessage, setInfoToastMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMapData();

    // Socket connection for Danger alerts
    const socketUrl = import.meta.env.VITE_WS_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000");
    const socket = io(socketUrl, {
      transports: ['websocket']
    });
    socket.on("danger_report", (data) => {
      const audio = new Audio(alertSoundFile);
      audio.play().catch(err => console.error('Audio play failed:', err));

      setToastMessage(data.message);
      setDangerDrainageId(data.drainageId);
      
      // Secara instan ubah warna pin di map menjadi merah (Danger)
      setDrainages(prev => prev.map(d => 
        d.id === data.drainageId 
          ? { ...d, current_pin_color: "#DC3545", current_condition_status: "Danger" }
          : d
      ));

      // Auto-hide alert and pulse after 6 seconds
      setTimeout(() => {
        setToastMessage('');
        setDangerDrainageId(null);
      }, 6000);
    });

    socket.on("new_report", (data) => {
      // Don't play info sound if it's Danger (danger_report handles it)
      if (data.statusResult !== 'Danger') {
        const audio = new Audio(infoSoundFile);
        audio.play().catch(err => console.error('Audio play failed:', err));
        
        setInfoToastMessage(data.message);
        
        // Update pin color if applicable
        if (data.statusResult === 'Clear') {
          setDrainages(prev => prev.map(d => d.id === data.drainageId ? { ...d, current_pin_color: "#28A745", current_condition_status: "Clear" } : d));
        } else if (data.statusResult === 'Warning') {
          setDrainages(prev => prev.map(d => d.id === data.drainageId ? { ...d, current_pin_color: "#FFC107", current_condition_status: "Warning" } : d));
        }

        setTimeout(() => setInfoToastMessage(''), 6000);
        
        // Show web notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Info Drainase Baru', {
            body: data.message,
            icon: logoLight
          });
        }
      }
    });

    // Request Notification Permission for citizens too
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    return () => socket.disconnect();
  }, []);

  const fetchMapData = async () => {
    try {
      const [drRes, regRes] = await Promise.all([
        axiosInstance.get("/drainages"),
        axiosInstance.get("/regions"),
      ]);
      if (drRes.data.success) setDrainages(drRes.data.data);
      if (regRes.data.success) setRegions(regRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDrainageReports = async (drainageId) => {
    try {
      const res = await axiosInstance.get("/drainage-reports");
      if (res.data.success) {
        // Filter in frontend or backend. Doing in frontend for simplicity since backend doesn't have drainage_id filter yet
        const filtered = res.data.data.filter(
          (r) => r.drainage_id === drainageId,
        );
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
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const coordsToLatLng = (coords) => new L.LatLng(coords[0], coords[1]);

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row relative">
      {/* Toast Alert Danger */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[2000] animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500">
          <div className="bg-red-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-500 font-medium">
            <AlertTriangle className="w-6 h-6 animate-pulse text-white" />
            <span className="text-sm">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Toast Alert Info */}
      {infoToastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[2000] animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500">
          <div className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-blue-500 font-medium">
            <Info className="w-6 h-6 animate-pulse text-white" />
            <span className="text-sm">{infoToastMessage}</span>
          </div>
        </div>
      )}

      {/* Mobile Top Bar */}
      <div className="md:hidden absolute top-4 left-4 right-4 z-[1000] flex justify-between items-center bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center">
          <img src={logoLight} alt="SI-Drainase Logo" className="h-8 w-auto mr-2 object-contain rounded-md" />
          <h1 className="font-bold text-gray-900 text-sm">SI-Drainase</h1>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="text-blue-600 text-xs font-semibold px-3 py-1.5 bg-blue-50 rounded-lg"
        >
          Login Admin
        </button>
      </div>
      {/* Header Desktop / Login Overlay */}
      <div 
        className={`absolute top-4 z-[1000] hidden md:block transition-all duration-300`}
        style={{ right: selectedDrainage ? 'calc(24rem + 1rem)' : '1rem' }}
      >
        <button
          onClick={() => navigate("/login")}
          className="bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 text-sm font-medium py-2 px-4 rounded-xl shadow-sm border border-gray-200 transition-colors"
        >
          Login Admin
        </button>
      </div>

      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 max-w-sm hidden md:block">
        <div className="flex items-center mb-2">
          <img src={logoLight} alt="SI-Drainase Logo" className="h-10 w-auto mr-3 object-contain rounded-lg" />
          <div>
            <h1 className="font-bold text-xl text-gray-900">
              SI-Drainase Publik
            </h1>
            <p className="text-xs text-gray-500">
              Peta Interaktif Saluran Air & Laporan
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full bg-[#28A745] mr-2"></div> Aman
            (Clear)
          </div>
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full bg-[#FFC107] mr-2"></div>{" "}
            Waspada (Warning)
          </div>
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full bg-[#DC3545] mr-2"></div>{" "}
            Bahaya (Danger)
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative z-0 h-[50vh] md:h-full">
        <MapContainer
          center={[-7.3274, 108.2232]}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {regions && (
            <GeoJSON
              data={regions}
              coordsToLatLng={coordsToLatLng}
              style={(feature) => ({
                fillColor: feature.properties.risk_color || "#3b82f6",
                weight: 2,
                opacity: 1,
                color: feature.properties.risk_color || "#94a3b8",
                dashArray: "3",
                fillOpacity: 0.15,
              })}
            />
          )}

          {drainages.map((d) => (
            <Marker
              key={d.id}
              position={[d.latitude, d.longitude]}
              icon={createCustomIcon(d.current_pin_color || "#6C757D", d.id === dangerDrainageId)}
              eventHandlers={{ click: () => handleMarkerClick(d) }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Side Panel for Reports */}
      <div
        className={`w-full md:w-96 bg-white border-l border-gray-100 shadow-2xl flex flex-col transition-all duration-300 z-10 ${selectedDrainage ? "h-[50vh] md:h-full" : "hidden"}`}
      >
        {selectedDrainage && (
          <>
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedDrainage.name}
                </h2>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {selectedDrainage.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedDrainage(null)}
                className="text-gray-400 hover:text-gray-600 font-bold p-2 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                &times;
              </button>
            </div>

            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                Status Terkini
              </h3>
              <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Tingkat kesehatan Saluran
                  </p>
                  <p className="text-2xl font-black text-gray-900">
                    {selectedDrainage.current_total_score
                      ? (parseFloat(selectedDrainage.current_total_score) <= 1
                          ? (
                              parseFloat(selectedDrainage.current_total_score) *
                              100
                            )
                              .toFixed(1)
                              .replace(/\.0$/, "")
                          : parseFloat(selectedDrainage.current_total_score)
                              .toFixed(1)
                              .replace(/\.0$/, "")) + "%"
                      : "0%"}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-xl font-bold text-sm ${selectedDrainage.current_condition_status === "Danger" ? "bg-red-100 text-red-700" : selectedDrainage.current_condition_status === "Warning" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                >
                  {selectedDrainage.current_condition_status || "Clear"}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Berita / Riwayat Laporan
              </h3>

              {reports.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">
                  Belum ada riwayat laporan untuk drainase ini.
                </p>
              ) : (
                <div className="relative pt-2">
                  {reports.map((report) => (
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

            <div className="p-4 border-t border-gray-100 bg-white">
              <button
                onClick={() =>
                  navigate("/lapor", {
                    state: { drainageId: selectedDrainage.id },
                  })
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex justify-center items-center transition-colors shadow-lg shadow-blue-500/30"
              >
                Buat Laporan Drainase Ini{" "}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>

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

export default PublicMap;
