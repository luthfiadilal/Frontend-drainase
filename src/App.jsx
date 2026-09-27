import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import MasterData from './pages/admin/MasterData';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="master" element={<MasterData />} />
          <Route path="settings" element={<div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500 text-center font-medium">Pengaturan Akan Datang</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;