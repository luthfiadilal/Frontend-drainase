import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, AlertTriangle, AlertCircle, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

const indicatorData = [
  {
    id: 'danger',
    tabTitle: 'Danger (Tindakan Segera)',
    badgeColor: 'text-red-600 bg-red-50 border-red-200',
    dotColor: 'bg-red-500',
    title: 'Dari pengaduan warga hingga tindakan darurat dinas.',
    description: 'Wilayah dengan kondisi drainase tersumbat parah oleh sampah padat, endapan lumpur tebal >50%, atau dinding saluran jebol sehingga menghambat total aliran air dan memicu genangan banjir saat hujan deras.',
    bullets: [
      'Kondisi drainase perlu segera diperiksa dan ditangani tim satgas',
      'Masuk ke urutan prioritas teratas pada dashboard pengolahan data',
      'Dilengkapi foto bukti autentik dan verifikasi titik koordinat GPS'
    ],
    mockCard: {
      tag: 'PRIORITAS DANGER #01',
      tagColor: 'bg-red-500 text-white',
      title: 'Saluran Tersumbat Parah',
      location: 'Jl. Sutisna Senjaya / Cihideung, Tasikmalaya',
      level: 'Kritis — Risiko Genangan Tinggi',
      severity: 92,
      metrics: [
        { label: 'Hambatan Aliran', value: '85% Tersumbat' },
        { label: 'Penyebab', value: 'Sampah & Lumpur' },
        { label: 'Status Tindakan', value: 'Diverifikasi Dinas' }
      ]
    }
  },
  {
    id: 'waspada',
    tabTitle: 'Waspada (Pemantauan)',
    badgeColor: 'text-amber-600 bg-amber-50 border-amber-200',
    dotColor: 'bg-amber-400',
    title: 'Dari deteksi endapan hingga pemeliharaan berkala.',
    description: 'Kondisi drainase yang mulai mengalami penumpukan sampah ringan, pasir, atau tumbuhan liar. Kapasitas tampung berkurang dan membutuhkan pembersihan berkala agar tidak berkembang menjadi sumbatan total.',
    bullets: [
      'Kondisi perlu diperhatikan dan dipantau secara berkala',
      'Rekomendasi pembersihan terjadwal atau gotong royong warga',
      'Pemantauan tren laporan masyarakat sebelum musim penghujan tiba'
    ],
    mockCard: {
      tag: 'STATUS WASPADA #02',
      tagColor: 'bg-amber-400 text-slate-900',
      title: 'Endapan Lumpur & Rumput Liar',
      location: 'Kawasan Cipedes / Nagarasari, Tasikmalaya',
      level: 'Waspada — Memerlukan Pembersihan',
      severity: 45,
      metrics: [
        { label: 'Hambatan Aliran', value: '40% Tertimbun' },
        { label: 'Penyebab', value: 'Sedimentasi Pasir' },
        { label: 'Status Tindakan', value: 'Antrean Satgas' }
      ]
    }
  },
  {
    id: 'aman',
    tabTitle: 'Aman (Aliran Lancar)',
    badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    dotColor: 'bg-emerald-500',
    title: 'Dari pemantauan rutin hingga debit air optimal.',
    description: 'Saluran drainase yang bersih, terawat, dinding saluran kokoh, dan air mengalir dengan lancar tanpa hambatan berarti menuju muara pembuangan akhir.',
    bullets: [
      'Kondisi relatif baik dan kapasitas saluran optimal',
      'Menjadi standar pemeliharaan infrastruktur drainase perkotaan',
      'Terpantau hijau pada peta digital publik SI-DRAINASE'
    ],
    mockCard: {
      tag: 'KONDISI AMAN #03',
      tagColor: 'bg-emerald-500 text-white',
      title: 'Saluran Normal & Bersih',
      location: 'Saluran Arteri Jl. Mitra Batik, Tasikmalaya',
      level: 'Normal — Aliran Lancar Bebas Banjir',
      severity: 10,
      metrics: [
        { label: 'Hambatan Aliran', value: '0% (Bersih)' },
        { label: 'Penyebab', value: 'Saluran Terawat' },
        { label: 'Status Tindakan', value: 'Terawat Optimal' }
      ]
    }
  }
];

const WorkflowTabsSection = () => {
  const [activeTab, setActiveTab] = useState('danger');
  const current = indicatorData.find((item) => item.id === activeTab) || indicatorData[0];

  return (
    <section id="alur-kerja" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1180px] mx-auto border-t border-slate-100">
      
      {/* Category Tag (Sol.it style blue small uppercase) */}
      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2.5 block">
        Klasifikasi & Indikator Risiko
      </span>

      {/* Title & Subtext Split Header (Matching Image 3 Top) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">
        <div className="lg:col-span-7">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.18]">
            Seluruh alur penanganan.<br />Bukan sekadar laporan baru.
          </h2>
        </div>
        <div className="lg:col-span-5 lg:pl-6">
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Mulai dari warga mengidentifikasi masalah, sistem mengklasifikasikan tingkat keparahan berdasarkan kuesioner dan foto, hingga dinas menyusun jadwal pembersihan secara terarah.
          </p>
        </div>
      </div>

      {/* Interactive Tabs Row (Matching Image 3 Tab Bar) */}
      <div className="border-b border-slate-200 mb-0 flex flex-wrap gap-2 sm:gap-4">
        {indicatorData.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-3 sm:px-5 text-sm sm:text-base font-bold transition-all flex items-center gap-2 relative cursor-pointer ${
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-[1px]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${tab.dotColor}`}></span>
              <span>{tab.tabTitle}</span>
              <ArrowUpRight className={`w-4 h-4 transition-transform ${isActive ? 'text-blue-600 translate-x-0.5 -translate-y-0.5' : 'text-slate-300'}`} />
            </button>
          );
        })}
      </div>

      {/* Tab Content Box (Matching Image 3 Big Content Container) */}
      <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 mt-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Details (Matching Image 3 Left) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              {current.title}
            </h3>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {current.description}
            </p>

            {/* Checklist with checkmarks */}
            <div className="space-y-3.5 pt-2">
              {current.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 leading-snug">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <div className="pt-4">
              <Link
                to="/map"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
              >
                <span>Jelajahi indikator ini pada Peta Publik</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Sleek Mockup Card (Matching Image 3 Right Preview) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-lg shadow-slate-200/50 border border-slate-200">
              
              {/* Card Header Tag */}
              <div className="flex items-center justify-between mb-5">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${current.mockCard.tagColor}`}>
                  {current.mockCard.tag}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kota Tasikmalaya</span>
                </div>
              </div>

              {/* Card Title & Location */}
              <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
                {current.mockCard.title}
              </h4>
              <p className="text-xs text-slate-500 mb-5">
                {current.mockCard.location}
              </p>

              {/* Progress / Severity Bar */}
              <div className="space-y-1.5 mb-6">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Tingkat Keparahan / Hambatan</span>
                  <span>{current.mockCard.severity}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      activeTab === 'danger'
                        ? 'bg-red-500'
                        : activeTab === 'waspada'
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${current.mockCard.severity}%` }}
                  ></div>
                </div>
              </div>

              {/* Metrics Table */}
              <div className="divide-y divide-slate-100 text-xs">
                {current.mockCard.metrics.map((m, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center">
                    <span className="text-slate-400 font-medium">{m.label}</span>
                    <span className="text-slate-800 font-bold">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Card Action */}
              <Link
                to="/map"
                className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <span>Lihat Status di Peta</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default WorkflowTabsSection;
