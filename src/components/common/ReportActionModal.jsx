import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronDown, ChevronRight, Camera } from 'lucide-react';
import Button from './Button';
import { getAspects, getIndicators, getIndicatorOptions, createAction } from '../../services/masterDataService';
import { compressImage } from '../../utils/imageCompressor';

const ReportActionModal = ({ report, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [aspects, setAspects] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [options, setOptions] = useState([]);

  // Form State
  const [actionTitle, setActionTitle] = useState('');
  const [actionType, setActionType] = useState('pembersihan_sampah');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [images, setImages] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [expandedAspect, setExpandedAspect] = useState(null);
  const [expandedIndicator, setExpandedIndicator] = useState(null);

  useEffect(() => {
    if (report) {
      fetchMasterData();
    }
  }, [report]);

  const fetchMasterData = async () => {
    try {
      const [asp, ind, opt] = await Promise.all([
        getAspects(),
        getIndicators(),
        getIndicatorOptions(),
      ]);
      if (asp.success) setAspects(asp.data);
      if (ind.success) setIndicators(ind.data);
      if (opt.success) setOptions(opt.data);
    } catch (error) {
      console.error("Gagal memuat data master", error);
    }
  };

  if (!report) return null;

  const handleOptionSelect = (indicatorId, optionId) => {
    setSelectedOptions((prev) => ({ ...prev, [indicatorId]: optionId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("report_id", report.id);
      formData.append("drainage_id", report.drainage_id);
      formData.append("action_title", actionTitle);
      formData.append("action_type", actionType);
      formData.append("description", description);
      if (budget) formData.append("budget", budget);

      const optionVals = Object.values(selectedOptions);
      formData.append("options", JSON.stringify(optionVals));

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const compressedFile = await compressImage(images[i]);
          formData.append("images", compressedFile);
        }
      }

      const res = await createAction(formData);
      if (res.success) {
        setSuccess(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menyimpan perbaikan");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (success && onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Tindak Lanjut Perbaikan</h2>
            <p className="text-sm text-gray-500 mt-1">{report.Drainage?.name}</p>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Perbaikan Berhasil Disimpan!</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Skor dan status drainase telah diperbarui berdasarkan indikator terbaru.
              </p>
              <Button onClick={handleClose}>Selesai</Button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Tindakan</label>
                <input type="text" value={actionTitle} onChange={(e) => setActionTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: Pengerukan Sedimen di Saluran A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Tindakan</label>
                <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="pembersihan_sampah">Pembersihan Sampah</option>
                  <option value="pengerukan_sedimen">Pengerukan Sedimen</option>
                  <option value="perbaikan_dinding">Perbaikan Dinding</option>
                  <option value="pembuatan_tutup">Pembuatan Tutup</option>
                  <option value="pelebaran">Pelebaran</option>
                  <option value="normalisasi_total">Normalisasi Total</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Perbaikan</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jelaskan detail perbaikan..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Anggaran (Opsional)</label>
                <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><Camera className="w-4 h-4 mr-2" /> Foto Bukti Perbaikan</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-md font-bold text-gray-900 mb-2">Update Kondisi Terbaru (Skor)</h3>
              <p className="text-sm text-gray-500 mb-4">Pilih indikator kondisi drainase SETELAH perbaikan dilakukan.</p>
              
              <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3">
                {aspects.map((aspect) => {
                  const aspectIndicators = indicators.filter((i) => i.aspect_id === aspect.id);
                  if (aspectIndicators.length === 0) return null;
                  const isAspectExpanded = expandedAspect === aspect.id;
                  
                  return (
                    <div key={aspect.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <button className={`w-full flex items-center justify-between p-3 text-left transition-colors focus:outline-none ${isAspectExpanded ? "bg-blue-50/50" : "hover:bg-gray-50"}`} onClick={() => setExpandedAspect(isAspectExpanded ? null : aspect.id)}>
                        <h4 className="font-semibold text-gray-800 text-sm">{aspect.name}</h4>
                        {isAspectExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                      </button>
                      {isAspectExpanded && (
                        <div className="p-3 pt-0 space-y-3 border-t border-gray-100 bg-gray-50/30">
                          {aspectIndicators.map((indicator) => {
                            const indicatorOptions = options.filter((o) => o.indicator_id === indicator.id);
                            const isIndicatorExpanded = expandedIndicator === indicator.id;
                            const isAnswered = !!selectedOptions[indicator.id];
                            
                            return (
                              <div key={indicator.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <button className={`w-full flex items-center justify-between p-2 text-left transition-colors focus:outline-none ${isIndicatorExpanded ? "bg-blue-50/30" : "hover:bg-gray-50"}`} onClick={() => setExpandedIndicator(isIndicatorExpanded ? null : indicator.id)}>
                                  <div className="flex items-center">
                                    {isAnswered && <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />}
                                    <span className={`text-xs font-medium ${isAnswered ? "text-gray-900" : "text-gray-700"}`}>{indicator.name}</span>
                                  </div>
                                  {isIndicatorExpanded ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
                                </button>
                                {isIndicatorExpanded && (
                                  <div className="p-2 pt-1 space-y-2 border-t border-gray-100 bg-gray-50/50">
                                    {indicatorOptions.map((opt) => (
                                      <label key={opt.id} className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${selectedOptions[indicator.id] === opt.id ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 bg-white hover:border-blue-300"}`}>
                                        <input type="radio" name={`indicator-${indicator.id}`} value={opt.id} checked={selectedOptions[indicator.id] === opt.id} onChange={() => handleOptionSelect(indicator.id, opt.id)} className="w-3 h-3 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
                                        <span className="ml-2 block text-xs font-medium text-gray-800">{opt.description}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {!success && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white shrink-0">
            {step === 1 ? (
              <Button variant="secondary" onClick={handleClose}>Batal</Button>
            ) : (
              <Button variant="secondary" onClick={() => setStep(1)}>Kembali</Button>
            )}
            
            {step === 1 ? (
              <Button onClick={() => setStep(2)} disabled={!actionTitle || !actionType}>Lanjut ke Update Skor</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading || Object.keys(selectedOptions).length === 0}>
                {loading ? "Menyimpan..." : "Simpan Perbaikan"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportActionModal;
