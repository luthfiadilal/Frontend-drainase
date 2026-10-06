import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDown, MapPin, FileText, Check, RefreshCw, CornerDownRight } from 'lucide-react';

const HeroSection = ({ scrollToSection }) => {
  return (
    <section id="hero" className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-[1180px] mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column: Typography & CTAs (Sol.it Hero Left) */}
        <div className="lg:col-span-7 text-left z-10 min-w-0">
          {/* Subtle blue bullet badge */}
          <div className="inline-flex items-start sm:items-center gap-2.5 text-blue-600 font-semibold text-xs sm:text-[12.5px] tracking-wide mb-5 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0 mt-1.5 sm:mt-0"></span>
            <span className="text-left">Inovasi mitigasi risiko banjir berbasis data Kota Tasikmalaya</span>
          </div>
          
          {/* Main Headline - scaled down comfortably */}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 tracking-tight leading-[1.14] mb-6">
            Dari laporan warga<br className="hidden sm:inline" /> hingga tindakan nyata<br className="hidden sm:inline" /> di lapangan.
          </h1>
          
          {/* Subtitle Paragraph */}
          <p className="text-sm sm:text-base text-slate-500 mb-8 max-w-xl leading-relaxed font-normal">
            Platform pengolahan data kondisi drainase berbasis partisipasi masyarakat untuk menentukan prioritas pembersihan dan pemeliharaan saluran air secara lebih terarah, cepat, dan tepat sasaran.
          </p>
          
          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
            <Link 
              to="/map" 
              className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-3.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-[0.99]"
            >
              <span>Laporkan Drainase Sekarang</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            
            <button 
              onClick={() => scrollToSection ? scrollToSection("fitur-solusi") : document.getElementById("fitur-solusi")?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-700 hover:text-blue-600 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 py-3 px-2 group cursor-pointer"
            >
              <span>Lihat Solusi & Fitur</span>
              <ArrowDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-y-0.5 transition-all" />
            </button>
          </div>
        </div>
        
        {/* Right Column: Iconic Blue Flow Card (Sol.it Hero Right) */}
        <div className="lg:col-span-5 w-full relative min-w-0">
          <div className="bg-[#2563EB] rounded-[28px] p-6 sm:p-7 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            
            {/* Subtle background radial light */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700/40 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header text */}
            <div className="relative z-10 mb-5">
              <span className="text-blue-100 text-xs sm:text-[13px] font-medium tracking-wide">
                Alur kerja yang saling terhubung
              </span>
            </div>

            {/* Floating Connected Cards Structure */}
            <div className="relative z-10 flex flex-col items-center my-auto space-y-3.5">
              
              {/* Card 1: Top Floating Card (Tilted) */}
              <div className="w-full bg-white text-slate-800 rounded-xl p-3.5 sm:p-4 shadow-md shadow-black/10 -rotate-2 hover:rotate-0 transition-transform duration-300 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">
                    Laporan Partisipasi Warga
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Titik GPS / Bukti Foto Aktual / Kuesioner Fisik
                  </p>
                </div>
              </div>

              {/* Connecting Down Arrow 1 */}
              <div className="flex flex-col items-center">
                <div className="h-3 w-px bg-white/40"></div>
                <ArrowDown className="w-3.5 h-3.5 text-white/80 my-0.5" />
              </div>

              {/* Middle Label: Core Engine Sync */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-700/60 backdrop-blur-sm border border-white/20 text-white shadow-inner">
                <RefreshCw className="w-3 h-3 animate-spin text-blue-200" style={{ animationDuration: '6s' }} />
                <span className="text-[11px] font-bold tracking-wide">
                  GIS & Prioritas Pembersihan
                </span>
              </div>

              {/* Connecting Down Arrow 2 */}
              <div className="flex flex-col items-center">
                <ArrowDown className="w-3.5 h-3.5 text-white/80 my-0.5" />
                <div className="h-3 w-px bg-white/40"></div>
              </div>

              {/* Card 2: Bottom Floating Card (Tilted with checkmark) */}
              <div className="w-full bg-white text-slate-800 rounded-xl p-3.5 sm:p-4 shadow-md shadow-black/10 rotate-1 hover:rotate-0 transition-transform duration-300 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">
                      Prioritas & Tindakan Lapangan
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Klasifikasi Danger, Waspada, Aman & Satgas
                    </p>
                  </div>
                </div>
                {/* Sol.it dark check circle badge */}
                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

            </div>

            {/* Bottom Subtext */}
            <div className="relative z-10 mt-5 pt-3.5 border-t border-white/15 flex items-center gap-2 text-[11px] sm:text-xs text-blue-100 font-medium">
              <CornerDownRight className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <span>Integrasi data terarah untuk mitigasi genangan & banjir</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
