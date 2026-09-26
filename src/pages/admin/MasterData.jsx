import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('drainage');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'drainage', label: 'Data Drainase' },
    { id: 'aspect', label: 'Aspek SPK' },
    { id: 'user', label: 'Pengguna' },
  ];

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (tab === 'drainage') endpoint = '/drainages';
      if (tab === 'aspect') endpoint = '/aspects';
      if (tab === 'user') endpoint = '/users';
      
      const res = await axiosInstance.get(endpoint);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const renderTableHead = () => {
    if (activeTab === 'drainage') {
      return (
        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <th className="py-3 px-5">Nama Drainase</th>
          <th className="py-3 px-5">Tipe & Region</th>
          <th className="py-3 px-5">Dimensi (P/L/D)</th>
          <th className="py-3 px-5">Status</th>
          <th className="py-3 px-5 text-right">Aksi</th>
        </tr>
      );
    }
    if (activeTab === 'aspect') {
      return (
        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <th className="py-3 px-5">Aspek</th>
          <th className="py-3 px-5">Bobot</th>
          <th className="py-3 px-5">Total Indikator</th>
          <th className="py-3 px-5 text-right">Aksi</th>
        </tr>
      );
    }
    if (activeTab === 'user') {
      return (
        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <th className="py-3 px-5">Nama Pengguna</th>
          <th className="py-3 px-5">Email</th>
          <th className="py-3 px-5">Role</th>
          <th className="py-3 px-5 text-right">Aksi</th>
        </tr>
      );
    }
  };

  const renderTableBody = () => {
    if (loading) return <tr><td colSpan="5" className="text-center py-8 text-gray-500">Memuat data...</td></tr>;
    if (data.length === 0) return <tr><td colSpan="5" className="text-center py-8 text-gray-500">Tidak ada data.</td></tr>;

    return data.map((item) => {
      if (activeTab === 'drainage') {
        return (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
            <td className="py-4 px-5 font-semibold text-gray-800">{item.name}</td>
            <td className="py-4 px-5">
              <p className="text-sm font-medium text-gray-900">{item.type}</p>
              <p className="text-xs text-gray-500">Region ID: {item.region_id}</p>
            </td>
            <td className="py-4 px-5 text-sm text-gray-600">
              {item.length}m / {item.width}m / {item.depth}m
            </td>
            <td className="py-4 px-5">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'Danger' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {item.status}
              </span>
            </td>
            <td className="py-4 px-5 text-right">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mr-1"><Edit2 className="w-4 h-4" /></button>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
            </td>
          </tr>
        );
      }
      if (activeTab === 'aspect') {
        return (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
            <td className="py-4 px-5 font-semibold text-gray-800">{item.name}</td>
            <td className="py-4 px-5 font-medium text-gray-900">{item.weight}%</td>
            <td className="py-4 px-5 text-sm text-gray-600">{item.Indicators ? item.Indicators.length : 0} Indikator</td>
            <td className="py-4 px-5 text-right">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mr-1"><Edit2 className="w-4 h-4" /></button>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
            </td>
          </tr>
        );
      }
      if (activeTab === 'user') {
        return (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
            <td className="py-4 px-5 font-semibold text-gray-800">{item.name}</td>
            <td className="py-4 px-5 text-sm text-gray-600">{item.email}</td>
            <td className="py-4 px-5">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {item.role}
              </span>
            </td>
            <td className="py-4 px-5 text-right">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mr-1"><Edit2 className="w-4 h-4" /></button>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
            </td>
          </tr>
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Master Data</h1>
          <p className="text-gray-500 mt-1">Kelola data terpusat terhubung ke Backend API</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Tambah Data
        </Button>
      </div>

      <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm inline-flex w-full md:w-auto overflow-x-auto relative z-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              {renderTableHead()}
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MasterData;