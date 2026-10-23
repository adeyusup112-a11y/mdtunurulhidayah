import React from 'react';
import { DigitalReportCard, Student, ClassItem } from '../../types';
import { Printer, Download, Award, CheckCircle2, BookOpen, User, Calendar, ShieldCheck } from 'lucide-react';

interface Props {
  report: DigitalReportCard;
  student: Student;
  classItem?: ClassItem;
  onClose?: () => void;
}

export const DigitalReportCardView: React.FC<Props> = ({ report, student, classItem, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  // Calculate average score
  const totalScore = report.grades.reduce((sum, g) => sum + g.score, 0);
  const averageScore = report.grades.length > 0 ? (totalScore / report.grades.length).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      {/* Action Header (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-900 text-white rounded-2xl shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Raport Digital Resmi MDTU Nurul Hidayah</h3>
            <p className="text-xs text-emerald-200">
              {student.fullName} ({student.nis}) · Semester {report.semester} TA {report.academicYear}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Raport Digital</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Tutup
            </button>
          )}
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div
        id="print-report-card"
        className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-sm text-stone-900 space-y-6 print:border-none print:shadow-none print:p-0 print:m-0"
      >
        {/* Kop Surat Resmi */}
        <div className="border-b-4 border-double border-stone-900 pb-4 text-center space-y-1 relative">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/src/assets/images/madrasah_emblem_logo_1792550360091.jpg"
              alt="Logo MDTU"
              className="w-16 h-16 object-contain rounded-full border border-stone-300 shrink-0"
            />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-600">
                Kementerian Agama Republik Indonesia · FKDT Ciamis
              </h4>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-emerald-950 uppercase">
                MADRASAH DINIYAH TAKMILIYAH ULA (MDTU) NURUL HIDAYAH
              </h2>
              <p className="text-[11px] text-stone-600 max-w-xl mx-auto leading-tight">
                Kp. Dukuh Sari RT 003 RW 002, Dusun Cigoong, Desa Sirnabaya, Kec. Rajadesa, Kab. Ciamis, Jawa Barat 46254
                <br />
                WhatsApp: 0823-1598-7599 · Email: nurulhidayah177@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1 py-1">
          <h3 className="text-base sm:text-lg font-bold tracking-wide uppercase text-stone-900 underline underline-offset-4 decoration-emerald-800">
            LAPORAN HASIL BELAJAR SANTRI (RAPORT DIGITAL)
          </h3>
          <p className="text-xs font-medium text-stone-600">
            Tahun Pelajaran {report.academicYear} — Semester {report.semester}
          </p>
        </div>

        {/* Student Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
          <div className="flex justify-between py-0.5 border-b border-stone-200/60">
            <span className="text-stone-500 font-medium">Nama Lengkap Santri</span>
            <span className="font-bold text-stone-900">{student.fullName}</span>
          </div>
          <div className="flex justify-between py-0.5 border-b border-stone-200/60">
            <span className="text-stone-500 font-medium">Nomor Induk Santri (NIS)</span>
            <span className="font-mono font-bold text-emerald-900">{student.nis}</span>
          </div>
          <div className="flex justify-between py-0.5 border-b border-stone-200/60">
            <span className="text-stone-500 font-medium">Kelas / Rombongan Belajar</span>
            <span className="font-bold text-stone-900">{classItem?.name || student.classId.replace('class_', 'Kelas ')}</span>
          </div>
          <div className="flex justify-between py-0.5 border-b border-stone-200/60">
            <span className="text-stone-500 font-medium">Wali Kelas Pengampu</span>
            <span className="font-semibold text-stone-800">{report.waliKelasName}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-stone-500 font-medium">Jenis Kelamin</span>
            <span className="font-medium text-stone-800">{student.gender === 'L' ? 'Laki-laki (Santriwan)' : 'Perempuan (Santriwati)'}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-stone-500 font-medium">Status Pembelajaran</span>
            <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.2 rounded text-[10px]">Aktif Mengikuti Pembelajaran</span>
          </div>
        </div>

        {/* TABEL I: Capaian Nilai Akademik & Keagamaan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Capaian Hasil Belajar Bidang Studi Diniyah</span>
            </h4>
            <span className="text-[11px] text-stone-500 font-medium">Skala Penilaian: 0 - 100</span>
          </div>

          <div className="overflow-x-auto border border-stone-300 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-100 text-stone-800 border-b border-stone-300 font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-center w-10 border-r border-stone-300">No</th>
                  <th className="py-2.5 px-3 border-r border-stone-300">Mata Pelajaran Diniyah</th>
                  <th className="py-2.5 px-2 text-center w-14 border-r border-stone-300">KKM</th>
                  <th className="py-2.5 px-2 text-center w-16 border-r border-stone-300">Nilai</th>
                  <th className="py-2.5 px-2 text-center w-14 border-r border-stone-300">Huruf</th>
                  <th className="py-2.5 px-3 text-center w-28 border-r border-stone-300">Predikat</th>
                  <th className="py-2.5 px-3">Capaian Kompetensi / Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {report.grades.map((g, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-stone-50/60' : 'bg-white'}>
                    <td className="py-2 px-3 text-center font-mono border-r border-stone-200 text-stone-500">{idx + 1}</td>
                    <td className="py-2 px-3 font-semibold text-stone-900 border-r border-stone-200">{g.subject}</td>
                    <td className="py-2 px-2 text-center font-mono text-stone-600 border-r border-stone-200">{g.kkm}</td>
                    <td className="py-2 px-2 text-center font-mono font-bold text-emerald-950 border-r border-stone-200 bg-emerald-50/30">
                      {g.score}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-stone-800 border-r border-stone-200">{g.gradeLetter}</td>
                    <td className="py-2 px-3 text-center border-r border-stone-200">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          g.predicate === 'Sangat Baik'
                            ? 'bg-emerald-100 text-emerald-900'
                            : g.predicate === 'Baik'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {g.predicate}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-stone-700 text-[11px] leading-relaxed">{g.description}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-stone-100/80 border-t-2 border-stone-300 font-bold text-xs">
                <tr>
                  <td colSpan={3} className="py-2.5 px-3 text-right uppercase tracking-wider text-stone-700">
                    Rata-rata Nilai Santri:
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-emerald-900 font-extrabold text-sm bg-emerald-100/50">
                    {averageScore}
                  </td>
                  <td colSpan={3} className="py-2.5 px-3 text-stone-600 font-medium">
                    {parseFloat(averageScore) >= 85 ? 'Predikat Keseluruhan: Sangat Memuaskan (Mumtaz)' : 'Predikat Keseluruhan: Baik (Jayyid)'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* TABEL II: Tahfidz & Kualitas Bacaan Al-Qur'an */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[11px] font-bold">2</span>
            <span>Program Unggulan Tahfidz Al-Qur'an & Tajwid</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-stone-600 font-medium">Capaian Target Hafalan:</span>
                <span className="font-bold text-emerald-950">{report.tahfidzProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600 font-medium">Nilai Mutqin & Kelancaran:</span>
                <span className="font-mono font-extrabold text-sm text-emerald-900">{report.tahfidzScore} / 100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600 font-medium">Predikat Tahfidz:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[11px]">
                  {report.tahfidzPredicate}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l sm:pl-4 border-emerald-200">
              <span className="text-stone-600 font-semibold block">Catatan Kualitas Tajwid & Makhraj:</span>
              <p className="text-stone-800 italic leading-relaxed text-[11px]">"{report.tajwidQuality}"</p>
            </div>
          </div>
        </div>

        {/* TABEL III & IV: Karakter & Kehadiran (2 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Karakter Santri */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[11px] font-bold">3</span>
              <span>Penilaian Akhlak & Pengembangan Karakter</span>
            </h4>
            <div className="border border-stone-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
                  <tr>
                    <th className="py-2 px-3">Aspek Karakter</th>
                    <th className="py-2 px-3 text-center w-20">Predikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="py-1.5 px-3 font-medium text-stone-800">Adab & Kesopanan kepada Guru dan Teman</td>
                    <td className="py-1.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/50">
                      {report.characterValues?.adabDanAkhlak || 'A'} (Sangat Baik)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-medium text-stone-800">Kedisiplinan & Ketertiban Masuk Madrasah</td>
                    <td className="py-1.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/50">
                      {report.characterValues?.kedisiplinan || 'A'} (Sangat Baik)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-medium text-stone-800">Kebersihan & Kerapian Pakaian Muslim</td>
                    <td className="py-1.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/50">
                      {report.characterValues?.kebersihanKerapian || 'A'} (Sangat Baik)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-medium text-stone-800">Keaktifan Sholat Berjamaah & Ibadah</td>
                    <td className="py-1.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/50">
                      {report.characterValues?.keaktifanIbadah || 'A'} (Sangat Baik)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Presensi Kehadiran */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[11px] font-bold">4</span>
              <span>Rekapitulasi Presensi Kehadiran Semester</span>
            </h4>
            <div className="border border-stone-300 rounded-lg p-3 space-y-2 bg-stone-50 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-white rounded border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Hadir</span>
                  <span className="text-base font-bold text-emerald-800 font-mono">{report.attendance?.hadir || 0} Hari</span>
                </div>
                <div className="p-2 bg-white rounded border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Sakit</span>
                  <span className="text-base font-bold text-blue-800 font-mono">{report.attendance?.sakit || 0} Hari</span>
                </div>
                <div className="p-2 bg-white rounded border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Izin</span>
                  <span className="text-base font-bold text-amber-800 font-mono">{report.attendance?.izin || 0} Hari</span>
                </div>
                <div className="p-2 bg-white rounded border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Tanpa Keterangan (Alpa)</span>
                  <span className="text-base font-bold text-rose-800 font-mono">{report.attendance?.alpa || 0} Hari</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Wali Kelas & Keputusan Kenaikan */}
        <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200 text-xs space-y-2">
          <div className="space-y-1">
            <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
              Catatan & Nasihat Wali Kelas:
            </span>
            <p className="text-stone-800 leading-relaxed italic bg-white p-3 rounded border border-amber-200">
              "{report.teacherNotes}"
            </p>
          </div>
          <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-stone-900">Keputusan Akhir Semester:</span>
            <span className="px-3 py-1 bg-emerald-800 text-white font-bold rounded-md text-xs shadow-xs">
              {report.promotionStatus}: {report.promotedToClass || 'Kelas Lanjutan'}
            </span>
          </div>
        </div>

        {/* Lembar Tanda Tangan & Pengesahan */}
        <div className="pt-6 border-t border-stone-300">
          <div className="text-right text-xs text-stone-600 mb-4">
            {report.place}, {report.issueDate}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            {/* Orang Tua / Wali */}
            <div className="space-y-16">
              <span className="font-semibold text-stone-700 block">Orang Tua / Wali Santri,</span>
              <div className="border-b border-stone-400 mx-6"></div>
              <span className="text-stone-500 text-[11px] block">( ........................................... )</span>
            </div>

            {/* Wali Kelas */}
            <div className="space-y-16">
              <span className="font-semibold text-stone-700 block">Wali Kelas,</span>
              <div className="space-y-0.5">
                <span className="font-bold text-stone-900 block underline underline-offset-2">{report.waliKelasName}</span>
                <span className="text-[10px] text-stone-500 block">Pendidik MDTU Nurul Hidayah</span>
              </div>
            </div>

            {/* Kepala Lembaga */}
            <div className="space-y-16 relative">
              <span className="font-semibold text-stone-700 block">Kepala MDTU Nurul Hidayah,</span>
              <div className="relative">
                {/* Official Digital Stamp Badge */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-80 pointer-events-none">
                  <div className="border-2 border-dashed border-emerald-800 rounded-full w-20 h-20 flex items-center justify-center p-1 text-center rotate-[-12deg] bg-emerald-50/40">
                    <span className="text-[8px] font-extrabold text-emerald-900 uppercase leading-none">
                      MDTU NURUL HIDAYAH<br />★ CIAMIS ★<br />TERVERIFIKASI
                    </span>
                  </div>
                </div>
                <span className="font-bold text-stone-900 block underline underline-offset-2 relative z-10">
                  {report.headmasterName}
                </span>
                <span className="text-[10px] text-stone-500 block relative z-10">NIP/NUPTK: Pendidik Diniyah RI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer verification note */}
        <div className="pt-4 text-center border-t border-stone-100 text-[10px] text-stone-400 font-mono">
          Dokumen Raport Digital Sah diterbitkan melalui Sistem Informasi Akademik MDTU Nurul Hidayah Rajadesa Ciamis.
        </div>
      </div>
    </div>
  );
};
