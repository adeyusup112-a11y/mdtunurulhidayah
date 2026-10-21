import React, { useState } from 'react';
import { TeacherProfile } from '../../types';
import { TeacherAvatar } from '../../components/common/TeacherAvatar';
import { BookOpen, GraduationCap, Phone, Award, Search } from 'lucide-react';

export const GuruPage: React.FC<{ teachers: TeacherProfile[] }> = ({ teachers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  const filtered = teachers.filter(t => {
    if (!t.isActive) return false;
    const matchSearch = t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchClass = filterClass === 'all' || t.assignedClassId === filterClass;
    return matchSearch && matchClass;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Pendidik & Tenaga Kependidikan
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Dewan Asatidz MDTU Nurul Hidayah
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Para ustadz dan ustadzah yang berdedikasi tinggi, berlatar belakang pendidikan pesantren dan perguruan tinggi Islam, siap membimbing santri dengan ketulusan dan keteladanan.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama guru atau mata pelajaran..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 whitespace-nowrap">Filter Kelas:</span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
          >
            <option value="all">Semua Kelas</option>
            <option value="class_1">Wali Kelas 1</option>
            <option value="class_2">Wali Kelas 2</option>
            <option value="class_3">Wali Kelas 3</option>
            <option value="class_4">Wali Kelas 4</option>
          </select>
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filtered.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="h-60 w-full bg-stone-100 overflow-hidden relative">
              <TeacherAvatar
                name={teacher.title}
                roleTitle={teacher.roleTitle}
                photoUrl={teacher.photoUrl}
                size="full"
                className="rounded-none border-0"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-emerald-950/80 backdrop-blur-sm text-amber-300 text-[11px] font-bold rounded z-10">
                {teacher.roleTitle}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-stone-900 text-base">{teacher.title}</h3>
                {teacher.nip && (
                  <p className="text-[11px] font-mono text-stone-400">NIP: {teacher.nip}</p>
                )}
                {teacher.education && (
                  <p className="text-xs text-stone-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{teacher.education}</span>
                  </p>
                )}
                <p className="text-xs text-stone-600 leading-relaxed pt-1">{teacher.bio}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-stone-100 text-xs">
                <div>
                  <span className="font-semibold text-stone-800 block text-[11px] uppercase tracking-wider mb-1">
                    Mata Pelajaran:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.subjects.map((subj, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] rounded font-medium border border-emerald-100"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-stone-600 text-[11px] pt-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-800" />
                  <a href={`tel:${teacher.phone}`} className="hover:text-emerald-800 font-mono">
                    {teacher.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
