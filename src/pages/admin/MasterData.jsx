import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LocationPickerMap from '../../components/map/LocationPickerMap';
import ConfirmModal from '../../components/common/ConfirmModal';
import FeedbackModal from '../../components/common/FeedbackModal';
import { Plus, Edit2, Trash2, Search, Filter, X, AlertTriangle } from 'lucide-react';
import { 
  getDrainages, createDrainage, updateDrainage, deleteDrainage,
  getAspects, createAspect, updateAspect, deleteAspect,
  getIndicators, createIndicator, updateIndicator, deleteIndicator,
  getIndicatorOptions, createIndicatorOption, updateIndicatorOption, deleteIndicatorOption,
  getUsers, createUser, updateUser, deleteUser
} from '../../services/masterDataService';

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('drainage');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [formData, setFormData] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  // Dropdown References
  const [aspectOptions, setAspectOptions] = useState([]);
  const [indicatorRefOptions, setIndicatorRefOptions] = useState([]);

  useEffect(() => {
    const fetchRefs = async () => {
      try {
        const [aspRes, indRes] = await Promise.all([getAspects(), getIndicators()]);
        if (aspRes?.success) setAspectOptions(aspRes.data);
        if (indRes?.success) setIndicatorRefOptions(indRes.data);
      } catch (e) { console.error(e); }
    };
    fetchRefs();
  }, []);

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

  const handleLocationSelected = (lat, lng, regionId, regionName) => {
    setFormData(prev => ({ 
      ...prev, 
      latitude: lat, 
      longitude: lng,
      ...(regionId ? { region_id: regionId } : {}),
      ...(regionName ? { region_name: regionName } : {})
    }));
  };

  const handleOpenForm = (mode, item = null) => {
    setFormMode(mode);
    if (mode === 'edit' && item) {
      setSelectedId(item.id);
      if (activeTab === 'drainage') {
        const scorePercent = item.current_total_score ? (parseFloat(item.current_total_score) * 100).toString() : '';
        setFormData({ name: item.name, address: item.address, region_id: item.region_id, latitude: item.latitude, longitude: item.longitude, current_total_score: scorePercent, current_condition_status: item.current_condition_status || '' });
      } else if (activeTab === 'aspect') {
        const weightPercent = item.weight ? (parseFloat(item.weight) * 100).toString() : '';
        setFormData({ name: item.name, weight: weightPercent });
      } else if (activeTab === 'indicator') {
        const weightPercent = item.weight ? (parseFloat(item.weight) * 100).toString() : '';
        setFormData({ aspect_id: item.aspect_id, name: item.name, weight: weightPercent });
      } else if (activeTab === 'indicator_option') {
        setFormData({ indicator_id: item.indicator_id, score: item.score, description: item.description, calculated_weight: item.calculated_weight });
      } else if (activeTab === 'user') {
        setFormData({ name: item.name, email: item.email, role: item.role });
      }
    } else {
      setSelectedId(null);
      if (activeTab === 'drainage') setFormData({ name: '', address: '', region_id: '', region_name: '', latitude: '', longitude: '', current_total_score: '', current_condition_status: '' });
      else if (activeTab === 'aspect') setFormData({ name: '', weight: '' });
      else if (activeTab === 'indicator') setFormData({ aspect_id: '', name: '', weight: '' });
      else if (activeTab === 'indicator_option') setFormData({ indicator_id: '', score: '', description: '', calculated_weight: '' });
      else if (activeTab === 'user') setFormData({ name: '', email: '', role: 'Admin', password: '' });
    }
    setShowFormModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (activeTab === 'drainage') {
        const payload = { ...formData };
        if (payload.current_total_score) {
          payload.current_total_score = (parseFloat(payload.current_total_score) / 100).toFixed(4);
        } else {
          payload.current_total_score = null;
        }
        res = formMode === 'create' ? await createDrainage(payload) : await updateDrainage(selectedId, payload);
      } else if (activeTab === 'aspect') {
        const payload = { ...formData };
        if (payload.weight) payload.weight = (parseFloat(payload.weight) / 100).toFixed(4);
        res = formMode === 'create' ? await createAspect(payload) : await updateAspect(selectedId, payload);
      } else if (activeTab === 'indicator') {
        const payload = { ...formData };
        if (payload.weight) payload.weight = (parseFloat(payload.weight) / 100).toFixed(4);
        res = formMode === 'create' ? await createIndicator(payload) : await updateIndicator(selectedId, payload);
      } else if (activeTab === 'indicator_option') {
        res = formMode === 'create' ? await createIndicatorOption(formData) : await updateIndicatorOption(selectedId, formData);
      } else if (activeTab === 'user') {
        res = formMode === 'create' ? await createUser(formData) : await updateUser(selectedId, formData);
      }

      if (res && res.success) {
        setFeedback({ isOpen: true, type: 'success', title: 'Berhasil', message: 'Data berhasil disimpan!' });
        setShowFormModal(false);
        fetchData(activeTab);
      } else {
        setFeedback({ isOpen: true, type: 'error', title: 'Gagal', message: "Gagal menyimpan data: " + (res.message || "Unknown error") });
      }
    } catch (err) {
      setFeedback({ isOpen: true, type: 'error', title: 'Error', message: 'Terjadi kesalahan pada server.' });
    }
  };

  const confirmDelete = (item) => {
    setDeleteItem(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      let res;
      if (activeTab === 'drainage') res = await deleteDrainage(deleteItem.id);
      else if (activeTab === 'aspect') res = await deleteAspect(deleteItem.id);
      else if (activeTab === 'indicator') res = await deleteIndicator(deleteItem.id);
      else if (activeTab === 'indicator_option') res = await deleteIndicatorOption(deleteItem.id);
      else if (activeTab === 'user') res = await deleteUser(deleteItem.id);

      if (res && res.success) {
        setFeedback({ isOpen: true, type: 'success', title: 'Berhasil', message: 'Data berhasil dihapus!' });
        setShowDeleteModal(false);
        fetchData(activeTab);
      } else {
        setFeedback({ isOpen: true, type: 'error', title: 'Gagal', message: "Gagal menghapus data: " + (res?.message || "Unknown error") });
      }
    } catch (err) {
      setFeedback({ isOpen: true, type: 'error', title: 'Error', message: 'Terjadi kesalahan pada server.' });
    }
  };

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
              <button onClick={() => handleOpenForm('edit', item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mr-1"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => confirmDelete(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
            </td>
          </tr>
        );
      }
      if (activeTab === 'aspect') {
        return (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
            <td className="py-4 px-5 font-semibold text-gray-800">{item.name}</td>
            <td className="py-4 px-5 font-medium text-gray-900">{(item.weight * 100).toFixed(1).replace(/\.0$/, '')}%</td>
            <td className="py-4 px-5 text-sm text-gray-600">{item.Indicators ? item.Indicators.length : 0} Indikator</td>
            <td className="py-4 px-5 text-right">
              <button onClick={() => handleOpenForm('edit', item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mr-1"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => confirmDelete(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
            </td>
          </tr>
        );
      }
      if (activeTab === 'indicator') {
        return (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
            <td className="py-4 px-5 text-sm text-gray-600">{item.Aspect ? item.Aspect.name : '-'}</td>
            <td className="py-4 px-5 font-semibold text-gray-800">{item.name}</td>
            <td className="py-4 px-5 font-medium text-gray-900">{(item.weight * 100).toFixed(1).replace(/\.0$/, '')}%</td>
            <td className="py-4 px-5 text-right">
              <button onClick={() => handleOpenForm('edit', item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mr-1"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => confirmDelete(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
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
            <td className="py-4 px-5 text-sm text-gray-600">{(item.calculated_weight * 100).toFixed(1).replace(/\.0$/, '')}%</td>
            <td className="py-4 px-5 text-right">
              <button onClick={() => handleOpenForm('edit', item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mr-1"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => confirmDelete(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
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
              <button onClick={() => handleOpenForm('edit', item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mr-1"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => confirmDelete(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
            </td>
          </tr>
        );
      }
    });
  };

  const renderFormFields = () => {
    if (activeTab === 'drainage') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Drainase</label>
            <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: Saluran Pemuda" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat / Lokasi</label>
            <input type="text" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jalan Pemuda No.10" />
          </div>
          {formMode === 'create' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Skor Kondisi Awal (%)</label>
                <input type="number" step="0.01" min="0" max="100" value={formData.current_total_score || ''} onChange={(e) => setFormData({...formData, current_total_score: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Opsional (Misal: 85.50)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status Kondisi Awal</label>
                <select value={formData.current_condition_status || ''} onChange={(e) => {
                  const status = e.target.value;
                  let color = "#6C757D";
                  if (status === 'Danger') color = "#DC3545";
                  if (status === 'Warning') color = "#FFC107";
                  if (status === 'Clear') color = "#28A745";
                  setFormData({...formData, current_condition_status: status, current_pin_color: color});
                }} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">-- Belum Dinilai --</option>
                  <option value="Clear">Clear (Aman)</option>
                  <option value="Warning">Warning (Waspada)</option>
                  <option value="Danger">Danger (Bahaya)</option>
                </select>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Region (Kecamatan/Kelurahan)</label>
            <input required type="text" readOnly value={formData.region_name || formData.region_id || ''} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none cursor-not-allowed" placeholder="Pilih melalui peta" />
          </div>
          <div className="border-t border-gray-100 pt-4 mt-2">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Pilih Lokasi Peta</label>
            <p className="text-xs text-gray-500 mb-3">Klik pada peta di bawah ini untuk mendapatkan titik Latitude dan Longitude drainase.</p>
            <LocationPickerMap 
              onLocationSelected={handleLocationSelected} 
              initialPosition={formData.latitude && formData.longitude ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) } : null}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
                <input required type="text" readOnly value={formData.latitude || ''} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none cursor-not-allowed" placeholder="-7.xxx" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
                <input required type="text" readOnly value={formData.longitude || ''} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none cursor-not-allowed" placeholder="108.xxx" />
              </div>
            </div>
          </div>
        </>
      );
    }
    if (activeTab === 'aspect') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Aspek</label>
            <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: Fisik" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bobot Aspek (%)</label>
            <input required type="number" step="0.01" min="0" max="100" value={formData.weight || ''} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: 50" />
          </div>
        </>
      );
    }
    if (activeTab === 'indicator') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Aspek</label>
            <select required value={formData.aspect_id || ''} onChange={(e) => setFormData({...formData, aspect_id: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">-- Pilih Aspek --</option>
              {aspectOptions.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Indikator</label>
            <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: Kondisi Permukaan" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bobot Indikator (%)</label>
            <input required type="number" step="0.01" min="0" max="100" value={formData.weight || ''} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: 50" />
          </div>
        </>
      );
    }
    if (activeTab === 'indicator_option') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Indikator</label>
            <select required value={formData.indicator_id || ''} onChange={(e) => setFormData({...formData, indicator_id: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">-- Pilih Indikator --</option>
              {indicatorRefOptions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi / Pilihan</label>
            <input required type="text" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: Sangat Baik" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Skor (1-5)</label>
            <input required type="number" value={formData.score || ''} onChange={(e) => setFormData({...formData, score: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: 5" />
          </div>
        </>
      );
    }
    if (activeTab === 'user') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Pengguna</label>
            <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama Lengkap" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input required type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@contoh.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <input required type="text" value={formData.role || 'Admin'} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none cursor-not-allowed text-gray-500" />
          </div>
          {formMode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input required type="password" value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="******" />
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Master Data</h1>
          <p className="text-gray-500 mt-1">Kelola data terpusat terhubung ke Backend API</p>
        </div>
        <Button onClick={() => handleOpenForm('create')}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Data
        </Button>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <h2 className="text-xl font-bold text-gray-900">
                {formMode === 'create' ? 'Tambah Data' : 'Edit Data'} {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <button onClick={() => setShowFormModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="master-form" onSubmit={handleSave} className="space-y-4">
                {renderFormFields()}
              </form>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white shrink-0">
              <Button type="button" variant="secondary" onClick={() => setShowFormModal(false)}>Batal</Button>
              <Button type="submit" form="master-form">Simpan Data</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={handleDelete} 
        title="Konfirmasi Hapus" 
        message="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan." 
      />

      <FeedbackModal 
        isOpen={feedback.isOpen} 
        onClose={() => setFeedback(prev => ({ ...prev, isOpen: false }))} 
        type={feedback.type} 
        title={feedback.title} 
        message={feedback.message} 
      />

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