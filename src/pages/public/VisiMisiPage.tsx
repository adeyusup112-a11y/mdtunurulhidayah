import React from 'react';
import { SiteSettings } from '../../types';
import { Target, Compass, Award, Shield } from 'lucide-react';

export const VisiMisiPage: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="border-b border-stone-200 pb-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Landasan Filosofis & Arah Pendidikan
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Visi, Misi & Tujuan Pendidikan
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          MDTU Nurul Hidayah bertekad menjadi wadah pembinaan generasi muda Islam yang seimbang antara kemuliaan akhlak, kefasihan membaca Kitab Suci, dan kematangan ibadah praktis.
        </p>
      </div>

      {/* Visi Card */}
      <div className="bg-emerald-950 text-white rounded-2xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <Compass className="w-4 h-4" />
            <span>Visi Lembaga</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-emerald-50 leading-relaxed font-normal">
            "{settings.vision}"
          </h2>
          <p className="text-xs text-emerald-200">
            Ditetapkan sebagai pedoman seluruh aktivitas akademik dan pembinaan santri MDTU Nurul Hidayah.
          </p>
        </div>
      </div>

      {/* Misi & Tujuan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Misi */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg">Misi Pendidikan</h3>
              <p className="text-xs text-stone-500">Langkah nyata mewujudkan visi madrasah</p>
            </div>
          </div>

          <ol className="space-y-4 text-xs sm:text-sm text-stone-700">
            {settings.mission.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tujuan Pendidikan */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg">Tujuan Pendidikan Santri</h3>
              <p className="text-xs text-stone-500">Capaian kompetensi lulusan MDTU Nurul Hidayah</p>
            </div>
          </div>

          <ul className="space-y-4 text-xs sm:text-sm text-stone-700">
            {settings.educationalGoals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0 mt-2" />
                <span className="leading-relaxed">{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Nilai-Nilai Lembaga */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-8 sm:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Prinsip & Budaya Kerja
          </span>
          <h3 className="text-2xl font-bold text-stone-900">Nilai-Nilai Luhur Lembaga</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {settings.institutionalValues.map((val, idx) => {
            const [title, desc] = val.split('—');
            return (
              <div key={idx} className="bg-white p-6 rounded-xl border border-stone-200 space-y-2">
                <span className="text-xs font-mono font-bold text-amber-600 block">
                  0{idx + 1}.
                </span>
                <h4 className="font-bold text-stone-900 text-base">{title?.trim()}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{desc?.trim()}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
