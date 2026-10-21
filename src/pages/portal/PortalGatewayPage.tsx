import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, TeacherProfile, ParentProfile } from '../../types';
import { storageService } from '../../services/storageService';
import {
  GraduationCap,
  ShieldCheck,
  Users,
  FileText,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  X
} from 'lucide-react';

interface PortalGatewayPageProps {
  onNavigatePublic: (tab: string) => void;
  defaultRole?: UserRole;
}

export const PortalGatewayPage: React.FC<PortalGatewayPageProps> = ({
  onNavigatePublic,
  defaultRole
}) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(defaultRole || null);

  // Form states
  const [selectedIdentifier, setSelectedIdentifier] = useState('');
  const [customIdentifier, setCustomIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Recovery modal
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryAccountName, setRecoveryAccountName] = useState('');
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);

  // Data lists for selector
  const teachers = storageService.getTeachers();
  const parents = storageService.getParents();
  const students = storageService.getStudents();

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    setPassword('');
    setSelectedIdentifier('');
    setCustomIdentifier('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedRole) {
      setErrorMessage('Silakan pilih portal terlebih dahulu.');
      return;
    }

    const idToUse = selectedIdentifier || customIdentifier;
    if (!idToUse.trim()) {
      setErrorMessage('Silakan pilih akun Anda atau masukkan identitas akun.');
      return;
    }

    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    try {
      const res = login(idToUse, password, selectedRole);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Terjadi kendala autentikasi. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryAccountName || !recoveryPhone) return;

    storageService.logActivity(
      recoveryAccountName,
      'public',
      'PASSWORD_RECOVERY_REQUEST',
      `Permintaan bantuan pemulihan sandi diajukan untuk kontak: ${recoveryPhone}`
    );
    setRecoverySubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Sistem Autentikasi Terintegrasi
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Portal Masuk MDTU Nurul Hidayah
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Pintu akses resmi pengurus, dewan guru, dan orang tua santri. Pilih portal sesuai peran Anda untuk mengelola atau memantau proses pendidikan santri.
        </p>
      </div>

      {/* 4 Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Portal Guru */}
        <button
          onClick={() => handleSelectRole('teacher')}
          className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
            selectedRole === 'teacher'
              ? 'bg-emerald-900 text-white border-emerald-950 shadow-lg scale-102 ring-2 ring-emerald-700'
              : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-600 hover:shadow-md'
          }`}
        >
          <div className="space-y-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                selectedRole === 'teacher' ? 'bg-white/10 text-amber-300' : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base">Portal Guru</h2>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  selectedRole === 'teacher' ? 'text-emerald-100' : 'text-stone-500'
                }`}
              >
                Akses khusus 4 dewan asatidz pengampu kelas untuk mutaba'ah, absensi, dan nilai santri.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-stone-200/40">
            <span>{selectedRole === 'teacher' ? 'Portal Terpilih' : 'Pilih Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* 2. Portal Admin */}
        <button
          onClick={() => handleSelectRole('admin')}
          className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
            selectedRole === 'admin'
              ? 'bg-emerald-900 text-white border-emerald-950 shadow-lg scale-102 ring-2 ring-emerald-700'
              : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-600 hover:shadow-md'
          }`}
        >
          <div className="space-y-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                selectedRole === 'admin' ? 'bg-white/10 text-amber-300' : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base">Portal Admin</h2>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  selectedRole === 'admin' ? 'text-emerald-100' : 'text-stone-500'
                }`}
              >
                Pusat komando tata kelola madrasah, keuangan SPP, data induk, PPDB, dan konfigurasi website.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-stone-200/40">
            <span>{selectedRole === 'admin' ? 'Portal Terpilih' : 'Pilih Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* 3. Portal Orang Tua */}
        <button
          onClick={() => handleSelectRole('parent')}
          className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
            selectedRole === 'parent'
              ? 'bg-emerald-900 text-white border-emerald-950 shadow-lg scale-102 ring-2 ring-emerald-700'
              : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-600 hover:shadow-md'
          }`}
        >
          <div className="space-y-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                selectedRole === 'parent' ? 'bg-white/10 text-amber-300' : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base">Portal Orang Tua</h2>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  selectedRole === 'parent' ? 'text-emerald-100' : 'text-stone-500'
                }`}
              >
                Tersedia untuk 40 akun wali santri untuk memantau kehadiran, nilai hafalan, tagihan SPP, dan kuitansi.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-stone-200/40">
            <span>{selectedRole === 'parent' ? 'Portal Terpilih' : 'Pilih Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* 4. Pendaftaran Siswa Baru (PPDB Online Publik) */}
        <button
          onClick={() => onNavigatePublic('ppdb')}
          className="p-6 rounded-2xl border border-amber-300 bg-amber-50/50 hover:bg-amber-100/60 text-stone-900 text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-xs"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-200/70 text-amber-900 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Akses Publik Bebas
              </span>
              <h2 className="font-bold text-base">Pendaftaran Santri Baru</h2>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Pengisian formulir pendaftaran santri baru online tanpa harus memiliki akun login sebelumnya.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-amber-950 pt-2 border-t border-amber-200">
            <span>Buka Formulir PPDB</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Login Box */}
      {selectedRole && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Autentikasi Aman
                </span>
                <h3 className="text-xl font-bold text-stone-900">
                  Masuk ke Portal {selectedRole === 'admin' ? 'Pengelola (Admin)' : selectedRole === 'teacher' ? 'Dewan Guru' : 'Orang Tua / Wali'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-xs text-stone-400 hover:text-stone-700 underline"
              >
                Ganti Peran
              </button>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Pilih akun atau identitas Anda, lalu masukkan kata sandi untuk melanjutkan.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Account Selector (Clean, non-sensitive identity) */}
            {selectedRole === 'teacher' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Pilih Nama Guru / Asatidz *</label>
                <select
                  value={selectedIdentifier}
                  onChange={(e) => setSelectedIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none bg-white font-medium"
                >
                  <option value="">-- Pilih Guru yang Bertugas --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.userId}>
                      {t.title} — ({t.roleTitle})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'parent' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700">Pilih Akun Wali Santri *</label>
                <select
                  value={selectedIdentifier}
                  onChange={(e) => setSelectedIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none bg-white font-medium"
                >
                  <option value="">-- Pilih Nama Wali Santri / Ananda --</option>
                  {parents.map((p) => {
                    const firstStudent = students.find((s) => p.studentIds.includes(s.id));
                    return (
                      <option key={p.id} value={p.userId}>
                        {p.fullName} — Wali dari {firstStudent?.fullName || 'Santri'} ({firstStudent?.classId.replace('class_', 'Kelas ')})
                      </option>
                    );
                  })}
                </select>
                <p className="text-[11px] text-stone-400">
                  Atau Anda juga dapat memasukkan nomor WhatsApp / Username orang tua di bawah jika tidak ingin memilih dari daftar.
                </p>
                <input
                  type="text"
                  placeholder="Atau ketik Nomor HP / Username Orang Tua..."
                  value={customIdentifier}
                  onChange={(e) => {
                    setCustomIdentifier(e.target.value);
                    if (e.target.value) setSelectedIdentifier('');
                  }}
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>
            )}

            {selectedRole === 'admin' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Identitas Akun Admin *</label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={customIdentifier || selectedIdentifier}
                  onChange={(e) => {
                    setCustomIdentifier(e.target.value);
                    setSelectedIdentifier(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none font-medium"
                />
              </div>
            )}

            {/* Password input with toggle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700">Kata Sandi Akun *</label>
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(true)}
                  className="text-[11px] text-emerald-800 hover:underline"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold rounded-lg text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => {
                setShowRecoveryModal(false);
                setRecoverySubmitted(false);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">Bantuan Pemulihan Kata Sandi</h3>
              <p className="text-xs text-stone-500">
                Sesuai standar privasi, sandi dienkripsi secara aman. Admin madrasah dapat menerbitkan sandi aktivasi baru untuk akun Anda.
              </p>
            </div>

            {recoverySubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <p className="text-xs text-stone-700">
                  Permintaan reset telah dicatat di log sistem. Pengurus/Admin akan menghubungi nomor kontak Anda untuk verifikasi identitas.
                </p>
                <button
                  onClick={() => setShowRecoveryModal(false)}
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecoverySubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Nama Akun / Nama Santri</label>
                  <input
                    type="text"
                    required
                    value={recoveryAccountName}
                    onChange={(e) => setRecoveryAccountName(e.target.value)}
                    placeholder="Contoh: Bapak Ahmad Sobari / Muhammad Al-Fatih"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Nomor WhatsApp Terdaftar</label>
                  <input
                    type="tel"
                    required
                    value={recoveryPhone}
                    onChange={(e) => setRecoveryPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg mt-2"
                >
                  Kirim Permintaan ke Admin
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
