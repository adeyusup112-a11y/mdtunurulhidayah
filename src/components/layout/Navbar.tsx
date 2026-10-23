import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserCheck, Menu, X, Shield, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPortal: (role?: 'admin' | 'teacher' | 'parent') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenPortal }) => {
  const { currentUser, currentRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil Lembaga' },
    { id: 'visi-misi', label: 'Visi & Misi' },
    { id: 'guru', label: 'Dewan Guru' },
    { id: 'jadwal', label: 'Jadwal Pelajaran' },
    { id: 'berita', label: 'Berita & Pengumuman' },
    { id: 'ppdb', label: 'Pendaftaran (PPDB)' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-amber-300 shadow-sm shrink-0 overflow-hidden">
              <img
                src="/src/assets/images/madrasah_emblem_logo_1792550360091.jpg"
                alt="Logo MDTU Nurul Hidayah"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback icon
                  e.currentTarget.style.display = 'none';
                }}
              />
              <BookOpen className="w-5 h-5 text-amber-300 fallback-icon" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-emerald-950 block whitespace-nowrap">
                MDTU Nurul Hidayah
              </span>
              <span className="text-xs text-stone-500 hidden sm:block whitespace-nowrap">
                Cigoong · Sirnabaya · Rajadesa
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                  activeTab === link.id
                    ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                    : 'hover:text-emerald-800 hover:border-b-2 hover:border-stone-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenPortal()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-amber-300" />
                  <span>
                    Dashboard {currentRole === 'admin' ? 'Admin' : currentRole === 'teacher' ? 'Guru' : 'Orang Tua'}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Keluar dari akun"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenPortal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer border border-emerald-900"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Portal Masuk</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenPortal()}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded-md sm:hidden"
            >
              {currentUser ? 'Dashboard' : 'Portal'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-stone-100">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPortal();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 rounded-lg"
                >
                  <UserCheck className="w-4 h-4 text-amber-300" />
                  Buka Dashboard ({currentUser.fullName})
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs text-rose-700 font-medium"
                >
                  Keluar Akun
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 rounded-lg"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                Masuk ke Portal MDTU
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
