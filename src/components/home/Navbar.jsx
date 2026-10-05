import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Menu, X, Lock } from "lucide-react";
import logoImg from "../../assets/images/LOGO-DRAINASE.png";
import logoLight from "../../assets/images/LOGO-DRAINASE2.jpg";

const Navbar = ({ scrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-slate-100 transition-all">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[68px] gap-3 sm:gap-4 lg:gap-6">
          {/* Logo Section */}
          <div
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            onClick={() => handleNavClick("hero")}
          >
            <img
              src={logoImg || logoLight}
              alt="SI-DRAINASE Logo"
              className="h-6 w-auto object-contain rounded transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = logoLight;
              }}
            />
            <span className="font-extrabold text-[1.12rem] tracking-tight text-slate-900 whitespace-nowrap">
              SI-DRAINASE
            </span>
            <div className="hidden sm:block h-3 w-px bg-slate-200 ml-1"></div>
            <span className="hidden sm:block text-[10px] font-semibold text-slate-400 tracking-wider uppercase whitespace-nowrap">
              Kota Tasikmalaya
            </span>
          </div>

          {/* Center Navigation Links (Compact & Sol.it style) */}
          <div className="hidden lg:flex items-center justify-center gap-3.5 xl:gap-5 text-[12px] font-medium text-slate-600 whitespace-nowrap">
            <button
              onClick={() => handleNavClick("fitur-solusi")}
              className="hover:text-blue-600 transition-colors cursor-pointer py-1"
            >
              Solusi & Fitur
            </button>
            <button
              onClick={() => handleNavClick("alur-kerja")}
              className="hover:text-blue-600 transition-colors cursor-pointer py-1"
            >
              Alur & Indikator
            </button>
            <button
              onClick={() => handleNavClick("kondisi-lapangan")}
              className="hover:text-blue-600 transition-colors cursor-pointer py-1"
            >
              Kondisi Lapangan
            </button>
            <button
              onClick={() => handleNavClick("cara-melapor")}
              className="hover:text-blue-600 transition-colors cursor-pointer py-1"
            >
              Cara Melapor
            </button>
            <button
              onClick={() => handleNavClick("identitas-tim")}
              className="hover:text-blue-600 transition-colors cursor-pointer py-1"
            >
              Tim Aksatama
            </button>
          </div>

          {/* Right Section: Language Toggle, Admin & Dark CTA */}
          <div className="hidden md:flex items-center gap-3 xl:gap-4 shrink-0">
            {/* Admin Link (Compact) */}
            <Link
              to="/login"
              className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider transition-colors whitespace-nowrap px-1"
            >
              Admin
            </Link>

            {/* Primary Dark Pill Button with Arrow */}
            <Link
              to="/map"
              className="bg-[#0B1528] hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow whitespace-nowrap"
            >
              <span>Laporkan Drainase</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/map"
              className="bg-[#0B1528] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 whitespace-nowrap"
            >
              <span>Lapor</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-xl space-y-4">
          <div className="flex flex-col space-y-2.5 text-sm font-semibold text-slate-700">
            <button
              onClick={() => handleNavClick("fitur-solusi")}
              className="text-left py-1.5 hover:text-blue-600"
            >
              Solusi & Fitur
            </button>
            <button
              onClick={() => handleNavClick("alur-kerja")}
              className="text-left py-1.5 hover:text-blue-600"
            >
              Alur & Indikator
            </button>
            <button
              onClick={() => handleNavClick("kondisi-lapangan")}
              className="text-left py-1.5 hover:text-blue-600"
            >
              Kondisi Lapangan
            </button>
            <button
              onClick={() => handleNavClick("cara-melapor")}
              className="text-left py-1.5 hover:text-blue-600"
            >
              Cara Melapor
            </button>
            <button
              onClick={() => handleNavClick("identitas-tim")}
              className="text-left py-1.5 hover:text-blue-600"
            >
              Tim Aksatama
            </button>
            <Link
              to="/map"
              className="text-left py-1.5 text-blue-600 font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Buka Peta Publik ↗
            </Link>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login Petugas / Admin
            </Link>
            <span className="text-[11px] text-slate-400 font-medium">
              Kota Tasikmalaya
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
