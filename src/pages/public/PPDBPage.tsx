import React, { useState } from 'react';
import { SiteSettings, AdmissionApplicant } from '../../types';
import { storageService } from '../../services/storageService';
import { FileText, CheckCircle2, Search, ArrowRight, UserCheck, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

interface PPDBPageProps {
  settings: SiteSettings;
  onRefreshData: () => void;
}

export const PPDBPage: React.FC<PPDBPageProps> = ({ settings, onRefreshData }) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'check' | 'info'>('form');

  // Form states
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthPlace, setBirthPlace] = useState('Ciamis');
  const [birthDate, setBirthDate] = useState('2019-05-10');
  const [address, setAddress] = useState('Kp. Dukuh Sari, Sirnabaya');
  const [previousSchool, setPreviousSchool] = useState('');
  const [targetClassId, setTargetClassId] = useState('class_1');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentRelationship, setParentRelationship] = useState('Ayah');
  const [notes, setNotes] = useState('');

  // Submit response
  const [submitSuccess, setSubmitSuccess] = useState<AdmissionApplicant | null>(null);
  const [submitError, setSubmitError] = useState('');

  // Check status
  const [searchRegNum, setSearchRegNum] = useState('');
  const [searchResult, setSearchResult] = useState<AdmissionApplicant | null | 'NOT_FOUND'>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!fullName.trim() || !parentName.trim() || !parentPhone.trim() || !address.trim()) {
      setSubmitError('Mohon lengkapi semua kolom wajib.');
      return;
    }

    try {
      const applicant = storageService.submitAdmission({
        fullName,
        gender,
        birthPlace,
        birthDate,
        address,
        previousSchool: previousSchool || 'Belum Sekolah / RA Setempat',
        targetClassId,
        parentName,
        parentPhone,
        parentRelationship,
        status: 'Diajukan',
        notes: notes ? `Catatan pendaftar: ${notes}` : 'Menunggu verifikasi berkas madrasah'
      });

      setSubmitSuccess(applicant);
      onRefreshData();
    } catch (err) {
      setSubmitError('Terjadi kesalahan saat menyimpan formulir.');
    }
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRegNum.trim()) return;

    const applicant = storageService.getAdmissionByRegNumber(searchRegNum.trim());
    if (applicant) {
      setSearchResult(applicant);
    } else {
      // Try search by phone
      const all = storageService.getAdmissions();
      const byPhone = all.find(a => a.parentPhone.includes(searchRegNum.trim()));
      if (byPhone) {
        setSearchResult(byPhone);
      } else {
        setSearchResult('NOT_FOUND');
      }
    }
  };

  const getStatusBadge = (status: AdmissionApplicant['status']) => {
    switch (status) {
      case 'Diterima':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-xs">Diterima</span>;
      case 'Sedang Diverifikasi':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded text-xs">Sedang Diverifikasi</span>;
      case 'Diajukan':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded text-xs">Diajukan</span>;
      case 'Perlu Perbaikan':
        return <span className="px-3 py-1 bg-orange-100 text-orange-800 font-bold rounded text-xs">Perlu Perbaikan</span>;
      case 'Ditolak':
        return <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold rounded text-xs">Ditolak</span>;
      default:
        return <span className="px-3 py-1 bg-stone-100 text-stone-800 font-bold rounded text-xs">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Penerimaan Peserta Didik Baru (PPDB) 2026/2027
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Pendaftaran Santri Baru MDTU Nurul Hidayah
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Sistem pendaftaran santri baru online resmi. Orang tua dapat mengisi data calon santri, mendapatkan nomor registrasi unik, dan memantau status verifikasi secara mandiri.
        </p>
      </div>

      {/* Sub Tabs: Form, Check Status, Info Syarat */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-xl max-w-md">
        <button
          onClick={() => setActiveSubTab('form')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
            activeSubTab === 'form' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Formulir Pendaftaran
        </button>
        <button
          onClick={() => setActiveSubTab('check')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
            activeSubTab === 'check' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Cek Status Pendaftaran
        </button>
        <button
          onClick={() => setActiveSubTab('info')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
            activeSubTab === 'info' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Persyaratan & Tata Cara
        </button>
      </div>

      {/* Tab 1: Formulir Online */}
      {activeSubTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            {submitSuccess ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-stone-900">Pendaftaran Berhasil Dikirim!</h3>
                  <p className="text-xs text-stone-600 max-w-md mx-auto">
                    Data calon santri <span className="font-bold text-stone-900">{submitSuccess.fullName}</span> telah tercatat di sistem panitia PPDB MDTU Nurul Hidayah.
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-6 rounded-xl max-w-md mx-auto space-y-3 text-left">
                  <div className="flex items-center justify-between text-xs border-b border-stone-200 pb-2">
                    <span className="text-stone-500">Nomor Registrasi Unik</span>
                    <span className="font-mono font-bold text-emerald-900 text-base">{submitSuccess.regNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-stone-200 pb-2">
                    <span className="text-stone-500">Nama Calon Santri</span>
                    <span className="font-semibold text-stone-800">{submitSuccess.fullName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-stone-200 pb-2">
                    <span className="text-stone-500">Pilihan Kelas</span>
                    <span className="font-semibold text-stone-800">
                      {submitSuccess.targetClassId === 'class_1' ? 'Kelas 1 (Ula A)' : 'Kelas Lanjutan'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">Status Awal</span>
                    {getStatusBadge(submitSuccess.status)}
                  </div>
                </div>

                <p className="text-xs text-stone-500">
                  Simpan Nomor Registrasi di atas untuk memantau status penerimaan atau konfirmasi berkas fisik di kantor madrasah.
                </p>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      setSubmitSuccess(null);
                      setFullName('');
                      setParentName('');
                      setParentPhone('');
                    }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Daftar Santri Lain
                  </button>
                  <button
                    onClick={() => {
                      setSearchRegNum(submitSuccess.regNumber);
                      setSearchResult(submitSuccess);
                      setActiveSubTab('check');
                    }}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Pantau Status Ini
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <h3 className="text-lg font-bold text-stone-900">Formulir Data Santri & Wali</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Silakan isi data dengan benar dan lengkap sesuai dokumen kependudukan (KK / Akta).
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Section A: Data Calon Santri */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    A. Data Calon Santri
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Nama Lengkap Santri *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Muhammad Azzam Fathoni"
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Jenis Kelamin *</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none bg-white"
                      >
                        <option value="L">Laki-Laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Pilihan Kelas *</label>
                      <select
                        value={targetClassId}
                        onChange={(e) => setTargetClassId(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none bg-white"
                      >
                        <option value="class_1">Kelas 1 (Ula A) - Santri Baru</option>
                        <option value="class_2">Kelas 2 (Pindahan / Lanjutan)</option>
                        <option value="class_3">Kelas 3 (Pindahan / Lanjutan)</option>
                        <option value="class_4">Kelas 4 (Pindahan / Lanjutan)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Tempat Lahir *</label>
                      <input
                        type="text"
                        required
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Tanggal Lahir *</label>
                      <input
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none bg-white"
                      >
                      </input>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Asal Sekolah / TK / PAUD</label>
                      <input
                        type="text"
                        value={previousSchool}
                        onChange={(e) => setPreviousSchool(e.target.value)}
                        placeholder="Contoh: RA Al-Ikhlas Sirnabaya / TK Cigoong"
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Data Orang Tua / Wali */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    B. Data Orang Tua / Wali Santri
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Nama Orang Tua / Wali *</label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="Contoh: Bapak Ahmad Sobari"
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Hubungan Keluarga *</label>
                      <select
                        value={parentRelationship}
                        onChange={(e) => setParentRelationship(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none bg-white"
                      >
                        <option value="Ayah">Ayah Kandung</option>
                        <option value="Ibu">Ibu Kandung</option>
                        <option value="Wali">Wali Santri</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Nomor WhatsApp / HP Aktif *</label>
                      <input
                        type="tel"
                        required
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Unggah Dokumen (Simulasi)</label>
                      <input
                        type="file"
                        className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                      />
                      <p className="text-[10px] text-stone-400">Format PDF / Foto KK / Akta (Opsional)</p>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Alamat Tempat Tinggal *</label>
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Kp. Dukuh Sari RT 03 RW 01 Desa Sirnabaya..."
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Catatan Tambahan (Opsional)</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Misal: Riwayat hafalan sebelumnya atau riwayat kesehatan"
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <p className="text-[11px] text-stone-500">
                    * Semua data akan diverifikasi secara aman oleh pengurus madrasah.
                  </p>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Kirim Formulir Pendaftaran
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-emerald-950 text-white rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Alur PPDB MDTU</span>
              </h3>
              <ol className="text-xs text-emerald-100 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-300">1.</span>
                  <span>Isi formulir online atau datang langsung ke madrasah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-300">2.</span>
                  <span>Dapatkan Nomor Registrasi (contoh: PPDB-2026-001).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-300">3.</span>
                  <span>Verifikasi berkas fisik dan wawancara dasar santri.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-300">4.</span>
                  <span>Pengumuman status penerimaan di sistem dan terbit NIS resmi.</span>
                </li>
              </ol>
            </div>

            <div className="bg-stone-50 rounded-xl border border-stone-200 p-6 space-y-2 text-xs text-stone-600">
              <span className="font-bold text-stone-900 block">Butuh Bantuan Pendaftaran?</span>
              <p>Sekretariat panitia PPDB buka setiap sore pukul 13:00 - 16:00 WIB (Senin - Minggu, Jumat Libur).</p>
              <p className="font-mono text-emerald-900 font-bold">Telp: 0823-1598-7599</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cek Status Pendaftaran */}
      {activeSubTab === 'check' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-stone-900">Pantau Status Pendaftaran Santri</h3>
            <p className="text-xs text-stone-500">
              Masukkan Nomor Registrasi (contoh: <span className="font-mono font-semibold">PPDB-2026-001</span>) atau Nomor HP Orang Tua saat mendaftar.
            </p>
          </div>

          <form onSubmit={handleSearchStatus} className="flex gap-2">
            <input
              type="text"
              value={searchRegNum}
              onChange={(e) => setSearchRegNum(e.target.value)}
              placeholder="Nomor Registrasi atau Nomor HP..."
              className="flex-1 px-4 py-2.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cari Status
            </button>
          </form>

          {searchResult && searchResult !== 'NOT_FOUND' && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[11px] text-stone-400">Nomor Registrasi:</span>
                  <p className="font-mono font-bold text-emerald-900 text-sm">{searchResult.regNumber}</p>
                </div>
                <div>{getStatusBadge(searchResult.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-500">Nama Calon Santri:</span>
                  <p className="font-semibold text-stone-900">{searchResult.fullName}</p>
                </div>
                <div>
                  <span className="text-stone-500">Nama Orang Tua/Wali:</span>
                  <p className="font-semibold text-stone-900">{searchResult.parentName}</p>
                </div>
                <div>
                  <span className="text-stone-500">Target Kelas:</span>
                  <p className="font-semibold text-stone-900">{searchResult.targetClassId.replace('class_', 'Kelas ')}</p>
                </div>
                <div>
                  <span className="text-stone-500">Waktu Mendaftar:</span>
                  <p className="font-semibold text-stone-900">{searchResult.registeredAt.split('T')[0]}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 text-xs">
                <span className="font-semibold text-stone-800">Catatan Panitia:</span>
                <p className="text-stone-600 mt-1 italic">{searchResult.notes || 'Berkas dalam antrean telaah panitia.'}</p>
              </div>

              {searchResult.status === 'Diterima' && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-900 text-xs">
                  Selamat! Calon santri telah dinyatakan <strong>DITERIMA</strong> di MDTU Nurul Hidayah. Silakan lakukan konfirmasi ke madrasah untuk penyerahan perlengkapan seragam dan kitab.
                </div>
              )}
            </div>
          )}

          {searchResult === 'NOT_FOUND' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-800">
              Data pendaftaran tidak ditemukan. Pastikan nomor registrasi (contoh: PPDB-2026-001) atau nomor HP sudah benar.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Persyaratan & Tata Cara */}
      {activeSubTab === 'info' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-sm space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-stone-900">Syarat Pendaftaran Santri Baru</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
              {settings.ppdbRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-xl font-bold text-stone-900">Jadwal PPDB Tahun Ajaran 2026/2027</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-emerald-900 block text-sm">Gelombang 1</span>
                <p className="text-stone-600">01 Mei – 30 Juni 2026</p>
                <p className="text-stone-400">Pendaftaran & verifikasi berkas</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-emerald-900 block text-sm">Pengumuman & Orientasi</span>
                <p className="text-stone-600">05 Juli 2026</p>
                <p className="text-stone-400">Pembagian kelas & perlengkapan</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-emerald-900 block text-sm">Awal Masuk Belajar</span>
                <p className="text-stone-600">14 Juli 2026</p>
                <p className="text-stone-400">Masuk serentak tahun ajaran baru</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
