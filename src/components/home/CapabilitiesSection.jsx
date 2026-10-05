import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, Minus, Target, Sparkles, CheckCircle2 } from 'lucide-react';

const CapabilitiesSection = () => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-[1180px] mx-auto border-t border-slate-100">
      
      {/* 3 Columns Section (Matching Image 4 Top) */}
      <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        
        {/* Column 1 */}
        <div className="py-6 md:py-0 md:pr-10 space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            SI-DRAINASE
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Peta & Geospasial
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Visualisasi titik sebaran saluran air di seluruh kawasan Tasikmalaya dengan indikator visual dan pop-up informasi detail kapasitas serta riwayat penanganan.
          </p>
        </div>

        {/* Column 2 */}
        <div className="py-6 md:py-0 md:px-10 space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            SI-DRAINASE
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Kuesioner & Verifikasi
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Formulir terstruktur berbasis indikator fisik dan kebersihan untuk mencegah laporan palsu serta menilai tingkat keparahan sumbatan secara objektif.
          </p>
        </div>

        {/* Column 3 */}
        <div className="py-6 md:py-0 md:pl-10 space-y-3">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            Tim Aksatama AMQ
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Prioritisasi Penanganan
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Pengolahan data laporan masyarakat menjadi informasi prioritas pembersihan, sehingga titik krusial dapat ditangani dinas secara lebih terarah dan tepat sasaran.
          </p>
        </div>

      </div>

      {/* Bottom Callout Bar (Matching Image 4 Middle) */}
      <div className="mt-16 pt-12 border-t border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <h4 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Melihat saluran drainase tersumbat di sekitar Anda?
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Partisipasi Anda sangat berharga untuk memetakan titik rawan banjir sebelum musim penghujan tiba. Setiap laporan langsung diproses dan dipantau.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/map"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition group"
            >
              <span>Mulai Lapor Sekarang</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Expandable Accordion (Matching Image 4 Bottom "Lihat seluruh solusi +") */}
      <div className="mt-10 pt-6 border-t border-slate-200">
        <button
          onClick={() => setAccordionOpen(!accordionOpen)}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer py-2"
        >
          <span>Tujuan & Manfaat Platform SI-DRAINASE</span>
          {accordionOpen ? (
            <Minus className="w-4 h-4 text-slate-400" />
          ) : (
            <Plus className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {accordionOpen && (
          <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-8 text-sm animate-fadeIn">
            {/* Tujuan */}
            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <Target className="w-4 h-4" />
                <span>Tujuan Utama</span>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Menganalisis wilayah dengan kondisi drainase buruk dan risiko banjir tinggi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Menyediakan data titik rawan banjir sebagai dasar penentuan prioritas penanganan drainase.</span>
                </li>
              </ul>
            </div>

            {/* Manfaat */}
            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Manfaat Bagi Masyarakat & Kota</span>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Membantu masyarakat memahami hubungan antara kondisi drainase, sumbatan air, dan risiko genangan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Meningkatkan kesadaran kolektif terhadap kebersihan saluran air lingkungan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Mendukung penanganan drainase yang lebih terarah berdasarkan kondisi dan tingkat risiko wilayah.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

    </section>
  );
};

export default CapabilitiesSection;
