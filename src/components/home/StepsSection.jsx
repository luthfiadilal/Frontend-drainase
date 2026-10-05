import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Camera, FileSpreadsheet, MapPin, UserCheck, Send, Clock, AlertCircle } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: MapPin,
    title: 'Pilih Titik pada Peta',
    desc: 'Buka peta digital interaktif dan pilih titik saluran drainase yang bermasalah di sekitar Anda.'
  },
  {
    num: '02',
    icon: AlertCircle,
    title: 'Klik "Buat Laporan"',
    desc: 'Pilih opsi pelaporan untuk menginisiasi formulir pengaduan baru pada titik tersebut.'
  },
  {
    num: '03',
    icon: FileSpreadsheet,
    title: 'Isi Kuesioner Fisik',
    desc: 'Jawab pertanyaan mengenai tingkat endapan sampah, lumpur, dan kelancaran aliran air.'
  },
  {
    num: '04',
    icon: UserCheck,
    title: 'Isi Identitas Pelapor',
    desc: 'Lengkapi nama dan kontak untuk memastikan validitas laporan serta transparansi proses.'
  },
  {
    num: '05',
    icon: Camera,
    title: 'Unggah Bukti Foto',
    desc: 'Ambil foto langsung melalui kamera atau unggah berkas kondisi drainase terkini.'
  },
  {
    num: '06',
    icon: Send,
    title: 'Kirim & Pantau Progres',
    desc: 'Kirim laporan dan dapatkan nomor tiket untuk memantau status tindak lanjut petugas.'
  }
];

const timelineStages = [
  {
    stage: 'Diterima',
    color: 'bg-slate-400',
    desc: 'Laporan warga masuk ke database sistem dan terdata secara otomatis.'
  },
  {
    stage: 'Diverifikasi',
    color: 'bg-blue-600',
    desc: 'Admin dan tim evaluator memvalidasi keaslian foto dan kelayakan data kuesioner.'
  },
  {
    stage: 'Diproses',
    color: 'bg-amber-500',
    desc: 'Jadwal pembersihan disusun dan diteruskan ke tim satgas lapangan.'
  },
  {
    stage: 'Selesai',
    color: 'bg-emerald-600',
    desc: 'Saluran telah dibersihkan / diperbaiki, status titik pada peta berubah menjadi Aman.'
  }
];

const StepsSection = () => {
  return (
    <section id="cara-melapor" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1180px] mx-auto border-t border-slate-100">
      
      {/* Category Tag */}
      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2.5 block">
        Panduan Pelaporan & Verifikasi
      </span>

      {/* Header */}
      <div className="grid lg:grid-cols-12 gap-8 items-start mb-12 lg:mb-16">
        <div className="lg:col-span-7">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.18]">
            Cara melapor. Mudah, cepat, dan terverifikasi.
          </h2>
        </div>
        <div className="lg:col-span-5 lg:pl-6">
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Setiap laporan masyarakat dilengkapi data kondisi, identitas pelapor, lokasi koordinat, dan bukti foto nyata untuk menjamin proses verifikasi yang tepat sasaran.
          </p>
        </div>
      </div>

      {/* 6 Steps Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-blue-600 transition-colors">
                    {step.num}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alur Hasil & Feedback Timeline (Matching clean Sol.it container) */}
      <div className="mt-16 bg-slate-50/70 rounded-3xl p-8 sm:p-10 border border-slate-200/80">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Hasil & Feedback
          </span>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Laporan Anda diproses dan dipantau hingga tuntas.
          </h3>
          <p className="text-sm text-slate-500">
            Pelapor dan publik dapat melihat perkembangan status penanganan drainase secara transparan melalui 4 fase berikut:
          </p>
        </div>

        {/* 4 Stages Progression */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {timelineStages.map((t, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${t.color}`}></span>
                <span className="text-xs font-mono font-bold text-slate-400">FASE 0{idx + 1}</span>
              </div>
              <h5 className="font-bold text-slate-900 text-base mb-1">
                {t.stage}
              </h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs sm:text-sm text-slate-600 font-medium">
            Siap berkontribusi untuk lingkungan Kota Tasikmalaya yang bebas banjir?
          </span>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition"
          >
            <span>Buka Peta & Pilih Titik Drainase</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </section>
  );
};

export default StepsSection;
