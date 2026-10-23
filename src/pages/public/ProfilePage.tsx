import React from 'react';
import { SiteSettings } from '../../types';
import { TeacherAvatar } from '../../components/common/TeacherAvatar';
import { BookOpen, CheckCircle, MapPin, Mail, Phone, Calendar, School, Award } from 'lucide-react';

export const ProfilePage: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="border-b border-stone-200 pb-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Tentang Lembaga
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Profil MDTU Nurul Hidayah
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Madrasah Diniyah Takmiliyah Ula (MDTU) Nurul Hidayah merupakan lembaga pendidikan keagamaan Islam non-formal berjenjang Ula (Tingkat Dasar) di bawah naungan Kementerian Agama Republik Indonesia.
        </p>
      </div>

      {/* Identitas Resmi Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-800" />
            <span>Identitas Lengkap Lembaga</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-3 py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Nama Lembaga</span>
              <span className="col-span-2 font-bold text-stone-900">MDTU Nurul Hidayah</span>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Jenjang Pendidikan</span>
              <span className="col-span-2 font-semibold text-emerald-900">
                Madrasah Diniyah Takmiliyah Ula (MDTU)
              </span>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Kepala Lembaga</span>
              <span className="col-span-2 font-bold text-stone-900">{settings.headmasterName}</span>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Alamat Lembaga</span>
              <span className="col-span-2 text-stone-800 leading-relaxed">{settings.address}</span>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Nomor Telepon</span>
              <span className="col-span-2 text-stone-900 font-mono font-semibold">
                0823-1598-7599 (182315987599)
              </span>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Email Resmi</span>
              <span className="col-span-2 text-stone-900 font-mono">{settings.email}</span>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Waktu Pembelajaran</span>
              <span className="col-span-2 text-stone-800">
                {settings.studyHours || 'Senin s.d. Minggu (Jumat Libur), Pukul 13.00 – 16.00 WIB'}
              </span>
            </div>
            <div className="grid grid-cols-3 py-2">
              <span className="text-stone-500 font-medium">Kurikulum</span>
              <span className="col-span-2 text-stone-800">
                Kurikulum Diniyah Takmiliyah Kemenag RI dipadukan dengan Tradisi Pesantren & Tahfidz
              </span>
            </div>
          </div>
        </div>

        {/* Headmaster Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-md">
            <div className="w-24 h-24 mx-auto">
              <TeacherAvatar
                name={settings.headmasterName}
                roleTitle={settings.headmasterTitle}
                photoUrl={settings.headmasterPhotoUrl}
                size="lg"
                className="w-24 h-24 rounded-full border-2 border-amber-400"
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">{settings.headmasterName}</h3>
              <p className="text-xs text-amber-300 font-semibold">{settings.headmasterTitle}</p>
              <p className="text-xs text-emerald-200 mt-1">Pengampu Wali Kelas 4 (Ula D)</p>
            </div>
            <div className="pt-3 border-t border-emerald-900 text-xs text-emerald-100 italic leading-relaxed text-center">
              "Pendidikan diniyah adalah fondasi kokoh bagi generasi Islam. Menanamkan kecintaan membaca Al-Qur'an dan akhlakul karimah adalah amanah utama kita bersama."
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl border border-stone-200 p-6 space-y-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-800" />
              <span>Program Pendidikan Unggulan</span>
            </h4>
            <ul className="text-xs text-stone-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Tahfidz Juz 30 dengan metode Tasmi’ & Tartil</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Bimbingan Ibadah Praktis & Sholat Berjamaah</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Pembinaan Kitab Kuning Dasar (Fiqih & Akhlak)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Pendidikan Karakter & Pramuka Santri</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sejarah Lembaga */}
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
          Sejarah Singkat Lembaga
        </h2>
        <div className="text-sm text-stone-700 leading-relaxed space-y-3">
          <p>{settings.history}</p>
          <p>
            Berada di lingkungan pedesaan yang religius di Dusun Cigoong, madrasah ini didukung penuh oleh para orang tua santri, alim ulama setempat, dan tokoh masyarakat Desa Sirnabaya. Melalui sinergi erat ini, MDTU Nurul Hidayah terus berkembang menyediakan sarana belajar yang nyaman, dewan asatidz yang amanah, serta sistem tata kelola digital yang transparan dan memudahkan orang tua.
          </p>
        </div>
      </div>
    </div>
  );
};
