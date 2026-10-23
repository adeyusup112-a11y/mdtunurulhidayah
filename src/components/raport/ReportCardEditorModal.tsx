import React, { useState } from 'react';
import { DigitalReportCard, Student, SubjectGrade } from '../../types';
import { X, Save, Award, CheckCircle } from 'lucide-react';

interface Props {
  report: DigitalReportCard;
  student: Student;
  onSave: (report: DigitalReportCard) => void;
  onClose: () => void;
}

export const ReportCardEditorModal: React.FC<Props> = ({ report, student, onSave, onClose }) => {
  const [formData, setFormData] = useState<DigitalReportCard>({ ...report });

  const handleScoreChange = (index: number, scoreVal: number) => {
    const updatedGrades = [...formData.grades];
    const score = Math.max(0, Math.min(100, scoreVal));
    let gradeLetter: 'A' | 'B' | 'C' | 'D' = 'B';
    let predicate: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan' = 'Baik';

    if (score >= 88) {
      gradeLetter = 'A';
      predicate = 'Sangat Baik';
    } else if (score >= 78) {
      gradeLetter = 'B';
      predicate = 'Baik';
    } else if (score >= 68) {
      gradeLetter = 'C';
      predicate = 'Cukup';
    } else {
      gradeLetter = 'D';
      predicate = 'Perlu Bimbingan';
    }

    updatedGrades[index] = {
      ...updatedGrades[index],
      score,
      gradeLetter,
      predicate
    };

    setFormData({ ...formData, grades: updatedGrades });
  };

  const handleDescriptionChange = (index: number, text: string) => {
    const updatedGrades = [...formData.grades];
    updatedGrades[index] = { ...updatedGrades[index], description: text };
    setFormData({ ...formData, grades: updatedGrades });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-emerald-950 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Edit Raport Digital Santri</h3>
              <p className="text-xs text-emerald-200">
                {student.fullName} ({student.nis}) · Semester {formData.semester} TA {formData.academicYear}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-900 rounded-lg text-emerald-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* General Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value as 'Ganjil' | 'Genap' })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white outline-none"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Tahun Pelajaran</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Tanggal Terbit Raport</label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white outline-none"
              />
            </div>
          </div>

          {/* Section 1: Nilai Mata Pelajaran */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">1</span>
              <span>Nilai Capaian Mata Pelajaran Diniyah</span>
            </h4>

            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-700 border-b border-stone-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Mata Pelajaran</th>
                    <th className="py-2.5 px-3 text-center w-20">KKM</th>
                    <th className="py-2.5 px-3 text-center w-24">Nilai (0-100)</th>
                    <th className="py-2.5 px-3 text-center w-20">Huruf</th>
                    <th className="py-2.5 px-3">Deskripsi Capaian Kompetensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {formData.grades.map((g, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-semibold text-stone-900">{g.subject}</td>
                      <td className="py-2 px-3 text-center font-mono text-stone-500">{g.kkm}</td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={g.score}
                          onChange={(e) => handleScoreChange(idx, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center font-mono font-bold border border-stone-300 rounded outline-none focus:border-emerald-600 bg-white"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="font-bold px-2 py-0.5 bg-stone-100 rounded text-stone-800">{g.gradeLetter}</span>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={g.description}
                          onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                          className="w-full px-2 py-1 border border-stone-300 rounded outline-none text-stone-700 bg-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Tahfidz Al-Qur'an */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">2</span>
              <span>Penilaian Tahfidz & Kualitas Bacaan Al-Qur'an</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Capaian Surat/Juz</label>
                <input
                  type="text"
                  value={formData.tahfidzProgress}
                  onChange={(e) => setFormData({ ...formData, tahfidzProgress: e.target.value })}
                  placeholder="Contoh: Juz 30 (Surat An-Naba s.d An-Nas)"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg bg-white outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Nilai Tahfidz (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.tahfidzScore}
                  onChange={(e) => setFormData({ ...formData, tahfidzScore: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg bg-white font-mono font-bold outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Predikat Tahfidz</label>
                <select
                  value={formData.tahfidzPredicate}
                  onChange={(e) => setFormData({ ...formData, tahfidzPredicate: e.target.value as any })}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg bg-white outline-none"
                >
                  <option value="Mumtaz (Istimewa)">Mumtaz (Istimewa)</option>
                  <option value="Jayyid Jiddan (Sangat Baik)">Jayyid Jiddan (Sangat Baik)</option>
                  <option value="Jayyid (Baik)">Jayyid (Baik)</option>
                  <option value="Maqbul (Cukup)">Maqbul (Cukup)</option>
                </select>
              </div>
              <div className="sm:col-span-3 space-y-1">
                <label className="font-semibold text-stone-700">Catatan Tajwid & Kelancaran</label>
                <input
                  type="text"
                  value={formData.tajwidQuality}
                  onChange={(e) => setFormData({ ...formData, tajwidQuality: e.target.value })}
                  placeholder="Contoh: Makharijul huruf tartil, harakat dan mad terkontrol dengan baik."
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Akhlak & Karakter */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">3</span>
              <span>Penilaian Sikap, Adab & Karakter Santri</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 block">Adab kepada Guru</label>
                <select
                  value={formData.characterValues?.adabDanAkhlak || 'A'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      characterValues: { ...formData.characterValues, adabDanAkhlak: e.target.value as any }
                    })
                  }
                  className="w-full px-2 py-1.5 border border-stone-300 rounded bg-white font-bold"
                >
                  <option value="A">A (Sangat Baik)</option>
                  <option value="B">B (Baik)</option>
                  <option value="C">C (Cukup)</option>
                </select>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 block">Kedisiplinan</label>
                <select
                  value={formData.characterValues?.kedisiplinan || 'A'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      characterValues: { ...formData.characterValues, kedisiplinan: e.target.value as any }
                    })
                  }
                  className="w-full px-2 py-1.5 border border-stone-300 rounded bg-white font-bold"
                >
                  <option value="A">A (Sangat Baik)</option>
                  <option value="B">B (Baik)</option>
                  <option value="C">C (Cukup)</option>
                </select>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 block">Kebersihan & Kerapian</label>
                <select
                  value={formData.characterValues?.kebersihanKerapian || 'A'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      characterValues: { ...formData.characterValues, kebersihanKerapian: e.target.value as any }
                    })
                  }
                  className="w-full px-2 py-1.5 border border-stone-300 rounded bg-white font-bold"
                >
                  <option value="A">A (Sangat Baik)</option>
                  <option value="B">B (Baik)</option>
                  <option value="C">C (Cukup)</option>
                </select>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 block">Keaktifan Ibadah Shalat</label>
                <select
                  value={formData.characterValues?.keaktifanIbadah || 'A'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      characterValues: { ...formData.characterValues, keaktifanIbadah: e.target.value as any }
                    })
                  }
                  className="w-full px-2 py-1.5 border border-stone-300 rounded bg-white font-bold"
                >
                  <option value="A">A (Sangat Baik)</option>
                  <option value="B">B (Baik)</option>
                  <option value="C">C (Cukup)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Rekap Presensi */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">4</span>
              <span>Rekapitulasi Presensi Kehadiran Semester (Hari)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Hadir</label>
                <input
                  type="number"
                  min="0"
                  value={formData.attendance?.hadir || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attendance: { ...formData.attendance, hadir: parseInt(e.target.value) || 0 }
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Sakit</label>
                <input
                  type="number"
                  min="0"
                  value={formData.attendance?.sakit || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attendance: { ...formData.attendance, sakit: parseInt(e.target.value) || 0 }
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Izin</label>
                <input
                  type="number"
                  min="0"
                  value={formData.attendance?.izin || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attendance: { ...formData.attendance, izin: parseInt(e.target.value) || 0 }
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Alpa</label>
                <input
                  type="number"
                  min="0"
                  value={formData.attendance?.alpa || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attendance: { ...formData.attendance, alpa: parseInt(e.target.value) || 0 }
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Catatan Wali Kelas & Status Kenaikan */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">5</span>
              <span>Catatan Wali Kelas & Keputusan Kenaikan / Kelulusan</span>
            </h4>

            <div className="space-y-3 p-4 bg-amber-50/50 rounded-xl border border-amber-200">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Catatan / Nasihat Wali Kelas</label>
                <textarea
                  rows={3}
                  value={formData.teacherNotes}
                  onChange={(e) => setFormData({ ...formData, teacherNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white leading-relaxed outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Status Keputusan</label>
                  <select
                    value={formData.promotionStatus}
                    onChange={(e) => setFormData({ ...formData, promotionStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white font-bold outline-none"
                  >
                    <option value="Naik ke Kelas Berikutnya">Naik ke Kelas Berikutnya</option>
                    <option value="Lulus dari MDTU Nurul Hidayah">Lulus dari MDTU Nurul Hidayah</option>
                    <option value="Tinggal di Kelas">Tinggal di Kelas</option>
                    <option value="Belum Ditentukan">Belum Ditentukan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Keterangan Kelas Lanjutan</label>
                  <input
                    type="text"
                    value={formData.promotedToClass || ''}
                    onChange={(e) => setFormData({ ...formData, promotedToClass: e.target.value })}
                    placeholder="Contoh: Kelas 2 (Ula B) atau Alumni MDTU"
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Penandatangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Nama Wali Kelas</label>
              <input
                type="text"
                value={formData.waliKelasName}
                onChange={(e) => setFormData({ ...formData, waliKelasName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Nama Kepala Lembaga</label>
              <input
                type="text"
                value={formData.headmasterName}
                onChange={(e) => setFormData({ ...formData, headmasterName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>Simpan Raport Digital</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
