import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import MasterData from './pages/admin/MasterData';

import ReportDrainage from './pages/citizen/ReportDrainage';

import ReportList from './pages/admin/ReportList';

import PublicMap from './pages/citizen/PublicMap';
import HomePage from './pages/citizen/HomePage';

import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<PublicMap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lapor" element={<ReportDrainage />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="master" element={<MasterData />} />
            <Route path="reports" element={<ReportList />} />
            <Route path="emergency" element={<ReportList dangerOnly={true} />} />
            <Route path="settings" element={<div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500 text-center font-medium">Pengaturan Akan Datang</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;