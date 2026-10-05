import React, { useState, useEffect } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  getDrainages,
  getAspects,
  getIndicators,
  getIndicatorOptions,
} from "../../services/masterDataService";
import { compressImage } from "../../utils/imageCompressor";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import CameraModal from "../../components/common/CameraModal";
import {
  CheckCircle2,
  Info,
  MapPin,
  Droplets,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Camera,
  Image as ImageIcon,
  X
} from "lucide-react";

const ReportDrainage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Data Master
  const [drainages, setDrainages] = useState([]);
  const [aspects, setAspects] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [options, setOptions] = useState([]);

  // Form State
  const [selectedDrainage, setSelectedDrainage] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({}); // { indicator_id: option_id }
  const [expandedAspect, setExpandedAspect] = useState(null);
  const [expandedIndicator, setExpandedIndicator] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (location.state?.drainageId && drainages.length > 0) {
      setSelectedDrainage(location.state.drainageId);
      setStep(2);
    }
  }, [location.state, drainages]);

  const fetchMasterData = async () => {
    try {
      const [dr, asp, ind, opt] = await Promise.all([
        getDrainages(),
        getAspects(),
        getIndicators(),
        getIndicatorOptions(),
      ]);
      if (dr.success) setDrainages(dr.data);
      if (asp.success) setAspects(asp.data);
      if (ind.success) setIndicators(ind.data);
      if (opt.success) setOptions(opt.data);
    } catch (error) {
      console.error("Gagal memuat data master", error);
    }
  };

  const handleOptionSelect = (indicatorId, optionId) => {
    setSelectedOptions((prev) => ({ ...prev, [indicatorId]: optionId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("drainage_id", selectedDrainage);
      formData.append("reporter_name", reporterName);
      formData.append("reporter_contact", reporterContact);
      formData.append("notes", notes);

      const optionVals = Object.values(selectedOptions);
      formData.append("options", JSON.stringify(optionVals));

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const compressedFile = await compressImage(images[i]);
          formData.append("images", compressedFile);
        }
      }

      const res = await axiosInstance.post("/drainage-reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setSuccess(true);
        setStep(4);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Gagal mengirim laporan");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedDrainage("");
    setReporterName("");
    setReporterContact("");
    setNotes("");
    setImages([]);
    setSelectedOptions({});
    setSuccess(false);

    if (location.state?.drainageId) {
      navigate("/");
    } else {
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-10 px-4 pb-20 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 shadow-xl shadow-blue-500/30 mb-5">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Lapor Drainase
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Sistem Partisipasi Warga untuk Pemantauan Saluran
          </p>
        </div>

        <Card className="shadow-2xl shadow-gray-200/50 border-0 ring-1 ring-gray-200/50">
          {/* STEP 1: PILIH DRAINASE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                  1. Pilih Lokasi Drainase
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Pilih drainase mana yang ingin Anda laporkan kondisinya.
                </p>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                  value={selectedDrainage}
                  onChange={(e) => setSelectedDrainage(e.target.value)}
                >
                  <option value="">-- Pilih Saluran Drainase --</option>
                  {drainages.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code}) - {d.address}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button onClick={() => setStep(2)} disabled={!selectedDrainage}>
                  Lanjut ke Penilaian
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: PENILAIAN ASPEK */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-blue-500" />
                  2. Kondisi Saluran
                </h3>
                <p className="text-sm text-gray-500">
                  Pilih kondisi yang paling sesuai dengan keadaan di lapangan.
                </p>
              </div>

              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                {aspects.map((aspect) => {
                  const aspectIndicators = indicators.filter(
                    (i) => i.aspect_id === aspect.id,
                  );
                  if (aspectIndicators.length === 0) return null;

                  const isAspectExpanded = expandedAspect === aspect.id;

                  return (
                    <div
                      key={aspect.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                    >
                      <button
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors focus:outline-none ${isAspectExpanded ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
                        onClick={() =>
                          setExpandedAspect(isAspectExpanded ? null : aspect.id)
                        }
                      >
                        <h4 className="font-semibold text-gray-800">
                          {aspect.name}
                        </h4>
                        {isAspectExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      {isAspectExpanded && (
                        <div className="p-4 pt-0 space-y-3 border-t border-gray-100 bg-gray-50/30">
                          {aspectIndicators.map((indicator) => {
                            const indicatorOptions = options.filter(
                              (o) => o.indicator_id === indicator.id,
                            );
                            const isIndicatorExpanded =
                              expandedIndicator === indicator.id;

                            // Check if this indicator has a selected option to show a checkmark
                            const isAnswered = !!selectedOptions[indicator.id];

                            return (
                              <div
                                key={indicator.id}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                              >
                                <button
                                  className={`w-full flex items-center justify-between p-3 text-left transition-colors focus:outline-none ${isIndicatorExpanded ? "bg-blue-50/30" : "hover:bg-gray-50"}`}
                                  onClick={() =>
                                    setExpandedIndicator(
                                      isIndicatorExpanded ? null : indicator.id,
                                    )
                                  }
                                >
                                  <div className="flex items-center">
                                    {isAnswered && (
                                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                                    )}
                                    <span
                                      className={`text-sm font-medium ${isAnswered ? "text-gray-900" : "text-gray-700"}`}
                                    >
                                      {indicator.name}
                                    </span>
                                  </div>
                                  {isIndicatorExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>

                                {isIndicatorExpanded && (
                                  <div className="p-3 pt-1 space-y-2 border-t border-gray-100 bg-gray-50/50">
                                    {indicatorOptions.map((opt) => (
                                      <label
                                        key={opt.id}
                                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${selectedOptions[indicator.id] === opt.id ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500/20" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"}`}
                                      >
                                        <input
                                          type="radio"
                                          name={`indicator-${indicator.id}`}
                                          value={opt.id}
                                          checked={
                                            selectedOptions[indicator.id] ===
                                            opt.id
                                          }
                                          onChange={() =>
                                            handleOptionSelect(
                                              indicator.id,
                                              opt.id,
                                            )
                                          }
                                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                                        />
                                        <span className="ml-3 block text-sm font-medium text-gray-800">
                                          {opt.description}
                                        </span>
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

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button onClick={() => setStep(3)}>Lanjut ke Identitas</Button>
              </div>
            </div>
          )}

          {/* STEP 3: IDENTITAS & SUBMIT */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  3. Informasi Pelapor
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Isi data diri Anda (Opsional) dan tambahkan catatan jika
                  perlu.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Anda (Opsional)
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Masukkan nama"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    No. HP / WhatsApp (Opsional)
                  </label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="081234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    Foto Kondisi (Opsional)
                  </label>
                  <div className="flex gap-3 mb-3">
                    <button 
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="flex-1 cursor-pointer flex flex-col items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Camera className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-xs font-medium text-gray-600">Buka Kamera</span>
                    </button>
                    <label className="flex-1 cursor-pointer flex flex-col items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors bg-white">
                      <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-xs font-medium text-gray-600">Pilih Galeri</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {images && images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                      {images.map((file, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 md:opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {images && images.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {images.length} foto dipilih
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Deskripsikan kondisi secara singkat..."
                  ></textarea>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex items-start mt-4">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Sistem akan mengkalkulasi skor berdasarkan pilihan kondisi
                  Anda. Total skor ini akan langsung memperbarui status warna
                  drainase di peta master (Aman, Waspada, atau Bahaya).
                </p>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  Kembali
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Memproses..." : "Kirim Laporan"}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="text-center py-10 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Laporan Berhasil Terkirim!
              </h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Terima kasih atas partisipasi Anda. Laporan kondisi drainase ini
                telah dikalkulasi dan langsung memperbarui status master data.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button variant="secondary" onClick={() => navigate("/")}>Kembali ke Peta</Button>
                <Button onClick={resetForm}>Buat Laporan Baru</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Modal Loading */}
      {loading && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-200 w-full max-w-sm mx-4 text-center">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-bold text-gray-900">Memproses Laporan...</h3>
            <p className="text-sm text-gray-500 mt-1">Sistem sedang mengompresi gambar dan mengirim data ke server. Mohon tunggu sebentar.</p>
          </div>
        </div>
      )}

      {isCameraOpen && (
        <CameraModal 
          onCapture={(file) => setImages(prev => [...prev, file])} 
          onClose={() => setIsCameraOpen(false)} 
        />
      )}
    </div>
  );
};

export default ReportDrainage;
