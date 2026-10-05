import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const FeatureSplitSection = ({ scrollToSection }) => {
  return (
    <section id="fitur-solusi" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1180px] mx-auto border-t border-slate-100">
      
      {/* Top Header Split: Left Title, Right Description (Matching Image 2 Top) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start mb-12 lg:mb-16">
        <div className="lg:col-span-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.18]">
            Dua pilar penanganan. Sesuai kebutuhan wilayah Anda.
          </h2>
        </div>
        <div className="lg:col-span-6 lg:pl-6">
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Mulai dari peran aktif warga melaporkan saluran tersumbat hingga pemantauan geospasial oleh dinas terkait. Pelajari cakupan setiap modul dan kolaborasi data yang dihasilkan.
          </p>
        </div>
      </div>

      {/* Two Column Feature Cards (Matching Image 2 Two Columns) */}
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 pt-8 border-t border-slate-200/80">
        
        {/* Column 1: Sistem Pemetaan Geospasial (GIS) */}
        <div className="flex flex-col justify-between space-y-8">
          <div className="space-y-5">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sistem Pemetaan Wilayah (GIS & Peta)
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Pemetaan visual titik kondisi drainase secara real-time di seluruh wilayah kota. Dilengkapi radius koordinat dan klasifikasi status untuk pengambilan keputusan cepat dinas terkait.
            </p>

            {/* Tags row */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold text-slate-700 pt-2">
              <span className="hover:text-blue-600 transition">Peta Interaktif</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-blue-600 transition">Radius Lokasi Rawan</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-blue-600 transition">Filter Status Wilayah</span>
            </div>

            {/* Sub-note */}
            <p className="text-xs sm:text-sm text-slate-400 pt-2">
              Menampilkan titik kondisi drainase dengan indikator warna Danger, Waspada, dan Aman berbasis analitik laporan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 pt-4">
            <Link
              to="/map"
              className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Lihat Peta Publik</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => scrollToSection ? scrollToSection("alur-kerja") : document.getElementById("alur-kerja")?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-900 hover:text-blue-600 font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Pelajari indikator</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Column 2: Sistem Pelaporan Warga (Crowdsourcing) */}
        <div className="flex flex-col justify-between space-y-8">
          <div className="space-y-5">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sistem Pelaporan Warga (Crowdsourcing)
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Saluran mudah bagi masyarakat untuk melaporkan saluran air yang tersumbat sampah, sedimentasi lumpur, atau rusak, lengkap dengan verifikasi foto kamera dan kuesioner fisik terstandar.
            </p>

            {/* Tags row */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold text-slate-700 pt-2">
              <span className="hover:text-blue-600 transition">Bukti Foto Kamera</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-blue-600 transition">Kuesioner Terstandar</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-blue-600 transition">Pelacakan Status Progres</span>
            </div>

            {/* Sub-note */}
            <p className="text-xs sm:text-sm text-slate-400 pt-2">
              Inovasi pemantauan partisipatif oleh Tim Aksatama SMA Al Muttaqin Kota Tasikmalaya.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 pt-4">
            <Link
              to="/map"
              className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Buat Laporan Baru</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => scrollToSection ? scrollToSection("cara-melapor") : document.getElementById("cara-melapor")?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-900 hover:text-blue-600 font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Lihat cara melapor</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

      </div>

      {/* Proof / Experience Stats Banner (Matching Image 2 Bottom & Image 3 Top) */}
      <div className="mt-24 pt-16 border-t border-slate-100">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Big Number Highlight */}
          <div className="lg:col-span-3">
            <span className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">
              Fokus Wilayah & Skala
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-extrabold text-slate-900 tracking-tight">
                3
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-900">
                Tingkat
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Klasifikasi kondisi drainase di Kota Tasikmalaya
            </p>
          </div>

          {/* Right Text & 3 Key Metrics */}
          <div className="lg:col-span-9 space-y-10">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                Dari saluran tersumbat hingga aliran air yang terkendali.
              </h3>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-3xl">
                Sistem informasi drainase untuk mendukung pemeliharaan saluran air perkotaan. Mengubah laporan acak masyarakat menjadi rencana kerja penanganan yang terarah bagi Dinas PUPR dan relawan lingkungan.
              </p>
            </div>

            {/* 3 Metric Columns with small arrow up right */}
            <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              <div 
                className="group cursor-pointer"
                onClick={() => scrollToSection ? scrollToSection("alur-kerja") : document.getElementById("alur-kerja")?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center gap-1.5 text-2xl font-bold text-slate-900">
                  <span>3 Indikator</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Danger, Waspada, dan Aman
                </p>
                <span className="block text-[11px] text-slate-400 mt-2">
                  Berdasarkan keparahan sumbatan
                </span>
              </div>

              <div 
                className="group cursor-pointer"
                onClick={() => scrollToSection ? scrollToSection("cara-melapor") : document.getElementById("cara-melapor")?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center gap-1.5 text-2xl font-bold text-slate-900">
                  <span>4 Tahapan</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Alur Penanganan Transparan
                </p>
                <span className="block text-[11px] text-slate-400 mt-2">
                  Diterima → Verifikasi → Proses → Selesai
                </span>
              </div>

              <div 
                className="group cursor-pointer"
                onClick={() => scrollToSection ? scrollToSection("identitas-tim") : document.getElementById("identitas-tim")?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center gap-1.5 text-2xl font-bold text-slate-900">
                  <span>100% Terbuka</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Partisipasi Bebas Warga
                </p>
                <span className="block text-[11px] text-slate-400 mt-2">
                  Dikelola Tim Aksatama AMQ
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};

export default FeatureSplitSection;
