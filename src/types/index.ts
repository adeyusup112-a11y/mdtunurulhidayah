export type UserRole = 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  username: string; // e.g. 'ade_yusup', 'orangtua_01', 'admin'
  fullName: string;
  role: UserRole;
  passwordHash: string; // salted SHA-256
  isMustChangePassword?: boolean;
  isActive: boolean;
  phone?: string;
  email?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  nip?: string;
  fullName: string;
  title: string; // e.g. 'Ust. Ade Yusup, S.Pd.'
  roleTitle: string; // 'Kepala Lembaga sekaligus Wali Kelas 4', 'Wali Kelas 1', etc.
  assignedClassId?: string; // e.g. 'class_4'
  education?: string;
  phone: string;
  photoUrl: string;
  bio: string;
  subjects: string[];
  permissions: {
    canManageAttendance: boolean;
    canManageGrades: boolean;
    canManageAnnouncements: boolean;
    canViewPaymentStatus: boolean;
  };
  isActive: boolean;
}

export interface ParentProfile {
  id: string;
  userId: string;
  fullName: string;
  relationship: 'Ayah' | 'Ibu' | 'Wali';
  phone: string;
  address: string;
  occupation?: string;
  studentIds: string[]; // Linked students
  isActive: boolean;
}

export interface Student {
  id: string;
  nis: string; // Nomor Induk Santri
  nisn?: string;
  fullName: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  classId: string;
  parentId: string; // ParentProfile id
  address: string;
  enrollmentYear: number;
  status: 'Aktif' | 'Lulus' | 'Pindah' | 'Nonaktif';
  photoUrl?: string;
  notes?: string;
}

export interface ClassItem {
  id: string;
  name: string; // e.g. 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4'
  academicYear: string; // '2025/2026'
  teacherId: string; // TeacherProfile id
  roomName: string;
  studentCount?: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
  notes?: string;
  recordedByTeacherId: string;
  updatedAt: string;
}

export interface AcademicNote {
  id: string;
  studentId: string;
  classId: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  subject: string; // e.g., 'Tahfidz Al-Qur\'an', 'Tajwid', 'Fiqih', 'Aqidah Akhlak', 'Bahasa Arab', 'Tarikh Islam'
  score: number; // 0 - 100
  memorizationProgress?: string; // e.g. 'Juz 30 (An-Naba - An-Nas)'
  behaviorNote?: string;
  recordedByTeacherId: string;
  updatedAt: string;
}

export interface ScheduleItem {
  id: string;
  classId: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  timeSlot: string; // e.g. '13:00 - 14:15'
  subject: string;
  teacherId: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: 'Kegiatan' | 'Prestasi' | 'Pendidikan' | 'Pengumuman';
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  isPublished: boolean;
  views: number;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  targetRole: 'Semua' | 'OrangTua' | 'Guru' | 'KelasTertentu';
  targetClassId?: string;
  authorName: string;
  publishedAt: string;
  isUrgent?: boolean;
}

export interface AdmissionApplicant {
  id: string;
  regNumber: string; // e.g. 'PPDB-2026-001'
  fullName: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  address: string;
  previousSchool: string;
  targetClassId: string;
  parentName: string;
  parentPhone: string;
  parentRelationship: string;
  status: 'Draf' | 'Diajukan' | 'Sedang Diverifikasi' | 'Perlu Perbaikan' | 'Diterima' | 'Ditolak';
  notes?: string;
  registeredAt: string;
  isConvertedToStudent?: boolean;
  convertedStudentId?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Kegiatan Belajar' | 'Ekstrakurikuler' | 'Peringatan Hari Besar' | 'Sarana & Prasarana';
  imageUrl: string;
  caption: string;
  date: string;
}

export interface PaymentType {
  id: string;
  name: string; // e.g. 'SPP Bulanan', 'Uang Kegiatan Tahunan', 'Seragam & Kitab'
  amount: number; // e.g. 35000 (standard madrasah diniyah contribution)
  frequency: 'Bulanan' | 'Tahunan' | 'Sekali';
  isActive: boolean;
}

export type PaymentStatus = 'Belum Bayar' | 'Sebagian Dibayar' | 'Menunggu Verifikasi' | 'Lunas' | 'Ditolak';

export interface StudentBill {
  id: string;
  billNumber: string; // e.g. 'INV-2026-05-001'
  studentId: string;
  paymentTypeId: string;
  paymentTypeName: string;
  billingMonth: string; // e.g. 'Mei 2026', 'April 2026'
  academicYear: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string; // YYYY-MM-DD
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentReport {
  id: string;
  billId: string;
  studentId: string;
  parentId: string;
  reportedAmount: number;
  paymentDate: string;
  paymentMethod: 'Transfer Bank' | 'Tunai';
  bankName?: string;
  senderAccountName?: string;
  referenceNumber?: string;
  proofImageUrl?: string;
  notes?: string;
  status: 'Menunggu Verifikasi' | 'Disetujui' | 'Ditolak';
  rejectionReason?: string;
  verifiedByUserId?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string; // e.g. 'KW-NH-2026-0042'
  billId: string;
  studentId: string;
  studentName: string;
  className: string;
  paymentTypeName: string;
  period: string;
  amountPaid: number;
  paymentMethod: string;
  issuedDate: string;
  issuedBy: string; // Name of verifier/treasurer
  verificationCode: string;
}

export interface PaymentAuditLog {
  id: string;
  billId: string;
  action: 'CREATE_BILL' | 'REPORT_PAYMENT' | 'VERIFY_PAYMENT' | 'REJECT_PAYMENT' | 'MANUAL_CASH_PAYMENT' | 'ADJUST_AMOUNT';
  actorName: string;
  actorRole: UserRole;
  details: string;
  previousStatus?: string;
  newStatus?: string;
  amount?: number;
  timestamp: string;
}

export interface SiteSettings {
  institutionName: string;
  headmasterName: string;
  headmasterTitle: string;
  headmasterGreeting: string;
  headmasterPhotoUrl: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  heroImageUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  vision: string;
  mission: string[];
  educationalGoals: string[];
  institutionalValues: string[];
  history: string;
  bankAccounts: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }[];
  ppdbActive: boolean;
  ppdbRequirements: string[];
  studyHours?: string; // 'Hari Senin - Minggu pukul 13.00 - 16.00 WIB (Jumat Libur)'
  monthlySppAmount?: number; // e.g. 25000 or 35000
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  subject: string;
  message: string;
  sentAt: string;
  isRead: boolean;
  replyNotes?: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  userName: string;
  userRole: UserRole | 'system' | 'public';
  action: string;
  details: string;
  timestamp: string;
}

export interface SubjectGrade {
  subject: string; // e.g. 'Al-Qur\'an & Tahsin', 'Tajwid & Tahfidz', 'Fiqih Ibadah', 'Aqidah & Akhlak', 'Bahasa Arab', 'Tarikh Islam', 'Praktik Shalat & Doa'
  kkm: number; // e.g. 75
  score: number; // 0 - 100
  gradeLetter: 'A' | 'B' | 'C' | 'D';
  predicate: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan';
  description: string;
}

export interface DigitalReportCard {
  id: string;
  studentId: string;
  classId: string;
  academicYear: string; // e.g. '2025/2026'
  semester: 'Ganjil' | 'Genap';
  issueDate: string; // e.g. '2026-06-20'
  place: string; // 'Rajadesa'
  
  // Mata Pelajaran Nilai
  grades: SubjectGrade[];

  // Tahfidz & Al-Qur'an
  tahfidzProgress: string; // e.g. 'Juz 30 (Surat An-Naba s.d An-Nas)'
  tahfidzScore: number;
  tahfidzPredicate: 'Mumtaz (Istimewa)' | 'Jayyid Jiddan (Sangat Baik)' | 'Jayyid (Baik)' | 'Maqbul (Cukup)';
  tajwidQuality: string; // e.g. 'Makharijul huruf fasih, dengung & ghunnah tepat'

  // Karakter & Akhlak
  characterValues: {
    adabDanAkhlak: 'A' | 'B' | 'C';
    kedisiplinan: 'A' | 'B' | 'C';
    kebersihanKerapian: 'A' | 'B' | 'C';
    keaktifanIbadah: 'A' | 'B' | 'C';
  };

  // Kehadiran Semester
  attendance: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  };

  // Catatan & Keputusan
  teacherNotes: string;
  promotionStatus: 'Naik ke Kelas Berikutnya' | 'Lulus dari MDTU Nurul Hidayah' | 'Tinggal di Kelas' | 'Belum Ditentukan';
  promotedToClass?: string;

  // Pejabat & Pengesahan
  headmasterName: string;
  headmasterTitle: string;
  waliKelasName: string;

  updatedAt: string;
  updatedBy: string;
}

export interface DatabaseState {
  settings: SiteSettings;
  users: User[];
  teachers: TeacherProfile[];
  parents: ParentProfile[];
  students: Student[];
  classes: ClassItem[];
  attendance: AttendanceRecord[];
  academicNotes: AcademicNote[];
  schedules: ScheduleItem[];
  news: NewsItem[];
  announcements: AnnouncementItem[];
  admissions: AdmissionApplicant[];
  gallery: GalleryItem[];
  paymentTypes: PaymentType[];
  bills: StudentBill[];
  paymentReports: PaymentReport[];
  receipts: PaymentReceipt[];
  paymentAuditLogs: PaymentAuditLog[];
  contactMessages: ContactMessage[];
  activityLogs: ActivityLog[];
  reportCards: DigitalReportCard[];
}
