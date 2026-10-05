import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';

const InstagramIcon = ({ className = "w-3.5 h-3.5" }) => (
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

const Footer = ({ scrollToSection }) => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-12 gap-12 pb-16 border-b border-slate-800">
          
          {/* Brand & Purpose (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                SI-DRAINASE
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/30">
                Kota Tasikmalaya
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Data untuk drainase yang lebih terarah, lingkungan yang lebih siap menghadapi banjir. Platform pemantauan partisipatif dan prioritas penanganan saluran air.
            </p>

            <div className="pt-2">
              <span className="text-xs text-slate-500 italic block">
                "Inovasi berbasis data untuk mendukung mitigasi risiko banjir."
              </span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => scrollToSection ? scrollToSection("hero") : window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection ? scrollToSection("fitur-solusi") : document.getElementById("fitur-solusi")?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Solusi & Fitur
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection ? scrollToSection("alur-kerja") : document.getElementById("alur-kerja")?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Klasifikasi & Indikator
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection ? scrollToSection("cara-melapor") : document.getElementById("cara-melapor")?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Cara Melapor
                </button>
              </li>
              <li>
                <Link to="/map" className="hover:text-blue-400 transition inline-flex items-center gap-1">
                  Peta Publik <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition inline-flex items-center gap-1">
                  Portal Admin <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Tim & Kontak (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Pengembang & Kontak
            </h4>
            
            <div className="space-y-2 text-sm text-slate-300">
              <p className="font-semibold text-white">Tim Aksatama</p>
              <p className="text-xs text-slate-400">
                SMA Al Muttaqin Kota Tasikmalaya<br />
                Anggota: Hanifah Ardhilah, Gendis Isfany
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <a
                href="mailto:aksatamaamq@gmail.com"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>aksatamaamq@gmail.com</span>
              </a>
              <a
                href="https://instagram.com/aksatamaamq.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>@aksatamaamq.id</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kota Tasikmalaya, Jawa Barat</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SI-DRAINASE — Tim Aksatama SMA Al Muttaqin. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
