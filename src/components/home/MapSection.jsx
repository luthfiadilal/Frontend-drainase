import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ArrowUpRight } from 'lucide-react';

const MapSection = () => {
  const navigate = useNavigate();

  return (
    <section id="peta" className="py-16 lg:py-24 bg-white border-t border-slate-100">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          
          {/* Left Description & Indicators */}
          <div className="flex-1 w-full space-y-6">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Map className="w-5 h-5" />
            </div>
            
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 block">
                Pemetaan Geospasial
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.18]">
                Peta Kondisi Drainase
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Peta interaktif menampilkan titik kondisi drainase di setiap wilayah Kota Tasikmalaya dengan indikator warna yang memudahkan identifikasi status.
            </p>

            {/* 3 Status Cards */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center p-3.5 bg-red-50/70 rounded-xl border border-red-100">
                <div className="w-3.5 h-3.5 bg-red-500 rounded-full mr-3.5 shrink-0 shadow-sm shadow-red-500/50"></div>
                <div>
                  <h4 className="font-bold text-red-900 text-sm">🔴 Danger</h4>
                  <p className="text-red-700 text-xs mt-0.5">Kondisi drainase perlu segera diperiksa dan ditangani.</p>
                </div>
              </div>

              <div className="flex items-center p-3.5 bg-amber-50/70 rounded-xl border border-amber-100">
                <div className="w-3.5 h-3.5 bg-amber-400 rounded-full mr-3.5 shrink-0 shadow-sm shadow-amber-400/50"></div>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">🟡 Waspada</h4>
                  <p className="text-amber-700 text-xs mt-0.5">Kondisi perlu diperhatikan dan dipantau secara berkala.</p>
                </div>
              </div>

              <div className="flex items-center p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full mr-3.5 shrink-0 shadow-sm shadow-emerald-500/50"></div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">🟢 Aman</h4>
                  <p className="text-emerald-700 text-xs mt-0.5">Kondisi relatif baik dan aliran lancar terkendali.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Map Image Card */}
          <div 
            className="flex-1 w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl relative aspect-[4/3] group cursor-pointer" 
            onClick={() => navigate('/map')}
          >
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
              alt="Map Preview" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-luminosity opacity-85" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent flex items-end p-6 sm:p-8">
              <div className="w-full flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-white text-xl sm:text-2xl font-bold mb-1 tracking-tight">Jelajahi Peta Publik</h3>
                  <p className="text-slate-200 text-xs sm:text-sm">Lihat sebaran kondisi drainase di wilayah Anda</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MapSection;
