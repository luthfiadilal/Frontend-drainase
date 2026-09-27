import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LocationPickerMap from '../../components/map/LocationPickerMap';
import { Plus, Edit2, Trash2, Search, Filter, X } from 'lucide-react';
import { getDrainages, getAspects, getIndicators, getIndicatorOptions, getUsers, createDrainage } from '../../services/masterDataService';

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('drainage');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State for Drainage
  const [showDrainageModal, setShowDrainageModal] = useState(false);
  const [drainageForm, setDrainageForm] = useState({
    name: '', address: '', region_id: '', region_name: '', latitude: '', longitude: ''
  });

  const handleLocationSelected = (lat, lng, regionId, regionName) => {
    setDrainageForm(prev => ({ 
      ...prev, 
      latitude: lat, 
      longitude: lng,
      ...(regionId ? { region_id: regionId } : {}),
      ...(regionName ? { region_name: regionName } : {})
    }));
  };

  const handleSaveDrainage = async (e) => {
    e.preventDefault();
    try {
      const res = await createDrainage(drainageForm);
      if (res && res.success) {
        alert("Drainase berhasil ditambahkan!");
        setShowDrainageModal(false);
        setDrainageForm({ name: '', address: '', region_id: '', region_name: '', latitude: '', longitude: '' });
        fetchData(activeTab); // refresh data
      } else {
        alert("Gagal menambahkan drainase: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      alert("Terjadi kesalahan pada server.");
    }
  };

  const tabs = [
    { id: 'drainage', label: 'Data Drainase' },
    { id: 'aspect', label: 'Aspek SPK' },
    { id: 'indicator', label: 'Indikator SPK' },
    { id: 'indicator_option', label: 'Opsi Indikator' },
    { id: 'user', label: 'Pengguna' },
  ];

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      let res;
      if (tab === 'drainage') res = await getDrainages();
      else if (tab === 'aspect') res = await getAspects();
      else if (tab === 'indicator') res = await getIndicators();
      else if (tab === 'indicator_option') res = await getIndicatorOptions();
      else if (tab === 'user') res = await getUsers();
      
      if (res && res.success) {
        setData(res.data);
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
          <th className="py-3 px-5">Kode / Nama Drainase</th>
          <th className="py-3 px-5">Alamat / Region</th>
          <th className="py-3 px-5">Lokasi (Lat, Lng)</th>
          <th className="py-3 px-5">Status Kondisi</th>
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
    if (activeTab === 'indicator') {
      return (
        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <th className="py-3 px-5">Aspek</th>
          <th className="py-3 px-5">Indikator</th>
          <th className="py-3 px-5">Bobot</th>
          <th className="py-3 px-5 text-right">Aksi</th>
        </tr>
      );
    }
    if (activeTab === 'indicator_option') {
      return (
        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <th className="py-3 px-5">Indikator</th>
          <th className="py-3 px-5">Skor</th>
          <th className="py-3 px-5">Deskripsi</th>
          <th className="py-3 px-5">Bobot Kalkulasi</th>
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
            <td className="py-4 px-5">
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">{item.code}</p>
            </td>
            <td className="py-4 px-5">
              <p className="text-sm font-medium text-gray-900">{item.address || '-'}</p>
              <p className="text-xs text-gray-500">Region ID: {item.region_id}</p>
            </td>
            <td className="py-4 px-5 text-sm text-gray-600">
              {parseFloat(item.latitude).toFixed(4)}, {parseFloat(item.longitude).toFixed(4)}
            </td>
            <td className="py-4 px-5">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${item.current_condition_status === 'Danger' ? 'bg-red-100 text-red-800' : item.current_condition_status === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {item.current_condition_status || 'Belum Dinilai'}
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
      if (activeTab === 'indicator') {
        return (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
            <td className="py-4 px-5 text-sm text-gray-600">{item.Aspect ? item.Aspect.name : '-'}</td>
            <td className="py-4 px-5 font-semibold text-gray-800">{item.name}</td>
            <td className="py-4 px-5 font-medium text-gray-900">{item.weight}</td>
            <td className="py-4 px-5 text-right">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mr-1"><Edit2 className="w-4 h-4" /></button>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
            </td>
          </tr>
        );
      }
      if (activeTab === 'indicator_option') {
        return (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
            <td className="py-4 px-5 text-sm text-gray-600">{item.Indicator ? item.Indicator.name : '-'}</td>
            <td className="py-4 px-5 font-semibold text-gray-800">{item.score}</td>
            <td className="py-4 px-5 font-medium text-gray-900">{item.description}</td>
            <td className="py-4 px-5 text-sm text-gray-600">{item.calculated_weight}</td>
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
        <Button onClick={() => {
          if (activeTab === 'drainage') setShowDrainageModal(true);
          else alert("Tambah data belum tersedia untuk tab ini.");
        }}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Data
        </Button>
      </div>

      {showDrainageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Tambah Data Drainase</h2>
              <button onClick={() => setShowDrainageModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveDrainage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Drainase</label>
                  <input required type="text" value={drainageForm.name} onChange={(e) => setDrainageForm({...drainageForm, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: Saluran Pemuda" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat / Lokasi</label>
                  <input type="text" value={drainageForm.address} onChange={(e) => setDrainageForm({...drainageForm, address: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jalan Pemuda No.10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Region (Kecamatan/Kelurahan)</label>
                  <input required type="text" readOnly value={drainageForm.region_name || drainageForm.region_id} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none cursor-not-allowed" placeholder="Pilih melalui peta" />
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Pilih Lokasi Peta</label>
                  <p className="text-xs text-gray-500 mb-3">Klik pada peta di bawah ini untuk mendapatkan titik Latitude dan Longitude drainase.</p>
                  
                  <LocationPickerMap onLocationSelected={handleLocationSelected} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
                      <input required type="text" readOnly value={drainageForm.latitude} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none cursor-not-allowed" placeholder="-7.xxx" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
                      <input required type="text" readOnly value={drainageForm.longitude} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none cursor-not-allowed" placeholder="108.xxx" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setShowDrainageModal(false)}>Batal</Button>
                  <Button type="submit">Simpan Drainase</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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