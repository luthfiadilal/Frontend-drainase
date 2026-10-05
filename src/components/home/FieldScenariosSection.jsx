import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const FieldScenariosSection = () => {
  return (
    <section id="kondisi-lapangan" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1180px] mx-auto border-t border-slate-100">
      
      {/* Header Split: Left Big Title, Right Subtitle (Matching Image 5 Top) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start mb-12 lg:mb-16">
        <div className="lg:col-span-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.18]">
            Inovasi yang memahami kondisi lapangan nyata.
          </h2>
        </div>
        <div className="lg:col-span-6 lg:pl-6">
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Mulai dari selokan pemukiman padat penduduk hingga gorong-gorong jalur arteri perkotaan. Kenali sistem pemantauan yang kami terapkan untuk berbagai karakteristik saluran air di Kota Tasikmalaya.
          </p>
        </div>
      </div>

      {/* Two Big Scenario Cards (Matching Image 5 Two Cards) */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
        
        {/* Card 1: Saluran Pemukiman & Padat Penduduk */}
        <div className="bg-slate-50/70 hover:bg-slate-50 rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col justify-between transition-all duration-300">
          
          {/* Top Line Art / Architectural Illustration */}
          <div className="bg-blue-50/50 p-8 sm:p-10 border-b border-slate-200/60 relative">
            <span className="text-xs font-bold text-slate-500 tracking-wide block mb-4">
              Kawasan Pemukiman & Gang Padat
            </span>

            {/* Custom SVG Line Art (Matching Image 5 technical blueprint style) */}
            <div className="w-full h-36 flex items-center justify-center text-blue-600">
              <svg viewBox="0 0 400 160" className="w-full h-full max-w-[340px] stroke-blue-600 fill-none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                {/* Residential houses */}
                <path d="M40 120 L40 70 L80 40 L120 70 L120 120 Z" />
                <path d="M70 120 L70 90 L90 90 L90 120" />
                <rect x="55" y="65" width="16" height="16" />
                
                <path d="M120 120 L120 75 L160 50 L200 75 L200 120 Z" />
                <path d="M150 120 L150 95 L170 95 L170 120" />
                <rect x="135" y="70" width="16" height="16" />

                {/* Local Drainage / Got */}
                <path d="M20 135 L260 135" strokeDasharray="4 4" />
                <path d="M20 145 L260 145" />
                <path d="M60 135 L60 145" />
                <path d="M120 135 L120 145" />
                <path d="M180 135 L180 145" />
                <path d="M240 135 L240 145" />

                {/* Flow Arrow */}
                <path d="M290 90 L330 90 M320 80 L330 90 L320 100" />
                
                {/* Sedimentation / Trash Indicator Box */}
                <rect x="335" y="110" width="30" height="30" rx="3" strokeDasharray="2 2" />
                <path d="M340 125 L360 125" />
              </svg>
            </div>
          </div>

          {/* Bottom Content Body */}
          <div className="p-8 sm:p-10 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Dari pekarangan warga hingga sanitasi lingkungan.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Mendeteksi timbunan sampah rumah tangga, endapan lumpur, dan pendangkalan got mikro yang kerap meluap ke pekarangan warga saat curah hujan tinggi.
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 pt-2">
                <span className="px-3 py-1 bg-white rounded-md border border-slate-200">Got Pemukiman</span>
                <span className="px-3 py-1 bg-white rounded-md border border-slate-200">Sampah Domestik</span>
                <span className="px-3 py-1 bg-white rounded-md border border-slate-200">Sedimentasi Tanah</span>
              </div>
            </div>

            {/* Experience implementation note */}
            <div className="pt-6 border-t border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Fokus Penanganan
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Pembersihan rutin gotong royong warga dan penjadwalan angkut sampah lingkungan.
              </p>
            </div>
          </div>

        </div>

        {/* Card 2: Saluran Utama & Protokol Kota */}
        <div className="bg-slate-50/70 hover:bg-slate-50 rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col justify-between transition-all duration-300">
          
          {/* Top Line Art / City Illustration */}
          <div className="bg-blue-50/50 p-8 sm:p-10 border-b border-slate-200/60 relative">
            <span className="text-xs font-bold text-slate-500 tracking-wide block mb-4">
              Jalur Protokol & Arteri Perkotaan
            </span>

            {/* Custom SVG Line Art (City buildings, culverts, street) */}
            <div className="w-full h-36 flex items-center justify-center text-blue-600">
              <svg viewBox="0 0 400 160" className="w-full h-full max-w-[340px] stroke-blue-600 fill-none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                {/* Storefront / City buildings */}
                <path d="M40 60 L180 60 L170 80 L30 80 Z" />
                <rect x="30" y="80" width="140" height="45" />
                <rect x="50" y="90" width="40" height="35" />
                <rect x="110" y="90" width="40" height="35" />

                {/* Street level & Crosswalk */}
                <path d="M20 135 L380 135" />
                <path d="M20 145 L380 145" />

                {/* Subterranean Box Culvert (Gorong-gorong) */}
                <rect x="230" y="65" width="55" height="60" rx="4" />
                <rect x="240" y="75" width="35" height="40" strokeDasharray="3 3" />

                {/* Water flow indicator */}
                <path d="M190 90 L220 90 M210 82 L220 90 L210 98" />
                <path d="M300 90 L340 90 M330 82 L340 90 L330 98" />
              </svg>
            </div>
          </div>

          {/* Bottom Content Body */}
          <div className="p-8 sm:p-10 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Dari kelancaran jalan hingga pencegahan banjir kiriman.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Memantau kapasitas saluran primer dan gorong-gorong di sepanjang jalan protokol yang berpotensi meluap ke badan jalan dan melumpuhkan mobilitas kota.
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 pt-2">
                <span className="px-3 py-1 bg-white rounded-md border border-slate-200">Gorong-gorong</span>
                <span className="px-3 py-1 bg-white rounded-md border border-slate-200">Saluran Arteri</span>
                <span className="px-3 py-1 bg-white rounded-md border border-slate-200">Tutup Plat Beton</span>
              </div>
            </div>

            {/* Experience implementation note */}
            <div className="pt-6 border-t border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Fokus Penanganan
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Pengerukan endapan lumpur dengan alat berat oleh Dinas PUPR Kota Tasikmalaya.
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default FieldScenariosSection;
