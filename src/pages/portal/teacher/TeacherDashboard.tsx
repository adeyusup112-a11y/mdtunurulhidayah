import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { storageService } from '../../../services/storageService';
import {
  Student,
  ClassItem,
  AttendanceRecord,
  AcademicNote,
  ScheduleItem,
  AnnouncementItem,
  StudentBill
} from '../../../types';
import { TeacherAvatar } from '../../../components/common/TeacherAvatar';
import {
  Users,
  CalendarCheck,
  Award,
  Bell,
  Clock,
  CreditCard,
  KeyRound,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Edit2,
  CheckCheck
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentUser, teacherProfile, changePassword } = useAuth();

  const [activeMenu, setActiveMenu] = useState<'ringkasan' | 'absensi' | 'nilai' | 'jadwal' | 'pengumuman' | 'keuangan' | 'profil'>('ringkasan');

  // Teacher's assigned class data
  const [assignedClass, setAssignedClass] = useState<ClassItem | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState<{ [studentId: string]: { status: AttendanceRecord['status']; notes: string } }>({});
  const [academicNotes, setAcademicNotes] = useState<AcademicNote[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [classBills, setClassBills] = useState<StudentBill[]>([]);

  // Teacher editing student
  const [editingStudentForTeacher, setEditingStudentForTeacher] = useState<Student | null>(null);

  // Form states
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // New announcement modal / form
  const [newAncTitle, setNewAncTitle] = useState('');
  const [newAncContent, setNewAncContent] = useState('');

  // New / edit academic note
  const [selectedStudentForGrade, setSelectedStudentForGrade] = useState<Student | null>(null);
  const [gradeSubject, setGradeSubject] = useState('Tahfidz Al-Qur\'an');
  const [gradeScore, setGradeScore] = useState(85);
  const [gradeHafalan, setGradeHafalan] = useState('');
  const [gradeBehavior, setGradeBehavior] = useState('');

  const loadData = () => {
    if (!teacherProfile || !teacherProfile.assignedClassId) return;

    const classItem = storageService.getClassById(teacherProfile.assignedClassId);
    setAssignedClass(classItem || null);

    const classStudents = storageService.getStudents(teacherProfile.assignedClassId);
    setStudents(classStudents);

    // Load attendance for current date
    const dateRecords = storageService.getAttendance(teacherProfile.assignedClassId, attendanceDate);
    const attMap: { [studentId: string]: { status: AttendanceRecord['status']; notes: string } } = {};
    classStudents.forEach(s => {
      const found = dateRecords.find(r => r.studentId === s.id);
      attMap[s.id] = {
        status: found ? found.status : 'Hadir',
        notes: found?.notes || ''
      };
    });
    setAttendanceList(attMap);

    // Load grades
    const grades = storageService.getAcademicNotes(undefined, teacherProfile.assignedClassId);
    setAcademicNotes(grades);

    // Load schedules
    const sch = storageService.getSchedules(teacherProfile.assignedClassId);
    setSchedules(sch);

    // Load announcements
    const anc = storageService.getAnnouncements(undefined, teacherProfile.assignedClassId);
    setAnnouncements(anc);

    // Load bills if permitted
    if (teacherProfile.permissions.canViewPaymentStatus) {
      const bills = storageService.getBills({ classId: teacherProfile.assignedClassId });
      setClassBills(bills);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = storageService.subscribe(() => loadData());
    return unsub;
  }, [teacherProfile, attendanceDate]);

  const handleSaveAttendance = () => {
    if (!teacherProfile || !assignedClass) return;
    setSaveSuccessMsg('');
    setErrorMsg('');

    const records: AttendanceRecord[] = students.map(s => ({
      id: `att_${s.id}_${attendanceDate}`,
      studentId: s.id,
      classId: assignedClass.id,
      date: attendanceDate,
      status: attendanceList[s.id]?.status || 'Hadir',
      notes: attendanceList[s.id]?.notes || '',
      recordedByTeacherId: teacherProfile.id,
      updatedAt: new Date().toISOString()
    }));

    storageService.saveAttendanceBatch(records, teacherProfile.title);
    setSaveSuccessMsg(`Rekap kehadiran tanggal ${attendanceDate} berhasil disimpan.`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForGrade || !teacherProfile || !assignedClass) return;

    storageService.saveAcademicNote(
      {
        id: `grade_${selectedStudentForGrade.id}_${Date.now()}`,
        studentId: selectedStudentForGrade.id,
        classId: assignedClass.id,
        semester: 'Genap',
        academicYear: '2025/2026',
        subject: gradeSubject,
        score: Number(gradeScore),
        memorizationProgress: gradeHafalan,
        behaviorNote: gradeBehavior,
        recordedByTeacherId: teacherProfile.id,
        updatedAt: new Date().toISOString()
      },
      teacherProfile.title
    );

    setSelectedStudentForGrade(null);
    setGradeHafalan('');
    setGradeBehavior('');
    setSaveSuccessMsg('Nilai dan catatan perkembangan santri berhasil diperbarui.');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAncTitle.trim() || !newAncContent.trim() || !teacherProfile || !assignedClass) return;

    storageService.saveAnnouncement(
      {
        id: `anc_${Date.now()}`,
        title: newAncTitle,
        content: newAncContent,
        targetRole: 'KelasTertentu',
        targetClassId: assignedClass.id,
        authorName: teacherProfile.title,
        publishedAt: new Date().toISOString().split('T')[0],
        isUrgent: false
      },
      teacherProfile.title,
      'teacher'
    );

    setNewAncTitle('');
    setNewAncContent('');
    setSaveSuccessMsg('Pengumuman kelas berhasil diterbitkan untuk orang tua santri.');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaveSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Kata sandi baru dan konfirmasi tidak cocok.');
      return;
    }

    const res = changePassword(oldPassword, newPassword);
    if (res.success) {
      setSaveSuccessMsg(res.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Teacher Header Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-emerald-900">
        <div className="flex items-center gap-5">
          <TeacherAvatar
            name={teacherProfile?.title || 'Guru'}
            roleTitle={teacherProfile?.roleTitle}
            photoUrl={teacherProfile?.photoUrl}
            size="md"
            className="w-16 h-16 rounded-2xl border-2 border-amber-400 shrink-0"
          />
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-400/20 px-2.5 py-0.5 rounded">
              Portal Asatidz & Wali Kelas
            </span>
            <h1 className="text-xl sm:text-2xl font-bold">{teacherProfile?.title}</h1>
            <p className="text-xs text-emerald-200">
              Penugasan: <strong className="text-white">{assignedClass?.name || 'Belum Ditetapkan'}</strong> · {assignedClass?.roomName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-900/80 px-4 py-2 rounded-xl border border-emerald-800 text-center text-xs">
            <span className="text-stone-400 block text-[10px]">Total Santri Kelas</span>
            <span className="text-base font-bold text-amber-300 font-mono">{students.length} Santri</span>
          </div>
        </div>
      </div>

      {/* Save Success or Error Notifications */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveMenu('ringkasan')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeMenu === 'ringkasan' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Ringkasan & Santri
        </button>
        <button
          onClick={() => setActiveMenu('absensi')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeMenu === 'absensi' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Absensi Harian
        </button>
        <button
          onClick={() => setActiveMenu('nilai')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeMenu === 'nilai' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Catatan Akademik & Hafalan
        </button>
        <button
          onClick={() => setActiveMenu('jadwal')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeMenu === 'jadwal' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Jadwal Mengajar
        </button>
        <button
          onClick={() => setActiveMenu('pengumuman')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeMenu === 'pengumuman' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Pengumuman Kelas
        </button>
        {teacherProfile?.permissions.canViewPaymentStatus && (
          <button
            onClick={() => setActiveMenu('keuangan')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeMenu === 'keuangan' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Status SPP Kelas
          </button>
        )}
        <button
          onClick={() => setActiveMenu('profil')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeMenu === 'profil' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Profil & Sandi
        </button>
      </div>

      {/* Menu 1: Ringkasan & Daftar Santri */}
      {activeMenu === 'ringkasan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  Daftar Santri {assignedClass?.name}
                </h2>
                <p className="text-xs text-stone-500">
                  Hanya santri yang berada dalam rombongan belajar yang Anda ampu yang dapat diakses.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-lg font-mono">
                {students.length} Santri Terdaftar
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">No</th>
                    <th className="py-2.5 px-3 font-semibold">NIS</th>
                    <th className="py-2.5 px-3 font-semibold">Nama Lengkap Santri</th>
                    <th className="py-2.5 px-3 font-semibold">L/P</th>
                    <th className="py-2.5 px-3 font-semibold">Tempat, Tgl Lahir</th>
                    <th className="py-2.5 px-3 font-semibold">Alamat Domisili</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {students.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-stone-50/80">
                      <td className="py-2.5 px-3 text-stone-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-900">{student.nis}</td>
                      <td className="py-2.5 px-3 font-bold text-stone-900">{student.fullName}</td>
                      <td className="py-2.5 px-3">{student.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</td>
                      <td className="py-2.5 px-3 text-stone-600">{student.birthPlace}, {student.birthDate}</td>
                      <td className="py-2.5 px-3 text-stone-600 truncate max-w-xs">{student.address}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-semibold">
                          {student.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setEditingStudentForTeacher(student)}
                          className="p-1 text-emerald-800 hover:bg-emerald-100 rounded cursor-pointer"
                          title="Edit & Perbarui Data Santri"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Menu 2: Absensi Harian */}
      {activeMenu === 'absensi' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-800" />
                <span>Pengisian Absensi Santri ({assignedClass?.name})</span>
              </h2>
              <p className="text-xs text-stone-500">
                Pilih tanggal dan tentukan status kehadiran santri. Perubahan tersimpan permanen di database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600">Pilih Tanggal:</span>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg outline-none bg-stone-50"
              />
            </div>
          </div>

          {/* Quick attendance stats and bulk actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <span className="text-stone-500 font-medium">Rekap {attendanceDate}:</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                Hadir: {Object.values(attendanceList).filter(a => a.status === 'Hadir').length}
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">
                Sakit: {Object.values(attendanceList).filter(a => a.status === 'Sakit').length}
              </span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">
                Izin: {Object.values(attendanceList).filter(a => a.status === 'Izin').length}
              </span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded">
                Alpa: {Object.values(attendanceList).filter(a => a.status === 'Alpa').length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const updated: typeof attendanceList = {};
                students.forEach(s => {
                  updated[s.id] = { status: 'Hadir', notes: attendanceList[s.id]?.notes || '' };
                });
                setAttendanceList(updated);
                setSaveSuccessMsg('Seluruh santri ditandai Hadir. Klik tombol "Simpan Rekap Kehadiran" di bawah untuk memvalidasi ke database.');
                setTimeout(() => setSaveSuccessMsg(''), 4000);
              }}
              className="px-3 py-1.5 bg-white border border-stone-300 hover:border-emerald-700 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tandai Semua Hadir</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">No</th>
                  <th className="py-2.5 px-3 font-semibold">Santri</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status Kehadiran</th>
                  <th className="py-2.5 px-3 font-semibold">Catatan Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {students.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3 text-stone-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900">{student.fullName}</div>
                      <div className="text-[10px] text-stone-400 font-mono">NIS: {student.nis}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-2">
                        {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => {
                              setAttendanceList({
                                ...attendanceList,
                                [student.id]: {
                                  status: st,
                                  notes: attendanceList[student.id]?.notes || ''
                                }
                              });
                            }}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition cursor-pointer ${
                              attendanceList[student.id]?.status === st
                                ? st === 'Hadir'
                                  ? 'bg-emerald-700 text-white border-emerald-700'
                                  : st === 'Sakit'
                                  ? 'bg-blue-700 text-white border-blue-700'
                                  : st === 'Izin'
                                  ? 'bg-amber-600 text-white border-amber-600'
                                  : 'bg-rose-700 text-white border-rose-700'
                                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        placeholder="Keterangan..."
                        value={attendanceList[student.id]?.notes || ''}
                        onChange={(e) => {
                          setAttendanceList({
                            ...attendanceList,
                            [student.id]: {
                              status: attendanceList[student.id]?.status || 'Hadir',
                              notes: e.target.value
                            }
                          });
                        }}
                        className="w-full px-2.5 py-1 text-xs border border-stone-200 rounded outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              onClick={handleSaveAttendance}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>Simpan Rekap Kehadiran Tanggal Ini</span>
            </button>
          </div>
        </div>
      )}

      {/* Menu 3: Catatan Akademik & Nilai Hafalan */}
      {activeMenu === 'nilai' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-800" />
                  <span>Catatan Akademik & Progres Hafalan Qur’an</span>
                </h2>
                <p className="text-xs text-stone-500">
                  Rekam capaian nilai mata pelajaran dan catatan muraja'ah santri {assignedClass?.name}.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Santri</th>
                    <th className="py-2.5 px-3 font-semibold">Tahfidz Al-Qur'an</th>
                    <th className="py-2.5 px-3 font-semibold">Fiqih Ibadah</th>
                    <th className="py-2.5 px-3 font-semibold">Aqidah Akhlak</th>
                    <th className="py-2.5 px-3 font-semibold">Progres Hafalan</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {students.map((student) => {
                    const stGrades = academicNotes.filter(n => n.studentId === student.id);
                    const tahfidz = stGrades.find(n => n.subject === 'Tahfidz Al-Qur\'an');
                    const fiqih = stGrades.find(n => n.subject === 'Fiqih Ibadah');
                    const aqidah = stGrades.find(n => n.subject === 'Aqidah Akhlak');
                    const latestHafalan = tahfidz?.memorizationProgress || '-';

                    return (
                      <tr key={student.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3">
                          <div className="font-bold text-stone-900">{student.fullName}</div>
                          <div className="text-[10px] text-stone-400 font-mono">NIS: {student.nis}</div>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-emerald-800">
                          {tahfidz ? tahfidz.score : '-'}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-stone-700">
                          {fiqih ? fiqih.score : '-'}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-stone-700">
                          {aqidah ? aqidah.score : '-'}
                        </td>
                        <td className="py-3 px-3 text-stone-600 max-w-xs">
                          {latestHafalan}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedStudentForGrade(student);
                              setGradeHafalan(tahfidz?.memorizationProgress || '');
                              setGradeBehavior(tahfidz?.behaviorNote || '');
                              setGradeScore(tahfidz ? tahfidz.score : 85);
                            }}
                            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded font-semibold text-[11px]"
                          >
                            Update Nilai
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal / Form Edit Nilai */}
          {selectedStudentForGrade && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="relative max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="font-bold text-stone-900 text-base">
                    Input Nilai: {selectedStudentForGrade.fullName}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">NIS: {selectedStudentForGrade.nis}</p>
                </div>

                <form onSubmit={handleSaveGrade} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Mata Pelajaran</label>
                    <select
                      value={gradeSubject}
                      onChange={(e) => setGradeSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white"
                    >
                      <option value="Tahfidz Al-Qur'an">Tahfidz Al-Qur'an & Tajwid</option>
                      <option value="Fiqih Ibadah">Fiqih Ibadah & Praktik Sholat</option>
                      <option value="Aqidah Akhlak">Aqidah Akhlak</option>
                      <option value="Bahasa Arab">Bahasa Arab & Mufrodat</option>
                      <option value="Tarikh Islam">Tarikh / Sejarah Kebudayaan Islam</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Nilai Angka (0 - 100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={gradeScore}
                      onChange={(e) => setGradeScore(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Capaian Progres Hafalan</label>
                    <input
                      type="text"
                      placeholder="Misal: Surat Al-Balad s.d. An-Naba (Lancar Tajwid)"
                      value={gradeHafalan}
                      onChange={(e) => setGradeHafalan(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Catatan Akhlak & Perilaku</label>
                    <textarea
                      rows={2}
                      placeholder="Catatan sikap dan ketertiban santri..."
                      value={gradeBehavior}
                      onChange={(e) => setGradeBehavior(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setSelectedStudentForGrade(null)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                    >
                      Simpan Catatan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Menu 4: Jadwal Mengajar */}
      {activeMenu === 'jadwal' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-800" />
              <span>Jadwal Pelajaran {assignedClass?.name}</span>
            </h2>
            <p className="text-xs text-stone-500">
              Agenda pembelajaran sore hari dari Senin hingga Sabtu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((sch) => (
              <div key={sch.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900 bg-emerald-100/70 px-2.5 py-0.5 rounded">
                    {sch.day}
                  </span>
                  <span className="font-mono text-stone-500">{sch.timeSlot}</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900">{sch.subject}</h4>
                <p className="text-[11px] text-stone-500">{assignedClass?.roomName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu 5: Pengumuman Kelas */}
      {activeMenu === 'pengumuman' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-800" />
              <span>Buat Pengumuman Kelas</span>
            </h3>
            <p className="text-xs text-stone-500">
              Pengumuman ini akan langsung muncul di portal orang tua untuk santri di {assignedClass?.name}.
            </p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengingat Muraja'ah Surat Al-Fajr"
                  value={newAncTitle}
                  onChange={(e) => setNewAncTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Isi Pengumuman</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pesan kepada orang tua santri..."
                  value={newAncContent}
                  onChange={(e) => setNewAncContent(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition"
              >
                Terbitkan Pengumuman Kelas
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-800" />
              <span>Daftar Pengumuman Aktif</span>
            </h3>

            <div className="space-y-3">
              {announcements.map((anc) => (
                <div key={anc.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-semibold text-emerald-900">{anc.authorName}</span>
                    <span>{anc.publishedAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">{anc.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{anc.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-xs text-stone-400 py-6 text-center">Belum ada pengumuman kelas.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menu 6: Status SPP Kelas (Read-only for Teacher) */}
      {activeMenu === 'keuangan' && teacherProfile?.permissions.canViewPaymentStatus && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-800" />
              <span>Ringkasan Status SPP Santri ({assignedClass?.name})</span>
            </h2>
            <p className="text-xs text-stone-500">
              Akses khusus melihat status pelunasan santri untuk keperluan koordinasi dengan wali santri (Hak kelola nominal dan verifikasi tetap dipegang oleh admin/bendahara).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Santri</th>
                  <th className="py-2.5 px-3 font-semibold">Bulan</th>
                  <th className="py-2.5 px-3 font-semibold">Tagihan</th>
                  <th className="py-2.5 px-3 font-semibold">Sisa</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {classBills.map((b) => {
                  const student = students.find(s => s.id === b.studentId);
                  return (
                    <tr key={b.id} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 font-bold text-stone-900">
                        {student?.fullName || b.studentId}
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">{b.billingMonth}</td>
                      <td className="py-2.5 px-3 font-mono">Rp {b.amount.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold">
                        Rp {b.remainingAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            b.status === 'Lunas'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'Menunggu Verifikasi'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Menu 7: Profil Guru & Ganti Sandi */}
      {activeMenu === 'profil' && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-800" />
              <span>Ganti Kata Sandi Guru</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Jaga kerahasiaan akun Anda dengan memperbarui sandi secara berkala.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Kata Sandi Saat Ini *</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Kata Sandi Baru (Minimal 6 Karakter) *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Konfirmasi Kata Sandi Baru *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition"
            >
              Simpan Kata Sandi Baru
            </button>
          </form>
        </div>
      )}

      {/* Teacher Edit Student Modal */}
      {editingStudentForTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-bold text-base text-stone-900">
              Perbarui Data Santri: {editingStudentForTeacher.fullName}
            </h3>
            <p className="text-xs text-stone-500">
              Wali kelas berwenang memperbarui identitas dan domisili santri binaannya.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                storageService.updateStudentByTeacher(editingStudentForTeacher, teacherProfile?.title || 'Guru');
                setSaveSuccessMsg(`Data santri ${editingStudentForTeacher.fullName} berhasil diperbarui.`);
                setTimeout(() => setSaveSuccessMsg(''), 4000);
                setEditingStudentForTeacher(null);
                loadData();
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Nama Lengkap Santri *</label>
                <input
                  type="text"
                  required
                  value={editingStudentForTeacher.fullName}
                  onChange={(e) => setEditingStudentForTeacher({ ...editingStudentForTeacher, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Jenis Kelamin</label>
                  <select
                    value={editingStudentForTeacher.gender}
                    onChange={(e) => setEditingStudentForTeacher({ ...editingStudentForTeacher, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Status</label>
                  <select
                    value={editingStudentForTeacher.status}
                    onChange={(e) => setEditingStudentForTeacher({ ...editingStudentForTeacher, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Tempat Lahir</label>
                  <input
                    type="text"
                    value={editingStudentForTeacher.birthPlace}
                    onChange={(e) => setEditingStudentForTeacher({ ...editingStudentForTeacher, birthPlace: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={editingStudentForTeacher.birthDate}
                    onChange={(e) => setEditingStudentForTeacher({ ...editingStudentForTeacher, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Alamat Domisili</label>
                <textarea
                  rows={2}
                  value={editingStudentForTeacher.address}
                  onChange={(e) => setEditingStudentForTeacher({ ...editingStudentForTeacher, address: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudentForTeacher(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold cursor-pointer hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
