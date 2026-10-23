import React, { useState } from 'react';
import { SiteSettings, ScheduleItem, ClassItem, TeacherProfile } from '../../types';
import { Calendar, Clock, BookOpen, User, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface JadwalPageProps {
  settings: SiteSettings;
  schedules: ScheduleItem[];
  classes: ClassItem[];
  teachers: TeacherProfile[];
}

export const JadwalPage: React.FC<JadwalPageProps> = ({ settings, schedules, classes, teachers }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'class_1');

  const daysOrder: ScheduleItem['day'][] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Sabtu', 'Minggu'];

  const filteredSchedules = schedules.filter(s => s.classId === selectedClassId);
  const currentClass = classes.find(c => c.id === selectedClassId);
  const currentClassWali = teachers.find(t => t.id === currentClass?.teacherId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>Jadwal Resmi Pembelajaran</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Jadwal Pelajaran Santri
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          Waktu belajar mengajar aktif MDTU Nurul Hidayah Rajadesa Ciamis. Seluruh kegiatan belajar mengaji dan kitab dilaksanakan pada sore hari.
        </p>

        {/* Highlight Jam Belajar */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Jam Belajar Madrasah</div>
              <div className="text-lg font-bold text-white">Senin s.d. Minggu, Pukul 13.00 – 16.00 WIB</div>
              <div className="text-xs text-emerald-200 mt-0.5">Setiap hari Jumat Libur (kegiatan santri beribadah & keluarga)</div>
            </div>
          </div>
          <div className="px-4 py-2 bg-emerald-700/60 rounded-xl border border-emerald-500/40 text-xs font-medium text-emerald-100 flex items-center gap-2 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Terupdate Otomatis Real-Time</span>
          </div>
        </div>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-800 ring-offset-2'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-600 hover:text-emerald-800 shadow-sm'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-stone-400'}`} />
              <span>{cls.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-100 text-stone-500'}`}>
                {cls.academicYear}
              </span>
            </button>
          );
        })}
      </div>

      {/* Class Info Box */}
      {currentClass && (
        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>Jadwal Pelajaran: {currentClass.name}</span>
              <span className="text-xs font-medium px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                Tahun Ajaran {currentClass.academicYear}
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Ruang Belajar: <span className="font-semibold text-stone-700">{currentClass.roomName}</span> · Wali Kelas: <span className="font-semibold text-emerald-800">{currentClassWali?.title || 'Ust. Pembina'}</span>
            </p>
          </div>
          <div className="text-xs text-stone-600 bg-stone-50 px-3.5 py-2 rounded-lg border border-stone-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Mata Pelajaran: Al-Qur'an, Tajwid, Fiqih, Aqidah Akhlak, Bahasa Arab, Tarikh Islam, Hadits & Doa</span>
          </div>
        </div>
      )}

      {/* Daily Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOrder.map((day) => {
          const dayItems = filteredSchedules
            .filter((s) => s.day === day)
            .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

          return (
            <div
              key={day}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col hover:border-emerald-300 transition-colors"
            >
              {/* Day Header */}
              <div className="bg-gradient-to-r from-stone-50 to-stone-100 px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {day.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Hari {day}</h3>
                    <p className="text-[11px] text-stone-500">13.00 – 16.00 WIB</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                  {dayItems.length} Mapel
                </span>
              </div>

              {/* Day Items */}
              <div className="p-4 flex-1 space-y-3">
                {dayItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400 italic">
                    Belum ada mata pelajaran yang dijadwalkan.
                  </div>
                ) : (
                  dayItems.map((item) => {
                    const teacher = teachers.find(t => t.id === item.teacherId);
                    const teacherName = teacher?.title || 'Asatidz MDTU';

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-stone-900 leading-snug">
                            {item.subject}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded shrink-0">
                            <Clock className="w-3 h-3" />
                            <span>{item.timeSlot}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 pt-1 border-t border-stone-200/60">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>{teacherName}</span>
                          </div>
                          {currentClass?.roomName && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span>{currentClass.roomName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}

        {/* Card Khusus Hari Jumat (Libur) */}
        <div className="bg-stone-50/80 rounded-2xl border-2 border-dashed border-stone-300 p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
            JUM
          </div>
          <div>
            <h3 className="font-bold text-stone-800 text-base">Hari Jumat: Libur</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
              Tidak ada kegiatan tatap muka di kelas. Santri dianjurkan memperbanyak membaca Al-Qur'an/Surat Al-Kahfi dan beribadah di rumah.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-200/60 text-amber-900 rounded-full text-xs font-semibold">
            Libur Pembelajaran Mingguan
          </span>
        </div>
      </div>

      {/* Note for Parents */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-stone-800 space-y-2">
        <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Informasi Penting Kedisiplinan Santri</span>
        </h4>
        <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>Santri diharapkan sudah hadir di madrasah 10 menit sebelum jam 13.00 WIB dalam keadaan berwudhu.</li>
          <li>Membawa Al-Qur'an/Juz 'Amma, buku catatan, serta kitab panduan sesuai mata pelajaran hari tersebut.</li>
          <li>Berbusana muslim rapi, bersih, dan sopan (baju koko/gamis putih/berpeci bagi santriwan, busana muslimah dan kerudung bagi santriwati).</li>
          <li>Apabila santri berhalangan hadir karena sakit atau izin keluarga, orang tua dapat mengirim konfirmasi izin melalui grup atau portal orang tua.</li>
        </ul>
      </div>
    </div>
  );
};
