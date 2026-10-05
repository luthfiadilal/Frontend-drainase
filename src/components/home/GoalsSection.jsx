import React from 'react';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';

const GoalsSection = () => {
  return (
    <section id="tujuan" className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>
      
      {/* Container aligned with Navbar */}
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Category Tag */}
        <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-3 block">
          Misi & Dampak
        </span>

        {/* Section Heading */}
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-[1.18] mb-3">
            Tujuan & Manfaat SI-DRAINASE
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Mewujudkan sistem pemantauan saluran air berbasis data untuk mendukung keselamatan lingkungan dan mitigasi banjir berkelanjutan di Kota Tasikmalaya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Column 1: Tujuan */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Tujuan Utama</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3.5 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    1
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Menganalisis wilayah dengan kondisi drainase buruk dan risiko genangan/banjir tinggi di Kota Tasikmalaya.
                  </p>
                </li>
                <li className="flex items-start gap-3.5 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    2
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Menyediakan basis data titik rawan banjir terverifikasi sebagai dasar penentuan prioritas penanganan Dinas PUPR.
                  </p>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs text-slate-400">
              🎯 Fokus: Pengambilan keputusan berbasis bukti nyata lapangan.
            </div>
          </div>

          {/* Column 2: Manfaat */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Manfaat Nyata</h3>
              </div>

              <ul className="space-y-3.5">
                <li className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Membantu masyarakat memahami keterkaitan antara kondisi fisik drainase, hambatan aliran, dan risiko banjir.
                  </p>
                </li>
                <li className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Meningkatkan kesadaran gotong royong dan kepedulian terhadap kebersihan saluran air lingkungan warga.
                  </p>
                </li>
                <li className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Mendukung alokasi logistik dan penanganan drainase yang lebih terarah berdasarkan tingkat keparahan wilayah.
                  </p>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs text-slate-400">
              🌱 Dampak: Lingkungan perkotaan yang tangguh dan siap siaga.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
