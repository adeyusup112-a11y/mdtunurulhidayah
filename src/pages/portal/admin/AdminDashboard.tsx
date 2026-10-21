import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { storageService } from '../../../services/storageService';
import {
  Student,
  TeacherProfile,
  ParentProfile,
  ClassItem,
  AttendanceRecord,
  AcademicNote,
  ScheduleItem,
  NewsItem,
  AnnouncementItem,
  AdmissionApplicant,
  GalleryItem,
  PaymentType,
  StudentBill,
  PaymentReport,
  PaymentReceipt,
  PaymentAuditLog,
  SiteSettings,
  ContactMessage,
  ActivityLog
} from '../../../types';
import { ReceiptModal } from '../../../components/receipt/ReceiptModal';
import { TeacherAvatar, CARTOON_AVATAR_OPTIONS } from '../../../components/common/TeacherAvatar';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  CalendarCheck,
  Award,
  Clock,
  Newspaper,
  Image as ImageIcon,
  UserPlus,
  CreditCard,
  FileSpreadsheet,
  KeyRound,
  Building2,
  Settings,
  MessageSquare,
  ShieldAlert,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  Printer,
  ChevronRight,
  RefreshCw,
  Eye
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  // Admin menu selection
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');

  // Core database state
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSiteSettings());
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<ParentProfile[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [academicNotes, setAcademicNotes] = useState<AcademicNote[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionApplicant[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [bills, setBills] = useState<StudentBill[]>([]);
  const [paymentReports, setPaymentReports] = useState<PaymentReport[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Modals & form states
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingReceipt, setViewingReceipt] = useState<PaymentReceipt | null>(null);

  // Sub-forms: Bill Generation
  const [genMonth, setGenMonth] = useState('Juni 2026');
  const [genPaymentType, setGenPaymentType] = useState('pt_spp');
  const [genDueDate, setGenDueDate] = useState('2026-06-15');
  const [genClassTarget, setGenClassTarget] = useState('all');

  // Sub-forms: Direct Cash Payment Modal
  const [cashBill, setCashBill] = useState<StudentBill | null>(null);
  const [cashAmount, setCashAmount] = useState<number>(35000);

  // Sub-forms: Reject Payment Modal
  const [rejectReport, setRejectReport] = useState<PaymentReport | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Sub-forms: Convert PPDB Applicant to Student
  const [convertingApplicant, setConvertingApplicant] = useState<AdmissionApplicant | null>(null);
  const [assignClassForApplicant, setAssignClassForApplicant] = useState('class_1');

  // Sub-forms: Teacher Edit / Add
  const [editingTeacher, setEditingTeacher] = useState<Partial<TeacherProfile> | null>(null);

  // Sub-forms: Student Edit / Add
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);

  // Sub-forms: News Edit / Add
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);

  // Sub-forms: Reset Password Modal
  const [resettingUser, setResettingUser] = useState<{ id: string; name: string } | null>(null);
  const [adminNewPassword, setAdminNewPassword] = useState('');

  // Backup file input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadAllData = () => {
    setSettings(storageService.getSiteSettings());
    setTeachers(storageService.getTeachers(true));
    setStudents(storageService.getStudents());
    setParents(storageService.getParents());
    setClasses(storageService.getClasses());
    setAttendance(storageService.getAttendance());
    setAcademicNotes(storageService.getAcademicNotes());
    setSchedules(storageService.getSchedules());
    setNews(storageService.getNews());
    setAnnouncements(storageService.getAnnouncements());
    setAdmissions(storageService.getAdmissions());
    setGallery(storageService.getGallery());
    setPaymentTypes(storageService.getPaymentTypes());
    setBills(storageService.getBills());
    setPaymentReports(storageService.getPaymentReports());
    setReceipts(storageService.getReceiptsByStudentId('')); // all
    setContactMessages(storageService.getContactMessages());
    setActivityLogs(storageService.getActivityLogs());
  };

  useEffect(() => {
    loadAllData();
    const unsub = storageService.subscribe(() => loadAllData());
    return unsub;
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- Financial Actions ---
  const handleApproveReport = (report: PaymentReport) => {
    const res = storageService.verifyPaymentReport(report.id, 'APPROVE', undefined, currentUser?.fullName || 'Ust. Ade Yusup, S.Pd.');
    if (res.success) {
      showToast('success', res.message);
      if (res.receipt) setViewingReceipt(res.receipt);
    } else {
      showToast('error', res.message);
    }
  };

  const handleRejectReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReport) return;
    const res = storageService.verifyPaymentReport(rejectReport.id, 'REJECT', rejectionReason, currentUser?.fullName || 'Ust. Ade Yusup, S.Pd.');
    if (res.success) {
      showToast('success', res.message);
      setRejectReport(null);
      setRejectionReason('');
    } else {
      showToast('error', res.message);
    }
  };

  const handleRecordCash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashBill) return;
    const res = storageService.recordDirectCashPayment(cashBill.id, cashAmount, currentUser?.fullName || 'Ust. Ade Yusup, S.Pd.');
    if (res.success) {
      showToast('success', res.message);
      setCashBill(null);
      if (res.receipt) setViewingReceipt(res.receipt);
    } else {
      showToast('error', res.message);
    }
  };

  const handleGenerateBills = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = genClassTarget === 'all' ? undefined : genClassTarget;
    const res = storageService.generateMonthlyBillsForPeriod(genMonth, genPaymentType, genDueDate, targetClass, currentUser?.fullName || 'Admin');
    showToast('success', res.message);
  };

  // --- PPDB Conversion Action ---
  const handleConvertPPDB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingApplicant) return;
    const res = storageService.convertApplicantToStudent(convertingApplicant.id, assignClassForApplicant, currentUser?.fullName || 'Admin');
    if (res.success) {
      showToast('success', res.message);
      setConvertingApplicant(null);
    } else {
      showToast('error', res.message);
    }
  };

  // --- Export CSV helpers ---
  const exportBillsToCSV = () => {
    let csv = 'No Invoice,NIS,Nama Santri,Kelas,Bulan,Nominal,Terbayar,Sisa,Status,Jatuh Tempo\n';
    bills.forEach(b => {
      const student = students.find(s => s.id === b.studentId);
      const cls = student ? classes.find(c => c.id === student.classId) : undefined;
      csv += `"${b.billNumber}","${student?.nis || ''}","${student?.fullName || ''}","${cls?.name || ''}","${b.billingMonth}",${b.amount},${b.paidAmount},${b.remainingAmount},"${b.status}","${b.dueDate}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_SPP_MDTU_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Laporan keuangan SPP berhasil diekspor ke format CSV.');
  };

  const exportBackupJSON = () => {
    const json = storageService.exportDatabaseJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Backup_MDTU_Nurul_Hidayah_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Cadangan database JSON berhasil diunduh.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storageService.importDatabaseJson(content);
      if (res.success) {
        showToast('success', res.message);
      } else {
        showToast('error', res.message);
      }
    };
    reader.readAsText(file);
  };

  const financialStats = storageService.getFinancialSummary();

  const menuItems = [
    { id: 'dashboard', label: '1. Dashboard Utama', icon: LayoutDashboard },
    { id: 'guru', label: '2. Data Guru', icon: GraduationCap },
    { id: 'siswa', label: '3. Data Siswa (Santri)', icon: Users },
    { id: 'orangtua', label: '4. Data Orang Tua / Wali', icon: Users },
    { id: 'kelas', label: '5. Data Kelas & Ruangan', icon: School },
    { id: 'wali-kelas', label: '6. Pembagian Wali Kelas', icon: School },
    { id: 'absensi', label: '7. Monitoring Absensi', icon: CalendarCheck },
    { id: 'nilai', label: '8. Catatan Akademik', icon: Award },
    { id: 'jadwal', label: '9. Jadwal Pelajaran', icon: Clock },
    { id: 'berita', label: '10. Berita & Pengumuman', icon: Newspaper },
    { id: 'galeri', label: '11. Galeri Kegiatan', icon: ImageIcon },
    { id: 'ppdb', label: '12. Pendaftaran Santri Baru', icon: UserPlus },
    { id: 'tagihan', label: '13. Tagihan Bulanan (SPP)', icon: CreditCard },
    { id: 'laporan-keuangan', label: '14. Verifikasi & Laporan SPP', icon: FileSpreadsheet },
    { id: 'manajemen-akun', label: '15. Manajemen Akun & Hak Akses', icon: KeyRound },
    { id: 'profil-lembaga', label: '16. Profil Lembaga', icon: Building2 },
    { id: 'pengaturan-web', label: '17. Pengaturan Website', icon: Settings },
    { id: 'pesan', label: '18. Pesan Masuk', icon: MessageSquare },
    { id: 'log', label: '19. Log Aktivitas', icon: Clock },
    { id: 'keamanan', label: '20. Pengaturan Keamanan & Backup', icon: ShieldAlert },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Command Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-emerald-900">
        <div>
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-400/20 px-2.5 py-0.5 rounded">
            Pusat Komando Administrasi Lembaga
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">Dashboard Admin MDTU Nurul Hidayah</h1>
          <p className="text-xs text-emerald-200">
            Terhubung langsung ke database: 4 Guru · 40 Wali Santri · 40 Santri Terdaftar · 4 Kelas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportBillsToCSV}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Ekspor Laporan Keuangan CSV</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Admin Layout: Sidebar Tabs + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 20-Point Menu List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 p-3 shadow-xs space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-900 border-b border-stone-100 mb-1">
            Menu Utama Pengelola
          </div>
          <div className="space-y-0.5 max-h-[75vh] overflow-y-auto pr-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSearchTerm('');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-white font-semibold shadow-2xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Dynamic Work Area */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs min-h-[600px]">
          {/* 1. Dashboard Utama */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-8">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Ringkasan Eksekutif Lembaga</h2>
                <p className="text-xs text-stone-500">
                  Gambaran umum operasional, keuangan SPP bulanan, dan aktivitas santri saat ini.
                </p>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
                  <span className="text-[11px] text-stone-600 block">Total Pendapatan Terverifikasi</span>
                  <div className="text-xl font-bold font-mono text-emerald-900">
                    Rp {financialStats.verifiedIncome.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] text-emerald-700">Lunas & Resmi</span>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-1">
                  <span className="text-[11px] text-stone-600 block">Menunggu Verifikasi</span>
                  <div className="text-xl font-bold font-mono text-blue-900">
                    {financialStats.pendingVerificationCount} Laporan
                  </div>
                  <span className="text-[10px] text-blue-700">
                    Rp {financialStats.pendingVerificationAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-1">
                  <span className="text-[11px] text-stone-600 block">Total Tunggakan SPP</span>
                  <div className="text-xl font-bold font-mono text-amber-900">
                    Rp {financialStats.totalArrears.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] text-amber-700">{financialStats.unpaidBillsCount} Tagihan Belum Lunas</span>
                </div>

                <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[11px] text-stone-600 block">Santri Aktif</span>
                  <div className="text-xl font-bold font-mono text-stone-900">
                    {students.length} Santri
                  </div>
                  <span className="text-[10px] text-stone-500">4 Rombel (Kelas 1 - 4)</span>
                </div>
              </div>

              {/* Quick Actions & Verification Queue */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-800" />
                    <span>Antrean Laporan Pembayaran Wali Santri yang Menunggu Verifikasi</span>
                  </h3>
                  <button
                    onClick={() => setActiveMenu('laporan-keuangan')}
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Buka Halaman Verifikasi Penuh →
                  </button>
                </div>

                <div className="overflow-x-auto border border-stone-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-700 border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Santri / Invoice</th>
                        <th className="py-2.5 px-3">Nama Pengirim</th>
                        <th className="py-2.5 px-3">Jumlah Transfer</th>
                        <th className="py-2.5 px-3">Waktu Lapor</th>
                        <th className="py-2.5 px-3 text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {paymentReports
                        .filter(r => r.status === 'Menunggu Verifikasi')
                        .map((report) => {
                          const bill = bills.find(b => b.id === report.billId);
                          const student = students.find(s => s.id === report.studentId);
                          return (
                            <tr key={report.id} className="hover:bg-stone-50">
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-stone-900">{student?.fullName}</div>
                                <div className="text-[10px] font-mono text-stone-500">{bill?.billNumber}</div>
                              </td>
                              <td className="py-2.5 px-3 font-medium text-stone-800">
                                {report.senderAccountName || 'Wali Santri'}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">
                                Rp {report.reportedAmount.toLocaleString('id-ID')}
                              </td>
                              <td className="py-2.5 px-3 text-stone-500">{report.createdAt.split('T')[0]}</td>
                              <td className="py-2.5 px-3 text-center space-x-2">
                                <button
                                  onClick={() => handleApproveReport(report)}
                                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold text-[11px] cursor-pointer"
                                >
                                  Verifikasi Sah
                                </button>
                                <button
                                  onClick={() => setRejectReport(report)}
                                  className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded font-semibold text-[11px] cursor-pointer"
                                >
                                  Tolak
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      {paymentReports.filter(r => r.status === 'Menunggu Verifikasi').length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-stone-400">
                            Semua laporan pembayaran telah diverifikasi. Tidak ada antrean pending.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. Data Guru */}
          {activeMenu === 'guru' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Manajemen Data Dewan Guru</h2>
                  <p className="text-xs text-stone-500">
                    Data 4 pendidik awal MDTU Nurul Hidayah beserta penugasan kelas dan mata pelajaran.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingTeacher({
                      id: `teacher_${Date.now()}`,
                      userId: `user_teacher_${Date.now()}`,
                      fullName: '',
                      title: 'Ust. ',
                      roleTitle: 'Pengajar',
                      phone: '08',
                      photoUrl: '/src/assets/images/cartoon_ustadz_clean_1792552709074.jpg',
                      bio: '',
                      subjects: ['Fiqih'],
                      permissions: {
                        canManageAttendance: true,
                        canManageGrades: true,
                        canManageAnnouncements: true,
                        canViewPaymentStatus: true
                      },
                      isActive: true
                    })
                  }
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Guru Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                    <tr>
                      <th className="py-2.5 px-3">Guru & Ikon Kartun</th>
                      <th className="py-2.5 px-3">Jabatan & Wali Kelas</th>
                      <th className="py-2.5 px-3">Pendidikan</th>
                      <th className="py-2.5 px-3">No. HP</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {teachers.map((t) => (
                      <tr key={t.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <TeacherAvatar
                              name={t.title}
                              roleTitle={t.roleTitle}
                              photoUrl={t.photoUrl}
                              size="sm"
                              className="w-8 h-8 rounded-full border border-emerald-200 shrink-0"
                            />
                            <span className="font-bold text-stone-900">{t.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-emerald-900">{t.roleTitle}</td>
                        <td className="py-3 px-3 text-stone-600">{t.education || '-'}</td>
                        <td className="py-3 px-3 font-mono">{t.phone}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              t.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {t.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center space-x-2">
                          <button
                            onClick={() => setEditingTeacher(t)}
                            className="p-1 text-emerald-800 hover:bg-emerald-50 rounded"
                            title="Edit Data Guru"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Nonaktifkan guru ${t.title}?`)) {
                                storageService.deleteTeacher(t.id, currentUser?.fullName || 'Admin');
                                showToast('success', `Guru ${t.title} berhasil dinonaktifkan.`);
                              }
                            }}
                            className="p-1 text-rose-700 hover:bg-rose-50 rounded"
                            title="Nonaktifkan Guru"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Data Siswa (Santri) */}
          {activeMenu === 'siswa' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Data Induk Santri (40 Siswa Terdaftar)</h2>
                  <p className="text-xs text-stone-500">
                    Daftar seluruh santri aktif beserta nomor induk (NIS) dan tautan ke profil wali.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cari santri atau NIS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg outline-none"
                  />
                  <button
                    onClick={() =>
                      setEditingStudent({
                        id: `student_${Date.now()}`,
                        nis: `202601${String(students.length + 1).padStart(3, '0')}`,
                        fullName: '',
                        gender: 'L',
                        birthPlace: 'Ciamis',
                        birthDate: '2019-01-01',
                        classId: 'class_1',
                        parentId: parents[0]?.id || 'parent_01',
                        address: 'Kp. Dukuh Sari, Sirnabaya',
                        enrollmentYear: 2026,
                        status: 'Aktif'
                      })
                    }
                    className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Santri</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                    <tr>
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">NIS</th>
                      <th className="py-2.5 px-3">Nama Santri</th>
                      <th className="py-2.5 px-3">Kelas</th>
                      <th className="py-2.5 px-3">Wali Santri</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {students
                      .filter(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.nis.includes(searchTerm))
                      .map((s, idx) => {
                        const cls = classes.find(c => c.id === s.classId);
                        const prt = parents.find(p => p.id === s.parentId);
                        return (
                          <tr key={s.id} className="hover:bg-stone-50">
                            <td className="py-2.5 px-3 font-mono text-stone-400">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-emerald-900">{s.nis}</td>
                            <td className="py-2.5 px-3 font-bold text-stone-900">{s.fullName}</td>
                            <td className="py-2.5 px-3 font-medium text-stone-700">{cls?.name}</td>
                            <td className="py-2.5 px-3 text-stone-600">{prt?.fullName || '-'}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                                {s.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center space-x-2">
                              <button
                                onClick={() => setEditingStudent(s)}
                                className="p-1 text-emerald-800 hover:bg-emerald-50 rounded"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Data Orang Tua / Wali */}
          {activeMenu === 'orangtua' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Data Orang Tua / Wali Santri (40 Akun Terhubung)</h2>
                <p className="text-xs text-stone-500">
                  Setiap orang tua memiliki relasi privat ke santri kandungnya untuk keamanan mutlak data nilai dan tagihan.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                    <tr>
                      <th className="py-2.5 px-3">Nama Wali Santri</th>
                      <th className="py-2.5 px-3">Hubungan</th>
                      <th className="py-2.5 px-3">Nomor Telepon / WhatsApp</th>
                      <th className="py-2.5 px-3">Alamat</th>
                      <th className="py-2.5 px-3">Santri Terhubung</th>
                      <th className="py-2.5 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {parents.map((p) => {
                      const linkedStudents = students.filter(s => p.studentIds.includes(s.id));
                      return (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3 font-bold text-stone-900">{p.fullName}</td>
                          <td className="py-2.5 px-3 font-semibold text-stone-700">{p.relationship}</td>
                          <td className="py-2.5 px-3 font-mono">{p.phone}</td>
                          <td className="py-2.5 px-3 text-stone-600 truncate max-w-xs">{p.address}</td>
                          <td className="py-2.5 px-3">
                            {linkedStudents.map(s => (
                              <span key={s.id} className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-900 font-semibold rounded text-[11px] mr-1">
                                {s.fullName} ({s.classId.replace('class_', 'K')})
                              </span>
                            ))}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => {
                                setResettingUser({ id: p.userId, name: p.fullName });
                                setAdminNewPassword('wali123');
                              }}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-semibold"
                            >
                              Reset Sandi
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Data Kelas */}
          {activeMenu === 'kelas' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Rombongan Belajar (Kelas 1 - 4)</h2>
                <p className="text-xs text-stone-500">
                  Pembagian kelas formal jenjang Ula beserta penugasan ruangan dan wali kelas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {classes.map((cls) => {
                  const teacher = teachers.find(t => t.id === cls.teacherId);
                  const studentCount = students.filter(s => s.classId === cls.id).length;
                  return (
                    <div key={cls.id} className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-emerald-950">{cls.name}</h3>
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                          {studentCount} Santri
                        </span>
                      </div>
                      <div className="text-xs space-y-1 text-stone-600">
                        <p><strong>Wali Kelas:</strong> {teacher?.title || 'Belum Ditetapkan'}</p>
                        <p><strong>Ruang Belajar:</strong> {cls.roomName}</p>
                        <p><strong>Tahun Ajaran:</strong> {cls.academicYear}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. Pembagian Wali Kelas */}
          {activeMenu === 'wali-kelas' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Penugasan Wali Kelas</h2>
                <p className="text-xs text-stone-500">
                  Ubah penugasan wali kelas secara langsung. Hak akses data absensi dan nilai akan otomatis menyesuaikan.
                </p>
              </div>

              <div className="space-y-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{cls.name}</h4>
                      <p className="text-xs text-stone-500">{cls.roomName} · Tahun Ajaran {cls.academicYear}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-stone-700">Wali Kelas:</span>
                      <select
                        value={cls.teacherId}
                        onChange={(e) => {
                          storageService.reassignClassTeacher(cls.id, e.target.value, currentUser?.fullName || 'Admin');
                          showToast('success', `Wali kelas ${cls.name} berhasil diperbarui.`);
                        }}
                        className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white outline-none font-semibold text-emerald-950"
                      >
                        {teachers.filter(t => t.isActive).map(t => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Monitoring Absensi */}
          {activeMenu === 'absensi' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Monitoring Absensi Seluruh Kelas</h2>
                <p className="text-xs text-stone-500">
                  Data kehadiran santri dari kelas 1 sampai 4 yang dicatat harian oleh masing-masing wali kelas.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                    <tr>
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">Kelas</th>
                      <th className="py-2.5 px-3">Santri</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {attendance.slice(0, 50).map((att) => {
                      const student = students.find(s => s.id === att.studentId);
                      const cls = classes.find(c => c.id === att.classId);
                      return (
                        <tr key={att.id} className="hover:bg-stone-50">
                          <td className="py-2 px-3 font-mono">{att.date}</td>
                          <td className="py-2 px-3 font-semibold text-stone-800">{cls?.name}</td>
                          <td className="py-2 px-3 font-bold text-stone-900">{student?.fullName}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                att.status === 'Hadir'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : att.status === 'Sakit'
                                  ? 'bg-blue-100 text-blue-800'
                                  : att.status === 'Izin'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {att.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-stone-600">{att.notes || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. Catatan Akademik */}
          {activeMenu === 'nilai' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Rekap Nilai & Mutaba'ah Hafalan</h2>
                <p className="text-xs text-stone-500">
                  Arsip capaian nilai ujian, hafalan juz Al-Qur'an, dan adab santri MDTU Nurul Hidayah.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                    <tr>
                      <th className="py-2.5 px-3">Santri</th>
                      <th className="py-2.5 px-3">Kelas</th>
                      <th className="py-2.5 px-3">Mata Pelajaran</th>
                      <th className="py-2.5 px-3">Nilai</th>
                      <th className="py-2.5 px-3">Progres Hafalan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {academicNotes.slice(0, 40).map((n) => {
                      const student = students.find(s => s.id === n.studentId);
                      const cls = classes.find(c => c.id === n.classId);
                      return (
                        <tr key={n.id} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3 font-bold text-stone-900">{student?.fullName}</td>
                          <td className="py-2.5 px-3 font-medium text-stone-700">{cls?.name}</td>
                          <td className="py-2.5 px-3 font-semibold text-emerald-950">{n.subject}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{n.score}</td>
                          <td className="py-2.5 px-3 text-stone-600 max-w-xs">{n.memorizationProgress || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. Jadwal Pelajaran */}
          {activeMenu === 'jadwal' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Jadwal Pembelajaran Diniyah</h2>
                <p className="text-xs text-stone-500">
                  Pengaturan jadwal mata pelajaran sore hari di MDTU Nurul Hidayah.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {schedules.map((sch) => {
                  const cls = classes.find(c => c.id === sch.classId);
                  const teacher = teachers.find(t => t.id === sch.teacherId);
                  return (
                    <div key={sch.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">{sch.day}</span>
                        <span className="font-mono text-stone-500">{sch.timeSlot}</span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900">{sch.subject}</h4>
                      <p className="text-xs text-stone-600">{cls?.name} · Pengampu: {teacher?.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 10. Berita & Pengumuman */}
          {activeMenu === 'berita' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Kelola Berita & Warta Madrasah</h2>
                  <p className="text-xs text-stone-500">
                    Publikasikan kabar terbaru untuk ditampilkan di halaman publik website.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingNews({
                      id: `news_${Date.now()}`,
                      title: '',
                      slug: '',
                      category: 'Kegiatan',
                      summary: '',
                      content: '',
                      imageUrl: '/src/assets/images/hero_madrasah_building_1792550359080.jpg',
                      author: currentUser?.fullName || 'Ust. Ade Yusup, S.Pd.',
                      publishedAt: new Date().toISOString().split('T')[0],
                      isPublished: true,
                      views: 0
                    })
                  }
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tulis Berita Baru</span>
                </button>
              </div>

              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-stone-200 overflow-hidden shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-700 font-bold uppercase">{item.category}</span>
                        <h4 className="font-bold text-sm text-stone-900">{item.title}</h4>
                        <p className="text-xs text-stone-500">{item.publishedAt} · Penulis: {item.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingNews(item)}
                        className="px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-semibold hover:bg-stone-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus berita "${item.title}"?`)) {
                            storageService.deleteNews(item.id, currentUser?.fullName || 'Admin');
                            showToast('success', 'Berita berhasil dihapus.');
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded text-xs font-semibold hover:bg-rose-100"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. Galeri Kegiatan */}
          {activeMenu === 'galeri' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Kelola Galeri Foto</h2>
                  <p className="text-xs text-stone-500">
                    Dokumentasi kegiatan dan sarana MDTU Nurul Hidayah.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden space-y-2 p-3">
                    <div className="h-32 w-full rounded-lg overflow-hidden bg-stone-200">
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold">{g.category}</span>
                      <h4 className="font-bold text-xs text-stone-900 truncate">{g.title}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2">{g.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. Pendaftaran Santri Baru (PPDB) */}
          {activeMenu === 'ppdb' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Penerimaan Santri Baru (PPDB Online)</h2>
                <p className="text-xs text-stone-500">
                  Verifikasi pendaftaran santri, update status, dan konversi pendaftar yang diterima menjadi santri aktif.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                    <tr>
                      <th className="py-2.5 px-3">No. Registrasi</th>
                      <th className="py-2.5 px-3">Nama Santri</th>
                      <th className="py-2.5 px-3">Wali Santri / HP</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-center">Tindakan Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {admissions.map((adm) => (
                      <tr key={adm.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3 font-mono font-bold text-emerald-900">{adm.regNumber}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-stone-900">{adm.fullName}</div>
                          <div className="text-[10px] text-stone-500">{adm.gender === 'L' ? 'Laki-laki' : 'Perempuan'} · {adm.birthPlace}, {adm.birthDate}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-stone-800">{adm.parentName} ({adm.parentRelationship})</div>
                          <div className="font-mono text-[11px] text-stone-500">{adm.parentPhone}</div>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={adm.status}
                            onChange={(e) => {
                              storageService.updateAdmissionStatus(adm.id, e.target.value as any, undefined, currentUser?.fullName || 'Admin');
                              showToast('success', `Status pendaftaran ${adm.fullName} diubah ke ${e.target.value}.`);
                            }}
                            className="px-2 py-1 text-xs border border-stone-300 rounded font-semibold bg-white"
                          >
                            <option value="Diajukan">Diajukan</option>
                            <option value="Sedang Diverifikasi">Sedang Diverifikasi</option>
                            <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                            <option value="Diterima">Diterima</option>
                            <option value="Ditolak">Ditolak</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {adm.status === 'Diterima' && !adm.isConvertedToStudent ? (
                            <button
                              onClick={() => {
                                setConvertingApplicant(adm);
                                setAssignClassForApplicant(adm.targetClassId || 'class_1');
                              }}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded text-[11px]"
                            >
                              Konversi ke Santri Aktif
                            </button>
                          ) : adm.isConvertedToStudent ? (
                            <span className="text-emerald-800 font-bold text-[11px]">
                              ✓ Telah Aktif ({adm.convertedStudentId})
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">Belum Diterima</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 13. Tagihan Bulanan (SPP) Generator */}
          {activeMenu === 'tagihan' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Penerbitan Tagihan Bulanan (SPP)</h2>
                <p className="text-xs text-stone-500">
                  Terbitkan tagihan iuran madrasah secara massal untuk periode baru. Sistem mencegah duplikasi tagihan ganda.
                </p>
              </div>

              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 max-w-xl">
                <h3 className="font-bold text-sm text-stone-900">Form Penerbitan Tagihan Periode</h3>
                <form onSubmit={handleGenerateBills} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Periode Bulan & Tahun</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Juni 2026 / Juli 2026"
                      value={genMonth}
                      onChange={(e) => setGenMonth(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Jenis Pembayaran</label>
                    <select
                      value={genPaymentType}
                      onChange={(e) => setGenPaymentType(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white"
                    >
                      {paymentTypes.map(pt => (
                        <option key={pt.id} value={pt.id}>
                          {pt.name} (Rp {pt.amount.toLocaleString('id-ID')})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Tanggal Jatuh Tempo</label>
                    <input
                      type="date"
                      required
                      value={genDueDate}
                      onChange={(e) => setGenDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Sasaran Rombel</label>
                    <select
                      value={genClassTarget}
                      onChange={(e) => setGenClassTarget(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white"
                    >
                      <option value="all">Semua Kelas (40 Santri)</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition"
                  >
                    Terbitkan Tagihan Massal
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 14. Laporan & Verifikasi Keuangan */}
          {activeMenu === 'laporan-keuangan' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Rekapitulasi Tagihan & Laporan SPP</h2>
                  <p className="text-xs text-stone-500">
                    Verifikasi bukti transfer, pencatatan pembayaran tunai di kantor, dan pencetakan kuitansi resmi.
                  </p>
                </div>
                <button
                  onClick={exportBillsToCSV}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ekspor CSV</span>
                </button>
              </div>

              {/* Table of all bills */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                    <tr>
                      <th className="py-2.5 px-3">Invoice</th>
                      <th className="py-2.5 px-3">Santri</th>
                      <th className="py-2.5 px-3">Bulan</th>
                      <th className="py-2.5 px-3">Tagihan</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-center">Aksi Pengelola</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {bills.slice(0, 50).map((b) => {
                      const student = students.find(s => s.id === b.studentId);
                      const receipt = receipts.find(r => r.billId === b.id);
                      return (
                        <tr key={b.id} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3 font-mono font-semibold text-stone-600">{b.billNumber}</td>
                          <td className="py-2.5 px-3 font-bold text-stone-900">{student?.fullName}</td>
                          <td className="py-2.5 px-3 text-stone-700">{b.billingMonth}</td>
                          <td className="py-2.5 px-3 font-mono">Rp {b.amount.toLocaleString('id-ID')}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                b.status === 'Lunas'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'Menunggu Verifikasi'
                                  ? 'bg-blue-100 text-blue-800'
                                  : b.status === 'Ditolak'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center space-x-2">
                            {b.status === 'Lunas' && receipt && (
                              <button
                                onClick={() => setViewingReceipt(receipt)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded font-semibold text-[11px]"
                              >
                                Kuitansi
                              </button>
                            )}
                            {b.status === 'Belum Bayar' && (
                              <button
                                onClick={() => {
                                  setCashBill(b);
                                  setCashAmount(b.remainingAmount);
                                }}
                                className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold text-[11px]"
                              >
                                Terima Tunai
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 15. Manajemen Akun & Hak Akses */}
          {activeMenu === 'manajemen-akun' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Manajemen Akun & Reset Kata Sandi</h2>
                <p className="text-xs text-stone-500">
                  Reset kata sandi pengguna secara aman. Sandi tidak pernah ditampilkan polos di website.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900">Akun Pengurus & Dewan Guru</h4>
                  <div className="space-y-2">
                    {teachers.map(t => (
                      <div key={t.id} className="flex items-center justify-between py-1 border-b border-stone-200/60 text-xs">
                        <span className="font-semibold text-stone-800">{t.title}</span>
                        <button
                          onClick={() => {
                            setResettingUser({ id: t.userId, name: t.title });
                            setAdminNewPassword('guru123');
                          }}
                          className="px-2.5 py-1 bg-white border border-stone-300 rounded hover:bg-stone-100 text-[11px] font-semibold"
                        >
                          Reset Sandi
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900">Akun Administrator Sistem</h4>
                  <div className="flex items-center justify-between py-1 text-xs">
                    <span className="font-semibold text-stone-800">Admin Utama (admin)</span>
                    <button
                      onClick={() => {
                        setResettingUser({ id: 'user_admin_1', name: 'Administrator' });
                        setAdminNewPassword('admin123');
                      }}
                      className="px-2.5 py-1 bg-white border border-stone-300 rounded hover:bg-stone-100 text-[11px] font-semibold"
                    >
                      Reset Sandi Admin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 16. Profil Lembaga */}
          {activeMenu === 'profil-lembaga' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Pengaturan Profil Lembaga & Kontak</h2>
                <p className="text-xs text-stone-500">
                  Data resmi lembaga yang ditampilkan di profil publik, kuitansi, dan footer.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  storageService.updateSiteSettings(settings, currentUser?.fullName || 'Admin');
                  showToast('success', 'Profil lembaga berhasil disimpan.');
                }}
                className="space-y-4 text-xs max-w-2xl"
              >
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Nama Lembaga</label>
                  <input
                    type="text"
                    required
                    value={settings.institutionName}
                    onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Nama Kepala Lembaga</label>
                  <input
                    type="text"
                    required
                    value={settings.headmasterName}
                    onChange={(e) => setSettings({ ...settings, headmasterName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Alamat Lengkap</label>
                  <textarea
                    rows={2}
                    required
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Nomor Telepon</label>
                    <input
                      type="text"
                      required
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Email Resmi</label>
                    <input
                      type="email"
                      required
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Sejarah Singkat Lembaga</label>
                  <textarea
                    rows={4}
                    value={settings.history}
                    onChange={(e) => setSettings({ ...settings, history: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition"
                >
                  Simpan Perubahan Profil
                </button>
              </form>
            </div>
          )}

          {/* 17. Pengaturan Website */}
          {activeMenu === 'pengaturan-web' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Pengaturan Tampilan & Visi Misi Website</h2>
                <p className="text-xs text-stone-500">
                  Konfigurasi banner, visi misi, dan rekening pembayaran santri.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  storageService.updateSiteSettings(settings, currentUser?.fullName || 'Admin');
                  showToast('success', 'Pengaturan website berhasil diperbarui.');
                }}
                className="space-y-4 text-xs max-w-2xl"
              >
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Teks Utama Banner Beranda</label>
                  <input
                    type="text"
                    value={settings.heroHeadline}
                    onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Teks Visi Lembaga</label>
                  <textarea
                    rows={3}
                    value={settings.vision}
                    onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition"
                >
                  Simpan Pengaturan Website
                </button>
              </form>
            </div>
          )}

          {/* 18. Pesan Masuk */}
          {activeMenu === 'pesan' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Pesan Masuk dari Masyarakat</h2>
                <p className="text-xs text-stone-500">
                  Pertanyaan dan aspirasi yang dikirimkan melalui formulir kontak publik.
                </p>
              </div>

              <div className="space-y-4">
                {contactMessages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900">{msg.senderName}</span>
                        <span className="text-stone-500 font-mono ml-2">({msg.senderPhone})</span>
                      </div>
                      <span className="text-stone-400">{msg.sentAt.split('T')[0]}</span>
                    </div>
                    <h4 className="font-semibold text-emerald-950 text-xs">{msg.subject}</h4>
                    <p className="text-xs text-stone-700 leading-relaxed italic">"{msg.message}"</p>
                    <div className="pt-2 flex justify-end">
                      <a
                        href={`https://wa.me/${msg.senderPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold"
                      >
                        Balas via WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 19. Log Aktivitas */}
          {activeMenu === 'log' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Log Audit & Aktivitas Sistem</h2>
                <p className="text-xs text-stone-500">
                  Rekam jejak setiap aksi penting (login, verifikasi pembayaran, absensi, pengubahan data).
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                    <tr>
                      <th className="py-2.5 px-3">Waktu</th>
                      <th className="py-2.5 px-3">Pengguna</th>
                      <th className="py-2.5 px-3">Aksi</th>
                      <th className="py-2.5 px-3">Detail Aktivitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {activityLogs.slice(0, 50).map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50">
                        <td className="py-2 px-3 font-mono text-stone-500">{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                        <td className="py-2 px-3 font-bold text-stone-900">{log.userName}</td>
                        <td className="py-2 px-3 font-mono text-[11px] font-semibold text-emerald-800">{log.action}</td>
                        <td className="py-2 px-3 text-stone-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 20. Pengaturan Keamanan & Backup */}
          {activeMenu === 'keamanan' && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold text-stone-900">Pengaturan Keamanan & Backup Database</h2>
                <p className="text-xs text-stone-500">
                  Unduh cadangan data lengkap lembaga atau pulihkan database dari file JSON.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-800" />
                    <span>Cadangkan Database (Backup JSON)</span>
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Unduh seluruh data lembaga (guru, santri, kelas, tagihan, kuitansi, absensi, berita) dalam 1 file JSON aman.
                  </p>
                  <button
                    onClick={exportBackupJSON}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs"
                  >
                    Unduh File Cadangan JSON
                  </button>
                </div>

                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-800" />
                    <span>Pulihkan Database (Restore JSON)</span>
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Unggah file cadangan JSON untuk memulihkan seluruh data lembaga ke kondisi sebelumnya.
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-lg text-xs"
                  >
                    Pilih File Cadangan untuk Dipulihkan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Payment Report Modal */}
      {rejectReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Tolak Laporan Pembayaran</h3>
            <p className="text-xs text-stone-500">
              Berikan alasan penolakan yang jelas agar orang tua santri dapat melakukan perbaikan bukti transfer.
            </p>
            <form onSubmit={handleRejectReport} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Alasan Penolakan *</label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Misal: Bukti transfer tidak mencantumkan nominal yang jelas atau rekening tujuan salah."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectReport(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receive Direct Cash Modal */}
      {cashBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Penerimaan Pembayaran Tunai</h3>
            <p className="text-xs text-stone-500">
              Catat pembayaran tunai langsung di kantor madrasah untuk Invoice {cashBill.billNumber}.
            </p>
            <form onSubmit={handleRecordCash} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Nominal Diterima (Rp) *</label>
                <input
                  type="number"
                  required
                  value={cashAmount}
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none font-mono font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCashBill(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  Terbitkan Kuitansi Sah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert PPDB Modal */}
      {convertingApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Konversi Pendaftar ke Santri Aktif</h3>
            <p className="text-xs text-stone-500">
              Pendaftar <strong>{convertingApplicant.fullName}</strong> akan dimasukkan ke database santri resmi dan akun portal orang tua akan dibuat/dihubungkan secara otomatis.
            </p>
            <form onSubmit={handleConvertPPDB} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Pilih Rombongan Belajar (Kelas) *</label>
                <select
                  value={assignClassForApplicant}
                  onChange={(e) => setAssignClassForApplicant(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white font-semibold"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConvertingApplicant(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  Konfirmasi Konversi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Reset Sandi: {resettingUser.name}</h3>
            <p className="text-xs text-stone-500">
              Masukkan kata sandi baru untuk pengguna ini. Pengguna akan diminta memperbaruinya saat masuk.
            </p>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Kata Sandi Baru</label>
                <input
                  type="text"
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none font-mono font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const res = storageService.resetUserPasswordByAdmin(resettingUser.id, adminNewPassword, currentUser?.fullName || 'Admin');
                    showToast('success', res.message);
                    setResettingUser(null);
                  }}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  Simpan Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-bold text-base text-stone-900">
              {editingTeacher.id && teachers.some(t => t.id === editingTeacher.id) ? 'Edit Data Guru' : 'Tambah Guru Baru'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                storageService.saveTeacher(editingTeacher as TeacherProfile, currentUser?.fullName || 'Admin');
                showToast('success', `Data guru ${editingTeacher.title} berhasil disimpan.`);
                setEditingTeacher(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.title || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, title: e.target.value, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Jabatan & Penugasan *</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.roleTitle || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, roleTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Kelas yang Diampu</label>
                <select
                  value={editingTeacher.assignedClassId || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, assignedClassId: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white font-medium"
                >
                  <option value="">-- Tidak Menjadi Wali Kelas --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Pendidikan</label>
                  <input
                    type="text"
                    value={editingTeacher.education || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, education: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Nomor Telepon *</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.phone || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Biografi Singkat</label>
                <textarea
                  rows={2}
                  value={editingTeacher.bio || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-stone-700 block">Pilihan Ikon Kartun Karakter</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CARTOON_AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.url}
                      type="button"
                      onClick={() => setEditingTeacher({ ...editingTeacher, photoUrl: opt.url })}
                      className={`p-2 rounded-xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                        (editingTeacher.photoUrl === opt.url)
                          ? 'border-emerald-700 bg-emerald-50 ring-2 ring-emerald-600'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <img src={opt.url} alt={opt.label} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <span className="text-[11px] font-medium text-stone-800 line-clamp-2 leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-bold text-base text-stone-900">
              {editingStudent.id && students.some(s => s.id === editingStudent.id) ? 'Edit Data Santri' : 'Tambah Santri Baru'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                storageService.saveStudent(editingStudent as Student, currentUser?.fullName || 'Admin');
                showToast('success', `Data santri ${editingStudent.fullName} berhasil disimpan.`);
                setEditingStudent(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">NIS (Nomor Induk Santri) *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.nis || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, nis: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Rombel / Kelas *</label>
                  <select
                    value={editingStudent.classId || 'class_1'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, classId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white font-medium"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Nama Lengkap Santri *</label>
                <input
                  type="text"
                  required
                  value={editingStudent.fullName || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Jenis Kelamin</label>
                  <select
                    value={editingStudent.gender || 'L'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white"
                  >
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Wali Santri</label>
                  <select
                    value={editingStudent.parentId || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white"
                  >
                    {parents.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Alamat</label>
                <input
                  type="text"
                  value={editingStudent.address || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  Simpan Santri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit News Modal */}
      {editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-bold text-base text-stone-900">
              {editingNews.id && news.some(n => n.id === editingNews.id) ? 'Edit Berita' : 'Tulis Berita Baru'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                storageService.saveNews(editingNews as NewsItem, currentUser?.fullName || 'Admin');
                showToast('success', 'Berita berhasil disimpan.');
                setEditingNews(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Judul Berita *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Kategori</label>
                  <select
                    value={editingNews.category || 'Kegiatan'}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Tanggal Terbit</label>
                  <input
                    type="date"
                    value={editingNews.publishedAt || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, publishedAt: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Ringkasan (Lead)</label>
                <textarea
                  rows={2}
                  required
                  value={editingNews.summary || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Konten Berita Lengkap</label>
                <textarea
                  rows={5}
                  required
                  value={editingNews.content || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none leading-relaxed"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  Terbitkan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Viewer Modal */}
      <ReceiptModal receipt={viewingReceipt} onClose={() => setViewingReceipt(null)} />
    </div>
  );
};
