import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenPortal: (role?: 'admin' | 'teacher' | 'parent') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPortal }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-800 flex items-center justify-center p-1 border border-amber-400/40">
                <img
                  src="/src/assets/images/madrasah_emblem_logo_1792550360091.jpg"
                  alt="Logo MDTU Nurul Hidayah"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-base tracking-tight">MDTU Nurul Hidayah</h3>
                <p className="text-xs text-amber-300 font-medium">Madrasah Diniyah Takmiliyah Ula</p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Lembaga pendidikan Islam non-formal berjenjang Ula yang berkomitmen menanamkan akidah salafus shalih, akhlakul karimah, serta kecakapan membaca dan menghafal Al-Qur’an di Kabupaten Ciamis.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <div>
                <span className="text-stone-300 font-medium">Kepala Lembaga:</span> Ust. Ade Yusup, S.Pd.
              </div>
              <div>
                <span className="text-stone-300 font-medium">Status Lembaga:</span> Terdaftar di Kemenag RI
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase border-b border-stone-800 pb-2">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Beranda Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profil')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Profil & Sejarah Lembaga
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('visi-misi')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Visi, Misi & Tujuan Pendidikan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guru')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Daftar Dewan Asatidz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('jadwal')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Jadwal Pelajaran Santri
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ppdb')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Pendaftaran Santri Baru (PPDB)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('berita')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Warta & Pengumuman Madrasah
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase border-b border-stone-800 pb-2">
              Kontak & Alamat
            </h4>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Kp. Dukuh Sari, Dusun Cigoong, RT 03 RW 01, Desa Sirnabaya, Kec. Rajadesa, Kab. Ciamis, Jawa Barat 46254
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:082315987599" className="hover:text-amber-300 transition-colors">
                  0823-1598-7599 (182315987599)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:nurulhidayah177@gmail.com" className="hover:text-amber-300 transition-colors">
                  nurulhidayah177@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Jam Belajar: Senin – Minggu, 13:00 – 16:00 WIB (Jumat Libur)</span>
              </div>
            </div>
          </div>

          {/* Access Portals */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase border-b border-stone-800 pb-2">
              Akses Sistem Terpadu
            </h4>
            <p className="text-xs text-stone-400">
              Pusat sistem administrasi akademik, buku absensi, mutaba’ah santri, dan pembayaran SPP bulanan.
            </p>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                onClick={() => onOpenPortal('teacher')}
                className="w-full text-left px-3 py-2 rounded bg-stone-800/80 hover:bg-emerald-900/60 border border-stone-700/60 text-xs text-stone-200 transition-colors flex items-center justify-between"
              >
                <span>Portal Dewan Guru</span>
                <span className="text-[10px] text-stone-400">4 Asatidz</span>
              </button>
              <button
                onClick={() => onOpenPortal('parent')}
                className="w-full text-left px-3 py-2 rounded bg-stone-800/80 hover:bg-emerald-900/60 border border-stone-700/60 text-xs text-stone-200 transition-colors flex items-center justify-between"
              >
                <span>Portal Wali Santri</span>
                <span className="text-[10px] text-stone-400">40 Akun</span>
              </button>
              <button
                onClick={() => onOpenPortal('admin')}
                className="w-full text-left px-3 py-2 rounded bg-stone-800/80 hover:bg-emerald-900/60 border border-stone-700/60 text-xs text-stone-200 transition-colors flex items-center justify-between"
              >
                <span>Portal Pengelola (Admin)</span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Footer */}
      <div className="border-t border-stone-800/80 bg-stone-950 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MDTU Nurul Hidayah Cigoong Sirnabaya Rajadesa Ciamis. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1 text-[11px] text-stone-400">
            <span>Sistem Informasi Terintegrasi Pendidikan Diniyah Islam</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
