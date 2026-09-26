import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Mail, Lock, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>

      <div className="mb-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 shadow-xl shadow-blue-500/30 mb-5 transform transition hover:scale-105">
          <Droplets className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">SI-Drainase</h1>
        <p className="text-gray-500 mt-2 font-medium">Sistem Informasi & SPK Drainase GIS</p>
      </div>

      <Card className="w-full max-w-md shadow-2xl shadow-gray-200/50 border-0 ring-1 ring-gray-200/50 relative z-10">
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Administrator</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white focus:bg-white outline-none"
                placeholder="admin@drainase.id"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">Lupa sandi?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white focus:bg-white outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-2">
             <Button type="submit" className="w-full py-3.5 text-base shadow-lg shadow-blue-500/30">
               Masuk ke Sistem
             </Button>
          </div>
        </form>
      </Card>
      
      <p className="mt-8 text-sm text-gray-400 font-medium relative z-10">
        © 2026 SI-Drainase. All rights reserved.
      </p>
    </div>
  );
};

export default Login;