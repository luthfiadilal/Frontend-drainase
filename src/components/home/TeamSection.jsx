import React from 'react';
import { Mail, MapPin, Users, Award, ShieldCheck } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TeamSection = () => {
  return (
    <section id="identitas-tim" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1180px] mx-auto border-t border-slate-100">
      
      {/* Category Tag */}
      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2.5 block">
        Inisiatif & Identitas Pengembang
      </span>

      {/* Header */}
      <div className="grid lg:grid-cols-12 gap-8 items-start mb-12 lg:mb-16">
        <div className="lg:col-span-7">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.18]">
            Inovasi berbasis data.<br />Karya generasi muda untuk kota.
          </h2>
        </div>
        <div className="lg:col-span-5 lg:pl-6">
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            SI-DRAINASE digagas dan dikembangkan oleh Tim Aksatama dari SMA Al Muttaqin Kota Tasikmalaya sebagai wujud kontribusi nyata dalam mitigasi risiko bencana hidrometeorologi.
          </p>
        </div>
      </div>

      {/* Main Team Showcase Box */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Team Profile Card */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-medium">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>Tim Inovasi Teknologi</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Tim Aksatama
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              "Data untuk drainase yang lebih terarah, lingkungan yang lebih siap menghadapi banjir."
            </p>

            {/* School & Members */}
            <div className="pt-6 border-t border-white/10 grid sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Asal Sekolah
                </span>
                <p className="text-sm font-bold text-white">
                  SMA Al Muttaqin Kota Tasikmalaya
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Anggota Pengembang
                </span>
                <p className="text-sm font-bold text-white">
                  Hanifah Ardhilah & Gendis Isfany
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Kota Tasikmalaya, Jawa Barat</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Kategori Mitigasi Bencana & Lingkungan</span>
            </div>
          </div>
        </div>

        {/* Contact & Social Information */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200/80 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Kontak & Kolaborasi
              </span>
              <h4 className="text-xl font-bold text-slate-900 tracking-tight">
                Hubungi Kami
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Terbuka untuk diskusi pengembangan fitur, kerjasama institusi, dan masukan pengguna.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:aksatamaamq@gmail.com"
                className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition group shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Surat Elektronik</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">
                    aksatamaamq@gmail.com
                  </span>
                </div>
              </a>

              <a
                href="https://instagram.com/aksatamaamq.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition group shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Instagram Resmi</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-pink-600 transition">
                    @aksatamaamq.id
                  </span>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500">
            📍 Lokasi Riset & Pengembangan: SMA Al Muttaqin Kota Tasikmalaya
          </div>
        </div>

      </div>

    </section>
  );
};

export default TeamSection;
