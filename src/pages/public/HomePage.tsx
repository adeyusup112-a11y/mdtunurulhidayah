import React from 'react';
import { SiteSettings, NewsItem, GalleryItem, TeacherProfile } from '../../types';
import { TeacherAvatar } from '../../components/common/TeacherAvatar';
import { ArrowRight, BookOpen, Heart, Award, Users, CheckCircle2, Calendar, MapPin, Phone, ShieldCheck, ChevronRight } from 'lucide-react';

interface HomePageProps {
  settings: SiteSettings;
  news: NewsItem[];
  gallery: GalleryItem[];
  teachers: TeacherProfile[];
  onNavigate: (tab: string) => void;
  onOpenPortal: (role?: 'admin' | 'teacher' | 'parent') => void;
  onSelectNews: (news: NewsItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  news,
  gallery,
  teachers,
  onNavigate,
  onOpenPortal,
  onSelectNews
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-emerald-950 text-white overflow-hidden">
        {/* Decorative background image overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/src/assets/images/hero_madrasah_building_1792550359080.jpg"
            alt="MDTU Nurul Hidayah"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-900/60 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <ShieldCheck className="w-4 h-4" />
                <span>Pendidikan Islam Diniyah Takmiliyah Ula</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                MDTU Nurul Hidayah <br />
                <span className="text-amber-300 font-serif font-normal italic">Cigoong, Sirnabaya, Rajadesa</span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed font-light">
                {settings.heroHeadline}. Wadah pembinaan keagamaan formal sore hari yang mendidik akidah shalihah, tartil Al-Qur'an, dan keteladanan budi pekerti.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => onNavigate('ppdb')}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2 text-sm cursor-pointer"
                >
                  <span>Pendaftaran Santri Baru (PPDB)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenPortal()}
                  className="px-6 py-3.5 bg-emerald-900/80 hover:bg-emerald-800 text-white font-semibold rounded-lg border border-emerald-700/80 hover:border-emerald-500 transition-all text-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Akses Portal Masuk</span>
                  <ChevronRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-emerald-800/80 text-xs text-emerald-200">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">4 Kelas</div>
                  <p className="text-emerald-300/80">Jenjang Ula 1 - 4</p>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">40+ Santri</div>
                  <p className="text-emerald-300/80">Aktif Terdaftar</p>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">100%</div>
                  <p className="text-emerald-300/80">Transparansi Digital</p>
                </div>
              </div>
            </div>

            {/* Right Card: Institutional Highlight */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-emerald-800/60 bg-emerald-900/40 backdrop-blur-sm p-2">
                <img
                  src="/src/assets/images/hero_madrasah_building_1792550359080.jpg"
                  alt="Gedung MDTU Nurul Hidayah"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-amber-300">
                    <span className="font-semibold">Desa Sirnabaya, Kec. Rajadesa</span>
                    <span>Kab. Ciamis 46254</span>
                  </div>
                  <p className="text-emerald-100">
                    Suasana lingkungan asri dan sejuk, kondusif untuk tilawah dan pembelajaran santri di sore hari.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sambutan Kepala Lembaga */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-44 h-44 mb-4">
                <TeacherAvatar
                  name={settings.headmasterName}
                  roleTitle={settings.headmasterTitle}
                  photoUrl={settings.headmasterPhotoUrl}
                  size="xl"
                  className="w-44 h-44 border-4 border-emerald-50 shadow-md"
                />
              </div>
              <h3 className="font-bold text-stone-900 text-lg">{settings.headmasterName}</h3>
              <p className="text-xs text-emerald-800 font-semibold">{settings.headmasterTitle}</p>
              <p className="text-xs text-stone-500 mt-1">MDTU Nurul Hidayah Cigoong</p>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                <span>Sambutan Pimpinan Lembaga</span>
              </div>
              <p className="text-stone-700 leading-relaxed text-sm sm:text-base italic">
                "{settings.headmasterGreeting}"
              </p>
              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Kurikulum Terpadu Kemenag</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Tahfidz Juz 30 Tartil</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Pembiasaan Sholat Berjamaah</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Program Pendidikan & Nilai Unggulan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Kurikulum & Pembiasaan Santri
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Membentuk Karakter Qur'ani Sejak Usia Dasar
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            MDTU Nurul Hidayah menyelaraskan pembelajaran teori ilmu agama dengan amalan praktis harian agar melekat kuat dalam kepribadian santri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 hover:border-emerald-600/50 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Tahfidz & Tartil Al-Qur’an</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Bimbingan tahsin makharijul huruf, tajwid dasar hingga lanjutan, serta target hafalan Juz 30 secara tuntas dan mutqin.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 hover:border-emerald-600/50 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Fiqih Ibadah & Adab</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Praktik thaharah (wudhu, tayamum), sholat fardhu berjamaah, sholat sunnah Dhuha, serta penanaman adab kepada orang tua dan guru.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 hover:border-emerald-600/50 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Bahasa Arab & Kitab Kuning</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pengenalan mufrodat (kosa kata) Arab, kaidah dasar, serta pengkajian kitab dasar akhlak dan aqidah tauhid ahlussunnah wal jama’ah.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 hover:border-emerald-600/50 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Kepanduan Pramuka Santri</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Kegiatan kepanduan berkala melatih kemandirian, kekompakan baris-berbaris, kecintaan alam, dan kepemimpinan santri sejak dini.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Dewan Asatidz Preview */}
      <section className="bg-stone-100/70 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Pendidik Berdedikasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
                Dewan Asatidz MDTU Nurul Hidayah
              </h2>
            </div>
            <button
              onClick={() => onNavigate('guru')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Lihat Profil Lengkap Asatidz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col"
              >
                <div className="h-48 w-full bg-stone-100 overflow-hidden relative">
                  <TeacherAvatar
                    name={teacher.title}
                    roleTitle={teacher.roleTitle}
                    photoUrl={teacher.photoUrl}
                    size="full"
                    className="rounded-none border-0"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-900/80 text-amber-300 text-[10px] font-bold rounded z-10">
                    {teacher.roleTitle.split('sekaligus')[0]}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{teacher.title}</h3>
                    <p className="text-xs text-emerald-800 font-medium">{teacher.roleTitle}</p>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">{teacher.bio}</p>
                  </div>
                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-600">
                    <span className="font-medium text-stone-800">Ampuan:</span> {teacher.subjects.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Warta & Pengumuman Terbaru */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Kabar Madrasah
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Berita & Informasi Terbaru
            </h2>
          </div>
          <button
            onClick={() => onNavigate('berita')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Buka Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectNews(item)}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col"
            >
              <div className="h-44 w-full bg-stone-200 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="text-emerald-800 font-semibold">{item.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.publishedAt}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm group-hover:text-emerald-800 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Galeri Kegiatan Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Dokumentasi Lembaga
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Galeri Kegiatan Santri
            </h2>
          </div>
          <button
            onClick={() => onNavigate('galeri')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Buka Galeri Foto</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden border border-stone-200 aspect-4/3 bg-stone-100"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] text-amber-300 font-semibold">{item.category}</span>
                <p className="text-xs font-bold truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PPDB Banner Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full">
              Penerimaan Santri Baru (PPDB) 2026/2027
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Daftarkan Putra-Putri Anda di MDTU Nurul Hidayah
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Pendaftaran dapat dilakukan secara langsung secara online melalui portal formulir atau mengunjungi sekretariat madrasah setiap hari kerja sore.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('ppdb')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                Isi Formulir Pendaftaran Online
              </button>
              <button
                onClick={() => onNavigate('kontak')}
                className="px-5 py-3 bg-emerald-800/80 hover:bg-emerald-800 text-white font-medium rounded-lg text-xs sm:text-sm border border-emerald-600 transition-colors cursor-pointer"
              >
                Hubungi Pengurus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Kontak & Lokasi Quick Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-xl border border-stone-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-700">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900 block text-sm">Alamat Lembaga:</span>
              <p className="text-stone-600">{settings.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-stone-300 hover:border-emerald-700 text-stone-800 font-semibold transition"
            >
              <Phone className="w-4 h-4 text-emerald-800" />
              <span>0823-1598-7599</span>
            </a>
            <button
              onClick={() => onNavigate('kontak')}
              className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900 transition"
            >
              Kirim Pesan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
