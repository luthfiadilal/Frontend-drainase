import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LayoutDashboard, Database, Settings, LogOut, Menu, AlertTriangle, ClipboardList, Check, Map } from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';
import logoLight from '../assets/images/LOGO-DRAINASE2.jpg';
import { io } from 'socket.io-client';
import urgentSoundFile from '../assets/sound-effect/mixkit-urgent-simple-tone-loop-2976.wav';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/master', label: 'Master Data', icon: Database },
  { path: '/admin/reports', label: 'Laporan', icon: ClipboardList },
  { path: '/admin/emergency', label: 'Darurat', icon: AlertTriangle },
  { path: '/map', label: 'Peta Publik', icon: Map },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user, logoutContext } = React.useContext(AuthContext);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Request Notification permission
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    if (user && user.role === 'Admin') {
      const socketUrl = import.meta.env.VITE_WS_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000");
      const socket = io(socketUrl, {
        transports: ['websocket']
      });

      socket.on("danger_report", (data) => {
        const audio = new Audio(urgentSoundFile);
        audio.play().catch(err => console.error('Audio play failed:', err));

        setToastMessage(data.message);
        setTimeout(() => setToastMessage(''), 8000);

        // System Notification (Muncul di background/OS)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Darurat: Laporan Drainase', {
            body: data.message,
            icon: logoLight, 
            requireInteraction: true // Notifikasi tetap ada sampai di-klik
          });
        }
      });

      return () => socket.disconnect();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const executeLogout = () => {
    logoutContext();
    setShowLogoutModal(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-50/50">
      
      {/* Toast Alert for Admin */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[2000] animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500">
          <div className="bg-red-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-500 font-medium cursor-pointer" onClick={() => setToastMessage('')}>
            <AlertTriangle className="w-6 h-6 animate-pulse text-white" />
            <span className="text-sm">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-50">
          <img src={logoLight} alt="SI-Drainase Logo" className="h-8 w-auto mr-3 object-contain rounded-md" />
          <h1 className="font-bold text-lg text-gray-800 tracking-tight">SI-Drainase</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-50">
          <button onClick={handleLogoutClick} className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Top Header */}
        <header className={`md:hidden h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-4 justify-between sticky top-0 ${isMobileMenuOpen ? 'z-50' : 'z-30'}`}>
          <div className="flex items-center relative z-50">
            <img src={logoLight} alt="SI-Drainase Logo" className="h-8 w-auto mr-3 object-contain rounded-md" />
            <h1 className="font-bold text-gray-800">SI-Drainase</h1>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-500 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors relative z-50"
          >
             <Menu className="w-6 h-6" />
          </button>

        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-40 px-2 py-2 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-16 h-14 relative transition-all duration-300 ${
                    isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Background Pill */}
                    {isActive && (
                      <span className="absolute inset-0 bg-blue-50/80 rounded-2xl -z-10 scale-95 transition-transform duration-300"></span>
                    )}
                    <Icon 
                      className={`w-5 h-5 mb-1 transition-all duration-300 ${isActive ? '-translate-y-0.5' : ''}`} 
                      strokeWidth={isActive ? 2.5 : 2} 
                    />
                    <span 
                      className={`text-[10px] font-semibold transition-all duration-300 tracking-tight ${
                        isActive ? 'opacity-100' : 'opacity-80 font-medium'
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Mobile Dropdown Menu (Moved outside header to avoid backdrop-filter trap) */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[60] bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-20 right-4 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[70] transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-50 bg-gradient-to-br from-blue-50/50 to-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {(user.username || 'A')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{user.username}</p>
                  <p className="text-xs text-blue-600 font-medium capitalize truncate">{user.role}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogoutClick();
                }} 
                className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={executeLogout} 
        title="Konfirmasi Keluar" 
        message="Apakah Anda yakin ingin keluar dari sesi ini? Anda harus login kembali untuk mengakses halaman Admin."
        confirmText="Ya, Keluar"
      />
    </div>
  );
};

export default AdminLayout;