import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Settings, LogOut, Menu } from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/master', label: 'Master Data', icon: Database },
  { path: '/admin/settings', label: 'Pengaturan', icon: Settings },
];

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50/50">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-50">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3 shadow-sm">
            <span className="text-white font-bold text-sm">SD</span>
          </div>
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
          <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Top Header */}
        <header className="md:hidden h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-4 justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3 shadow-sm">
              <span className="text-white font-bold text-sm">SD</span>
            </div>
            <h1 className="font-bold text-gray-800">SI-Drainase</h1>
          </div>
          <button className="p-2 text-gray-500 rounded-xl hover:bg-gray-50">
             <Menu className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 px-6 py-2 pb-safe shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-all duration-300 ${
                    isActive ? 'text-blue-600 -translate-y-1' : 'text-gray-400 hover:text-gray-600'
                  }`
                }
              >
                <Icon className={`w-6 h-6 mb-1 transition-all duration-300 ${isActive ? 'drop-shadow-md' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium transition-all">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AdminLayout;