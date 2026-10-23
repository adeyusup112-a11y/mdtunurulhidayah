import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { storageService } from '../../../services/storageService';
import {
  Student,
  ClassItem,
  TeacherProfile,
  AttendanceRecord,
  AcademicNote,
  ScheduleItem,
  StudentBill,
  PaymentReport,
  PaymentReceipt,
  AnnouncementItem,
  DigitalReportCard
} from '../../../types';
import { ReceiptModal } from '../../../components/receipt/ReceiptModal';
import { DigitalReportCardView } from '../../../components/raport/DigitalReportCardView';
import {
  User,
  BookOpen,
  CalendarCheck,
  CreditCard,
  FileCheck,
  Upload,
  Printer,
  KeyRound,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  Eye,
  ArrowRight,
  Award
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { currentUser, parentProfile, selectedChildId, setSelectedChildId, changePassword } = useAuth();

  const [activeMenu, setActiveMenu] = useState<'ringkasan' | 'tagihan' | 'absensi' | 'nilai' | 'raport' | 'jadwal' | 'pengumuman' | 'profil'>('ringkasan');
  const [reportCard, setReportCard] = useState<DigitalReportCard | null>(null);

  // Children list
  const [children, setChildren] = useState<Student[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [studentClass, setStudentClass] = useState<ClassItem | null>(null);
  const [waliKelas, setWaliKelas] = useState<TeacherProfile | null>(null);

  // Data for active child
  const [bills, setBills] = useState<StudentBill[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [grades, setGrades] = useState<AcademicNote[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);

  // Payment upload state
  const [selectedBillForPay, setSelectedBillForPay] = useState<StudentBill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Transfer Bank' | 'Tunai'>('Transfer Bank');
  const [bankName, setBankName] = useState('DANA - 081324168105 (Azmi M Nurjamil)');
  const [senderAccountName, setSenderAccountName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [proofNote, setProofNote] = useState('');

  // Receipt modal state
  const [viewingReceipt, setViewingReceipt] = useState<PaymentReceipt | null>(null);

  // Success / Error alerts
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const loadData = () => {
    if (!parentProfile) return;

    // Load parent's linked students only (strictly restricted)
    const allStudents = storageService.getStudents();
    const myChildren = allStudents.filter(s => parentProfile.studentIds.includes(s.id));
    setChildren(myChildren);

    const currentChildId = selectedChildId || (myChildren.length > 0 ? myChildren[0].id : null);
    const child = myChildren.find(c => c.id === currentChildId) || myChildren[0] || null;
    setActiveStudent(child);

    if (child) {
      const cls = storageService.getClassById(child.classId);
      setStudentClass(cls || null);

      if (cls) {
        const teacher = storageService.getTeacherById(cls.teacherId);
        setWaliKelas(teacher || null);
        const sch = storageService.getSchedules(cls.id);
        setSchedules(sch);
        const anc = storageService.getAnnouncements('OrangTua', cls.id);
        setAnnouncements(anc);
      }

      const stBills = storageService.getBills({ studentId: child.id });
      setBills(stBills);

      const stAtt = storageService.getStudentAttendance(child.id);
      setAttendance(stAtt);

      const stGrades = storageService.getAcademicNotes(child.id);
      setGrades(stGrades);

      const stReceipts = storageService.getReceiptsByStudentId(child.id);
      setReceipts(stReceipts);

      const stReport = storageService.getReportCardByStudentId(child.id);
      setReportCard(stReport || null);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = storageService.subscribe(() => loadData());
    return unsub;
  }, [parentProfile, selectedChildId]);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillForPay || !activeStudent || !parentProfile) return;
    setErrorMsg('');

    const res = storageService.submitPaymentReport({
      billId: selectedBillForPay.id,
      studentId: activeStudent.id,
      parentId: parentProfile.id,
      reportedAmount: selectedBillForPay.remainingAmount,
      paymentMethod,
      bankName: paymentMethod === 'Transfer Bank' ? bankName : undefined,
      senderAccountName: paymentMethod === 'Transfer Bank' ? senderAccountName : undefined,
      referenceNumber: paymentMethod === 'Transfer Bank' ? referenceNumber : undefined,
      notes: proofNote,
      parentName: parentProfile.fullName
    });

    if (res.success) {
      setSuccessMsg(res.message);
      setSelectedBillForPay(null);
      setSenderAccountName('');
      setReferenceNumber('');
      setProofNote('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Kata sandi baru dan konfirmasi tidak cocok.');
      return;
    }

    const res = changePassword(oldPassword, newPassword);
    if (res.success) {
      setSuccessMsg(res.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMsg(res.message);
    }
  };

  // Compute attendance summary
  const hadirCount = attendance.filter(a => a.status === 'Hadir').length;
  const sakitCount = attendance.filter(a => a.status === 'Sakit').length;
  const izinCount = attendance.filter(a => a.status === 'Izin').length;
  const alpaCount = attendance.filter(a => a.status === 'Alpa').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Parent Header Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-emerald-900">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-400/20 px-2.5 py-0.5 rounded">
            Portal Orang Tua / Wali Santri
          </span>
          <h1 className="text-xl sm:text-2xl font-bold">{parentProfile?.fullName}</h1>
          <p className="text-xs text-emerald-200">
            Wali Santri dari <strong className="text-white">{activeStudent?.fullName}</strong> ({studentClass?.name})
          </p>
        </div>

        {/* Multi-child switcher if parent has multiple children */}
        {children.length > 1 && (
          <div className="bg-emerald-900/80 p-2 rounded-xl border border-emerald-800 text-xs">
            <label className="text-[10px] text-stone-300 block mb-1">Pilih Ananda:</label>
            <div className="flex gap-2">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    activeStudent?.id === child.id
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'bg-emerald-950 text-white hover:bg-emerald-800'
                  }`}
                >
                  {child.fullName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveMenu('ringkasan')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeMenu === 'ringkasan' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Ringkasan Ananda
        </button>
        <button
          onClick={() => setActiveMenu('tagihan')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeMenu === 'tagihan' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Tagihan & Pembayaran SPP
        </button>
        <button
          onClick={() => setActiveMenu('absensi')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeMenu === 'absensi' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Kehadiran Santri
        </button>
        <button
          onClick={() => setActiveMenu('nilai')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeMenu === 'nilai' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Nilai & Hafalan Qur'an
        </button>
        <button
          onClick={() => setActiveMenu('raport')}
          className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeMenu === 'raport' ? 'bg-emerald-900 text-white shadow-xs' : 'text-stone-700 bg-emerald-50/70 hover:bg-emerald-100/70 hover:text-emerald-950'
          }`}
        >
          <Award className={`w-3.5 h-3.5 ${activeMenu === 'raport' ? 'text-amber-400' : 'text-emerald-700'}`} />
          <span>Raport Digital</span>
        </button>
        <button
          onClick={() => setActiveMenu('jadwal')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeMenu === 'jadwal' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Jadwal Pelajaran
        </button>
        <button
          onClick={() => setActiveMenu('pengumuman')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeMenu === 'pengumuman' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Pengumuman
        </button>
        <button
          onClick={() => setActiveMenu('profil')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
            activeMenu === 'profil' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Pengaturan Sandi
        </button>
      </div>

      {/* Menu 1: Ringkasan Ananda */}
      {activeMenu === 'ringkasan' && activeStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Student Profile Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="text-center space-y-2 border-b border-stone-100 pb-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-2xl mx-auto border-2 border-emerald-700">
                {activeStudent.fullName.charAt(0)}
              </div>
              <h2 className="font-bold text-base text-stone-900">{activeStudent.fullName}</h2>
              <p className="text-xs font-mono text-emerald-800 font-semibold">NIS: {activeStudent.nis}</p>
              <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-900 text-[11px] font-semibold rounded-full border border-emerald-200">
                Status: {activeStudent.status}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">Kelas</span>
                <span className="font-semibold text-stone-800">{studentClass?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">Wali Kelas</span>
                <span className="font-semibold text-stone-800">{waliKelas?.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">Ruang Belajar</span>
                <span className="font-semibold text-stone-800">{studentClass?.roomName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">Tgl Lahir</span>
                <span className="font-semibold text-stone-800">{activeStudent.birthPlace}, {activeStudent.birthDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Alamat</span>
                <span className="font-semibold text-stone-800 text-right truncate max-w-xs">{activeStudent.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-center space-y-1">
                <span className="text-stone-400 text-[11px] block font-medium">Hadir</span>
                <span className="text-2xl font-bold font-mono text-emerald-700">{hadirCount}</span>
                <span className="text-[10px] text-stone-500 block">Pertemuan</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-center space-y-1">
                <span className="text-stone-400 text-[11px] block font-medium">Sakit</span>
                <span className="text-2xl font-bold font-mono text-blue-600">{sakitCount}</span>
                <span className="text-[10px] text-stone-500 block">Surat Izin</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-center space-y-1">
                <span className="text-stone-400 text-[11px] block font-medium">Izin</span>
                <span className="text-2xl font-bold font-mono text-amber-600">{izinCount}</span>
                <span className="text-[10px] text-stone-500 block">Keperluan</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-center space-y-1">
                <span className="text-stone-400 text-[11px] block font-medium">Alpa</span>
                <span className="text-2xl font-bold font-mono text-stone-400">{alpaCount}</span>
                <span className="text-[10px] text-stone-500 block">Tanpa Ket.</span>
              </div>
            </div>

            {/* Latest Announcement for class */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-800" />
                <span>Pengumuman Terbaru dari Wali Kelas</span>
              </h3>
              {announcements.length > 0 ? (
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-emerald-950 font-bold">
                    <span>{announcements[0].title}</span>
                    <span className="text-stone-500 font-normal">{announcements[0].publishedAt}</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">{announcements[0].content}</p>
                </div>
              ) : (
                <p className="text-xs text-stone-400">Tidak ada pengumuman baru untuk kelas ini.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menu 2: Tagihan & Pembayaran Bulanan (SPP) */}
      {activeMenu === 'tagihan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-800" />
                  <span>Daftar Tagihan SPP Bulanan ({activeStudent?.fullName})</span>
                </h2>
                <p className="text-xs text-stone-500">
                  Pembayaran kontribusi madrasah secara transparan. Unduh kuitansi resmi setelah pembayaran disetujui.
                </p>
              </div>

              {/* Total arrears indicator */}
              <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-xs">
                <span className="text-stone-500 block text-[10px]">Total Tunggakan:</span>
                <span className="font-bold font-mono text-sm text-amber-900">
                  Rp {bills.reduce((sum, b) => sum + b.remainingAmount, 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">No. Invoice</th>
                    <th className="py-2.5 px-3 font-semibold">Periode Tagihan</th>
                    <th className="py-2.5 px-3 font-semibold">Jatuh Tempo</th>
                    <th className="py-2.5 px-3 font-semibold">Nominal</th>
                    <th className="py-2.5 px-3 font-semibold">Sisa Tagihan</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bills.map((bill) => {
                    const receipt = receipts.find(r => r.billId === bill.id);
                    return (
                      <tr key={bill.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3 font-mono font-semibold text-stone-700">{bill.billNumber}</td>
                        <td className="py-3 px-3 font-bold text-stone-900">
                          {bill.paymentTypeName} — {bill.billingMonth}
                        </td>
                        <td className="py-3 px-3 text-stone-500 font-mono">{bill.dueDate}</td>
                        <td className="py-3 px-3 font-mono">Rp {bill.amount.toLocaleString('id-ID')}</td>
                        <td className="py-3 px-3 font-mono font-bold text-stone-900">
                          Rp {bill.remainingAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                              bill.status === 'Lunas'
                                ? 'bg-emerald-100 text-emerald-800'
                                : bill.status === 'Menunggu Verifikasi'
                                ? 'bg-blue-100 text-blue-800'
                                : bill.status === 'Ditolak'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {bill.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {bill.status === 'Lunas' && receipt ? (
                            <button
                              onClick={() => setViewingReceipt(receipt)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded font-semibold text-[11px] cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Lihat Kuitansi</span>
                            </button>
                          ) : bill.status === 'Menunggu Verifikasi' ? (
                            <span className="text-[11px] text-blue-700 font-semibold italic">
                              Sedang Diverifikasi
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedBillForPay(bill)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded text-[11px] cursor-pointer shadow-2xs"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Konfirmasi Bayar</span>
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

          {/* Form Dialog Upload Pembayaran */}
          {selectedBillForPay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="relative max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="font-bold text-stone-900 text-base">
                    Lapor Pembayaran: {selectedBillForPay.paymentTypeName} ({selectedBillForPay.billingMonth})
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Nominal Tagihan: Rp {selectedBillForPay.remainingAmount.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-2">
                  <span className="font-bold block text-emerald-900">Rekening Resmi Pembayaran MDTU Nurul Hidayah:</span>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 p-2 bg-white rounded-lg border border-emerald-100">
                    <div>
                      <span className="font-semibold text-stone-900 block">DANA: <strong className="font-mono text-emerald-800">081324168105</strong></span>
                      <span className="text-[11px] text-stone-500">a.n. Azmi M Nurjamil</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('081324168105');
                        setSuccessMsg('Nomor DANA (081324168105) berhasil disalin ke papan klip.');
                        setTimeout(() => setSuccessMsg(''), 3000);
                      }}
                      className="text-[11px] px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold rounded cursor-pointer"
                    >
                      Salin No. DANA
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 p-2 bg-white rounded-lg border border-emerald-100">
                    <div>
                      <span className="font-semibold text-stone-900 block">Bank BRI: <strong className="font-mono text-emerald-800">4056 0101 3846 503</strong></span>
                      <span className="text-[11px] text-stone-500">a.n. MDTU Nurul Hidayah</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('405601013846503');
                        setSuccessMsg('Nomor Rekening BRI (4056 0101 3846 503) berhasil disalin ke papan klip.');
                        setTimeout(() => setSuccessMsg(''), 3000);
                      }}
                      className="text-[11px] px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold rounded cursor-pointer"
                    >
                      Salin No. Rek BRI
                    </button>
                  </div>
                </div>

                <form onSubmit={handlePaySubmit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Metode Pembayaran</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as 'Transfer Bank' | 'Tunai')}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white font-medium"
                    >
                      <option value="Transfer Bank">Transfer / E-Wallet (DANA & BRI)</option>
                      <option value="Tunai">Tunai di Kantor Madrasah</option>
                    </select>
                  </div>

                  {paymentMethod === 'Transfer Bank' && (
                    <>
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-700">Pilihan Rekening Tujuan</label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none bg-white font-medium"
                        >
                          <option value="DANA - 081324168105 (Azmi M Nurjamil)">DANA - 081324168105 (a.n. Azmi M Nurjamil)</option>
                          <option value="Bank BRI - 4056 0101 3846 503">Bank BRI - 4056 0101 3846 503 (a.n. MDTU Nurul Hidayah)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-stone-700">Nama Pengirim (Rekening)</label>
                          <input
                            type="text"
                            required
                            placeholder="Nama di rekening pengirim"
                            value={senderAccountName}
                            onChange={(e) => setSenderAccountName(e.target.value)}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-stone-700">No. Referensi / Transaksi</label>
                          <input
                            type="text"
                            placeholder="Nomor referensi struk"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-stone-700">Upload Bukti Transfer</label>
                        <input
                          type="file"
                          className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 cursor-pointer"
                        />
                        <p className="text-[10px] text-stone-400">Simulasi berkas bukti pembayaran.</p>
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Catatan Tambahan (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Misal: Sudah transfer via BRIMO hari ini"
                      value={proofNote}
                      onChange={(e) => setProofNote(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setSelectedBillForPay(null)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                    >
                      Kirim Laporan Pembayaran
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Menu 3: Kehadiran Santri */}
      {activeMenu === 'absensi' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-800" />
              <span>Riwayat Absensi Santri ({activeStudent?.fullName})</span>
            </h2>
            <p className="text-xs text-stone-500">
              Catatan rekap kehadiran santri yang diisi oleh wali kelas setiap pertemuan sore.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-y border-stone-200 text-stone-700">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Tanggal</th>
                  <th className="py-2.5 px-3 font-semibold">Status Kehadiran</th>
                  <th className="py-2.5 px-3 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-mono font-semibold text-stone-700">{rec.date}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          rec.status === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'Sakit'
                            ? 'bg-blue-100 text-blue-800'
                            : rec.status === 'Izin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{rec.notes || '-'}</td>
                  </tr>
                ))}
                {attendance.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-stone-400">
                      Belum ada data absensi tercatat untuk santri ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Menu 4: Nilai & Hafalan */}
      {activeMenu === 'nilai' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-800" />
              <span>Capaian Akademik & Mutaba'ah Hafalan ({activeStudent?.fullName})</span>
            </h2>
            <p className="text-xs text-stone-500">
              Evaluasi berkala penguasaan materi keagamaan dan capaian juz Al-Qur'an santri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grades.map((g) => (
              <div key={g.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900">{g.subject}</h4>
                  <span className="font-mono font-bold text-base text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded">
                    {g.score}
                  </span>
                </div>
                {g.memorizationProgress && (
                  <div className="text-xs text-stone-700 bg-white p-2.5 rounded border border-stone-200">
                    <span className="font-semibold text-stone-900 block text-[11px]">Progres Hafalan:</span>
                    {g.memorizationProgress}
                  </div>
                )}
                {g.behaviorNote && (
                  <p className="text-[11px] text-stone-500 italic">"{g.behaviorNote}"</p>
                )}
              </div>
            ))}
            {grades.length === 0 && (
              <p className="text-xs text-stone-400 py-6 text-center col-span-2">
                Belum ada catatan nilai yang dimasukkan oleh wali kelas.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Menu: Raport Digital */}
      {activeMenu === 'raport' && activeStudent && (
        <div className="space-y-6">
          {reportCard ? (
            <DigitalReportCardView
              report={reportCard}
              student={activeStudent}
              classItem={studentClass || undefined}
            />
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
              <Award className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-800 text-base">Raport Digital Sedang Disiapkan</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Raport digital untuk ananda <span className="font-bold text-stone-800">{activeStudent.fullName}</span> sedang dalam proses penginputan nilai dan pengesahan oleh Wali Kelas ({waliKelas?.title || 'Wali Kelas'}) dan Kepala MDTU Nurul Hidayah.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Menu 5: Jadwal Pelajaran */}
      {activeMenu === 'jadwal' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-800" />
              <span>Jadwal Pelajaran Sore ({studentClass?.name})</span>
            </h2>
            <p className="text-xs text-stone-500">
              Jadwal kegiatan belajar mengajar ananda di madrasah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((sch) => (
              <div key={sch.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                    {sch.day}
                  </span>
                  <span className="font-mono text-stone-500">{sch.timeSlot}</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900">{sch.subject}</h4>
                <p className="text-[11px] text-stone-500">{studentClass?.roomName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu 6: Pengumuman */}
      {activeMenu === 'pengumuman' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg font-bold text-stone-900">Pengumuman untuk Orang Tua Santri</h2>
            <p className="text-xs text-stone-500">
              Informasi resmi dari pihak madrasah dan wali kelas.
            </p>
          </div>

          <div className="space-y-4">
            {announcements.map((anc) => (
              <div key={anc.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-semibold text-emerald-900">{anc.authorName}</span>
                  <span>{anc.publishedAt}</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900">{anc.title}</h4>
                <p className="text-xs text-stone-700 leading-relaxed">{anc.content}</p>
              </div>
            ))}
            {announcements.length === 0 && (
              <p className="text-xs text-stone-400 py-6 text-center">Belum ada pengumuman.</p>
            )}
          </div>
        </div>
      )}

      {/* Menu 7: Pengaturan Sandi Orang Tua */}
      {activeMenu === 'profil' && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-800" />
              <span>Ganti Kata Sandi Akun Wali Santri</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Perbarui kata sandi secara mandiri untuk menjaga privasi akses data ananda.
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

      {/* Official Receipt Modal */}
      <ReceiptModal receipt={viewingReceipt} onClose={() => setViewingReceipt(null)} />
    </div>
  );
};
