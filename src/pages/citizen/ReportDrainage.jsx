import React, { useState, useEffect } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  getDrainages,
  getAspects,
  getIndicators,
  getIndicatorOptions,
} from "../../services/masterDataService";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {
  CheckCircle2,
  Info,
  MapPin,
  Droplets,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Camera,
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
        Array.from(images).forEach((file) => {
          formData.append("images", file);
        });
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
                    Upload Foto Kondisi (Opsional)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImages(e.target.files)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
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
    </div>
  );
};

export default ReportDrainage;
