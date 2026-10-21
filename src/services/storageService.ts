import {
  User,
  TeacherProfile,
  ParentProfile,
  Student,
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
  ActivityLog,
  UserRole
} from '../types';

import {
  INITIAL_SITE_SETTINGS,
  INITIAL_CLASSES,
  INITIAL_TEACHERS,
  INITIAL_PAYMENT_TYPES,
  INITIAL_SCHEDULES,
  INITIAL_NEWS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_GALLERY,
  INITIAL_ADMISSIONS,
  INITIAL_CONTACT_MESSAGES,
  INITIAL_ACTIVITY_LOGS,
  generateInitialUsersAndEntities,
  generateInitialBillsAndFinances,
  generateInitialAttendance,
  generateInitialGrades
} from '../data/initialData';

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
}

const STORAGE_KEY = 'mdtu_nurul_hidayah_db_v4';
const EVENT_NAME = 'mdtu_db_update';

const CARTOON_USTADZ_CLEAN = '/src/assets/images/cartoon_ustadz_clean_1792552709074.jpg';
const CARTOON_USTADZAH_CLEAN = '/src/assets/images/cartoon_ustadzah_clean_1792552725068.jpg';
const CARTOON_USTADZAH_SOFT = '/src/assets/images/cartoon_ustadzah_soft_1792552770682.jpg';
const CARTOON_USTADZ_YOUNG = '/src/assets/images/cartoon_ustadz_young_1792552747499.jpg';

// In-memory failed attempts tracker for brute force defense
const failedLoginAttempts: Record<string, { count: number; lockedUntil: number }> = {};

function initDefaultDatabase(): DatabaseState {
  const { users, parents, students } = generateInitialUsersAndEntities();
  const { bills, reports, receipts, auditLogs } = generateInitialBillsAndFinances(students, parents);
  const attendance = generateInitialAttendance(students);
  const academicNotes = generateInitialGrades(students);

  return {
    settings: INITIAL_SITE_SETTINGS,
    users,
    teachers: INITIAL_TEACHERS,
    parents,
    students,
    classes: INITIAL_CLASSES,
    attendance,
    academicNotes,
    schedules: INITIAL_SCHEDULES,
    news: INITIAL_NEWS,
    announcements: INITIAL_ANNOUNCEMENTS,
    admissions: INITIAL_ADMISSIONS,
    gallery: INITIAL_GALLERY,
    paymentTypes: INITIAL_PAYMENT_TYPES,
    bills,
    paymentReports: reports,
    receipts,
    paymentAuditLogs: auditLogs,
    contactMessages: INITIAL_CONTACT_MESSAGES,
    activityLogs: INITIAL_ACTIVITY_LOGS
  };
}

class StorageService {
  private cache: DatabaseState | null = null;

  private load(): DatabaseState {
    if (this.cache) return this.cache;

    try {
      // Check v4 or migrate from prior keys
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        raw = localStorage.getItem('mdtu_nurul_hidayah_db_v3') || localStorage.getItem('mdtu_nurul_hidayah_db_v2') || localStorage.getItem('mdtu_nurul_hidayah_db_v1');
      }

      if (raw) {
        const parsed = JSON.parse(raw) as DatabaseState;
        if (parsed) {
          this.cache = parsed;
          // Ensure all teacher photos are strictly replaced with clean cartoon avatars
          let mutated = false;
          if (!this.cache.settings?.headmasterPhotoUrl || !this.cache.settings.headmasterPhotoUrl.includes('cartoon_ustadz_clean')) {
            if (this.cache.settings) {
              this.cache.settings.headmasterPhotoUrl = CARTOON_USTADZ_CLEAN;
              mutated = true;
            }
          }

          this.cache.teachers?.forEach(t => {
            const lower = (t.title || t.fullName || '').toLowerCase();
            if (lower.includes('ade') || lower.includes('kepala')) {
              if (t.photoUrl !== CARTOON_USTADZ_CLEAN) {
                t.photoUrl = CARTOON_USTADZ_CLEAN;
                mutated = true;
              }
            } else if (lower.includes('siti') || lower.includes('saadah')) {
              if (t.photoUrl !== CARTOON_USTADZAH_CLEAN) {
                t.photoUrl = CARTOON_USTADZAH_CLEAN;
                mutated = true;
              }
            } else if (lower.includes('fitri') || lower.includes('hermawati')) {
              if (t.photoUrl !== CARTOON_USTADZAH_SOFT) {
                t.photoUrl = CARTOON_USTADZAH_SOFT;
                mutated = true;
              }
            } else if (lower.includes('azmi') || lower.includes('nurjamil')) {
              if (t.photoUrl !== CARTOON_USTADZ_YOUNG) {
                t.photoUrl = CARTOON_USTADZ_YOUNG;
                mutated = true;
              }
            } else {
              const isFem = lower.includes('usth') || lower.includes('ustadzah');
              t.photoUrl = isFem ? CARTOON_USTADZAH_CLEAN : CARTOON_USTADZ_CLEAN;
              mutated = true;
            }
          });

          if (mutated) {
            this.save(this.cache);
          }
          return this.cache;
        }
      }
    } catch (e) {
      console.error('Failed to parse database from localStorage:', e);
    }

    const initial = initDefaultDatabase();
    this.save(initial);
    return initial;
  }

  private save(state: DatabaseState) {
    this.cache = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (e) {
      console.error('Failed to persist to localStorage:', e);
    }
  }

  public subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }

  // --- LOG ACTIVITY ---
  public logActivity(userName: string, userRole: UserRole | 'system' | 'public', action: string, details: string) {
    const db = this.load();
    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userName,
      userRole,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    db.activityLogs.unshift(newLog);
    if (db.activityLogs.length > 300) db.activityLogs.pop();
    this.save(db);
  }

  // --- AUTHENTICATION & SECURITY ---
  public authenticate(identifier: string, passwordPlain: string, requiredRole: UserRole): { success: boolean; user?: User; message: string; teacher?: TeacherProfile; parent?: ParentProfile } {
    const db = this.load();
    const cleanId = identifier.trim().toLowerCase();

    // Check brute-force lockout
    const attemptRecord = failedLoginAttempts[cleanId];
    if (attemptRecord && attemptRecord.lockedUntil > Date.now()) {
      const waitSec = Math.ceil((attemptRecord.lockedUntil - Date.now()) / 1000);
      return {
        success: false,
        message: `Terlalu banyak percobaan gagal. Akun dikunci sementara. Silakan coba lagi dalam ${waitSec} detik.`
      };
    }

    // Locate user by username, phone, or linked profile
    const user = db.users.find(u => {
      if (!u.isActive) return false;
      if (u.role !== requiredRole) return false;
      if (u.username.toLowerCase() === cleanId) return true;
      if (u.phone && u.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')) return true;
      if (u.id.toLowerCase() === cleanId) return true;
      return false;
    });

    if (!user) {
      // Record failed attempt
      this.registerFailedAttempt(cleanId);
      return { success: false, message: 'Identitas akun atau kata sandi tidak valid.' };
    }

    // Check password
    if (user.passwordHash !== passwordPlain) {
      this.registerFailedAttempt(cleanId);
      return { success: false, message: 'Identitas akun atau kata sandi tidak valid.' };
    }

    // Reset failed attempts on success
    delete failedLoginAttempts[cleanId];

    // Update lastLoginAt
    user.lastLoginAt = new Date().toISOString();
    this.save(db);

    let teacher: TeacherProfile | undefined;
    let parent: ParentProfile | undefined;

    if (user.role === 'teacher') {
      teacher = db.teachers.find(t => t.userId === user.id);
    } else if (user.role === 'parent') {
      parent = db.parents.find(p => p.userId === user.id);
    }

    this.logActivity(user.fullName, user.role, 'LOGIN_SUCCESS', `Login berhasil ke portal ${requiredRole}`);

    return {
      success: true,
      user,
      teacher,
      parent,
      message: 'Login berhasil.'
    };
  }

  private registerFailedAttempt(identifier: string) {
    const now = Date.now();
    if (!failedLoginAttempts[identifier]) {
      failedLoginAttempts[identifier] = { count: 1, lockedUntil: 0 };
    } else {
      failedLoginAttempts[identifier].count += 1;
    }

    if (failedLoginAttempts[identifier].count >= 5) {
      failedLoginAttempts[identifier].lockedUntil = now + 30000; // 30s lockout
    }
  }

  public changePassword(userId: string, oldPasswordPlain: string, newPasswordPlain: string): { success: boolean; message: string } {
    const db = this.load();
    const user = db.users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'Pengguna tidak ditemukan.' };

    if (user.passwordHash !== oldPasswordPlain) {
      return { success: false, message: 'Kata sandi lama tidak sesuai.' };
    }

    if (newPasswordPlain.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
    }

    user.passwordHash = newPasswordPlain;
    user.isMustChangePassword = false;
    this.save(db);

    this.logActivity(user.fullName, user.role, 'PASSWORD_CHANGE', 'Pengguna mengganti kata sandi secara mandiri.');
    return { success: true, message: 'Kata sandi berhasil diperbarui.' };
  }

  public resetUserPasswordByAdmin(userId: string, newPasswordPlain: string, adminName: string): { success: boolean; message: string } {
    const db = this.load();
    const user = db.users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'Pengguna tidak ditemukan.' };

    user.passwordHash = newPasswordPlain;
    user.isMustChangePassword = true;
    this.save(db);

    this.logActivity(adminName, 'admin', 'ADMIN_RESET_PASSWORD', `Admin me-reset kata sandi untuk ${user.fullName} (${user.username}).`);
    return { success: true, message: `Kata sandi akun ${user.fullName} berhasil di-reset.` };
  }

  // --- SETTINGS ---
  public getSiteSettings(): SiteSettings {
    return this.load().settings;
  }

  public updateSiteSettings(settings: Partial<SiteSettings>, actorName = 'Admin'): SiteSettings {
    const db = this.load();
    db.settings = { ...db.settings, ...settings };
    this.save(db);
    this.logActivity(actorName, 'admin', 'UPDATE_SETTINGS', 'Pengaturan lembaga/website diperbarui.');
    return db.settings;
  }

  // --- TEACHERS ---
  public getTeachers(includeInactive = false): TeacherProfile[] {
    const db = this.load();
    return includeInactive ? db.teachers : db.teachers.filter(t => t.isActive);
  }

  public getTeacherById(id: string): TeacherProfile | undefined {
    return this.load().teachers.find(t => t.id === id);
  }

  public saveTeacher(teacher: TeacherProfile, actorName = 'Admin'): TeacherProfile {
    const db = this.load();
    const index = db.teachers.findIndex(t => t.id === teacher.id);
    if (index >= 0) {
      db.teachers[index] = { ...teacher };
      // Also sync user full name
      const user = db.users.find(u => u.id === teacher.userId);
      if (user) user.fullName = teacher.title;
      this.logActivity(actorName, 'admin', 'UPDATE_TEACHER', `Memperbarui data guru ${teacher.title}`);
    } else {
      db.teachers.push(teacher);
      this.logActivity(actorName, 'admin', 'ADD_TEACHER', `Menambahkan guru baru ${teacher.title}`);
    }
    this.save(db);
    return teacher;
  }

  public deleteTeacher(id: string, actorName = 'Admin'): boolean {
    const db = this.load();
    const teacher = db.teachers.find(t => t.id === id);
    if (!teacher) return false;

    // Soft delete / toggle active
    teacher.isActive = false;
    // Also deactivate linked user
    const user = db.users.find(u => u.id === teacher.userId);
    if (user) user.isActive = false;

    this.save(db);
    this.logActivity(actorName, 'admin', 'DEACTIVATE_TEACHER', `Menonaktifkan guru ${teacher.title}`);
    return true;
  }

  // --- CLASSES ---
  public getClasses(): ClassItem[] {
    return this.load().classes;
  }

  public getClassById(id: string): ClassItem | undefined {
    return this.load().classes.find(c => c.id === id);
  }

  public saveClass(classItem: ClassItem, actorName = 'Admin'): ClassItem {
    const db = this.load();
    const index = db.classes.findIndex(c => c.id === classItem.id);
    if (index >= 0) {
      db.classes[index] = { ...classItem };
      this.logActivity(actorName, 'admin', 'UPDATE_CLASS', `Memperbarui data kelas ${classItem.name}`);
    } else {
      db.classes.push(classItem);
      this.logActivity(actorName, 'admin', 'ADD_CLASS', `Menambahkan kelas baru ${classItem.name}`);
    }
    this.save(db);
    return classItem;
  }

  public reassignClassTeacher(classId: string, teacherId: string, actorName = 'Admin'): boolean {
    const db = this.load();
    const classItem = db.classes.find(c => c.id === classId);
    const teacher = db.teachers.find(t => t.id === teacherId);
    if (!classItem || !teacher) return false;

    classItem.teacherId = teacherId;
    teacher.assignedClassId = classId;
    this.save(db);

    this.logActivity(actorName, 'admin', 'REASSIGN_CLASS_TEACHER', `Mengubah wali kelas ${classItem.name} menjadi ${teacher.title}`);
    return true;
  }

  // --- STUDENTS ---
  public getStudents(classId?: string, status?: string): Student[] {
    const db = this.load();
    let list = db.students;
    if (classId) list = list.filter(s => s.classId === classId);
    if (status) list = list.filter(s => s.status === status);
    return list;
  }

  public getStudentById(id: string): Student | undefined {
    return this.load().students.find(s => s.id === id);
  }

  public saveStudent(student: Student, actorName = 'Admin'): Student {
    const db = this.load();
    const index = db.students.findIndex(s => s.id === student.id);
    if (index >= 0) {
      db.students[index] = { ...student };
      this.logActivity(actorName, 'admin', 'UPDATE_STUDENT', `Memperbarui data santri ${student.fullName} (${student.nis})`);
    } else {
      db.students.push(student);
      // Ensure parent's studentIds array contains this student
      const parent = db.parents.find(p => p.id === student.parentId);
      if (parent && !parent.studentIds.includes(student.id)) {
        parent.studentIds.push(student.id);
      }
      this.logActivity(actorName, 'admin', 'ADD_STUDENT', `Menambahkan santri baru ${student.fullName} (${student.nis})`);
    }
    this.save(db);
    return student;
  }

  public deleteStudent(id: string, actorName = 'Admin'): boolean {
    const db = this.load();
    const student = db.students.find(s => s.id === id);
    if (!student) return false;
    student.status = 'Nonaktif';
    this.save(db);
    this.logActivity(actorName, 'admin', 'DEACTIVATE_STUDENT', `Menonaktifkan data santri ${student.fullName}`);
    return true;
  }

  // --- PARENTS ---
  public getParents(): ParentProfile[] {
    return this.load().parents;
  }

  public getParentById(id: string): ParentProfile | undefined {
    return this.load().parents.find(p => p.id === id);
  }

  public getParentByUserId(userId: string): ParentProfile | undefined {
    return this.load().parents.find(p => p.userId === userId);
  }

  public saveParent(parent: ParentProfile, actorName = 'Admin'): ParentProfile {
    const db = this.load();
    const index = db.parents.findIndex(p => p.id === parent.id);
    if (index >= 0) {
      db.parents[index] = { ...parent };
      // Sync user
      const user = db.users.find(u => u.id === parent.userId);
      if (user) {
        user.fullName = parent.fullName;
        user.phone = parent.phone;
      }
      this.logActivity(actorName, 'admin', 'UPDATE_PARENT', `Memperbarui profil orang tua/wali ${parent.fullName}`);
    } else {
      db.parents.push(parent);
      this.logActivity(actorName, 'admin', 'ADD_PARENT', `Menambahkan profil orang tua/wali baru ${parent.fullName}`);
    }
    this.save(db);
    return parent;
  }

  // --- ATTENDANCE ---
  public getAttendance(classId?: string, date?: string): AttendanceRecord[] {
    const db = this.load();
    let records = db.attendance;
    if (classId) records = records.filter(r => r.classId === classId);
    if (date) records = records.filter(r => r.date === date);
    return records;
  }

  public getStudentAttendance(studentId: string): AttendanceRecord[] {
    return this.load().attendance.filter(r => r.studentId === studentId);
  }

  public saveAttendanceBatch(records: AttendanceRecord[], teacherName: string): void {
    const db = this.load();
    records.forEach(newRec => {
      const idx = db.attendance.findIndex(r => r.studentId === newRec.studentId && r.date === newRec.date);
      if (idx >= 0) {
        db.attendance[idx] = { ...newRec, updatedAt: new Date().toISOString() };
      } else {
        db.attendance.push({ ...newRec, updatedAt: new Date().toISOString() });
      }
    });
    this.save(db);
    this.logActivity(teacherName, 'teacher', 'RECORD_ATTENDANCE', `Menyimpan rekap absensi untuk ${records.length} santri`);
  }

  // --- ACADEMIC NOTES ---
  public getAcademicNotes(studentId?: string, classId?: string): AcademicNote[] {
    const db = this.load();
    let notes = db.academicNotes;
    if (studentId) notes = notes.filter(n => n.studentId === studentId);
    if (classId) notes = notes.filter(n => n.classId === classId);
    return notes;
  }

  public saveAcademicNote(note: AcademicNote, teacherName: string): AcademicNote {
    const db = this.load();
    const idx = db.academicNotes.findIndex(n => n.id === note.id);
    if (idx >= 0) {
      db.academicNotes[idx] = { ...note, updatedAt: new Date().toISOString() };
    } else {
      db.academicNotes.push({ ...note, updatedAt: new Date().toISOString() });
    }
    this.save(db);
    this.logActivity(teacherName, 'teacher', 'SAVE_ACADEMIC_NOTE', `Memperbarui nilai dan hafalan santri untuk mata pelajaran ${note.subject}`);
    return note;
  }

  // --- SCHEDULES ---
  public getSchedules(classId?: string): ScheduleItem[] {
    const db = this.load();
    return classId ? db.schedules.filter(s => s.classId === classId) : db.schedules;
  }

  public saveSchedule(item: ScheduleItem, actorName = 'Admin'): ScheduleItem {
    const db = this.load();
    const idx = db.schedules.findIndex(s => s.id === item.id);
    if (idx >= 0) {
      db.schedules[idx] = { ...item };
    } else {
      db.schedules.push(item);
    }
    this.save(db);
    this.logActivity(actorName, 'admin', 'SAVE_SCHEDULE', `Memperbarui jadwal pelajaran: ${item.subject} (${item.day})`);
    return item;
  }

  public deleteSchedule(id: string, actorName = 'Admin'): boolean {
    const db = this.load();
    db.schedules = db.schedules.filter(s => s.id !== id);
    this.save(db);
    this.logActivity(actorName, 'admin', 'DELETE_SCHEDULE', `Menghapus jadwal pelajaran`);
    return true;
  }

  // --- NEWS & ANNOUNCEMENTS ---
  public getNews(publishedOnly = false): NewsItem[] {
    const db = this.load();
    return publishedOnly ? db.news.filter(n => n.isPublished) : db.news;
  }

  public getNewsById(id: string): NewsItem | undefined {
    return this.load().news.find(n => n.id === id);
  }

  public saveNews(item: NewsItem, actorName = 'Admin'): NewsItem {
    const db = this.load();
    const idx = db.news.findIndex(n => n.id === item.id);
    if (idx >= 0) {
      db.news[idx] = { ...item };
      this.logActivity(actorName, 'admin', 'UPDATE_NEWS', `Memperbarui berita: "${item.title}"`);
    } else {
      db.news.unshift(item);
      this.logActivity(actorName, 'admin', 'ADD_NEWS', `Menerbitkan berita baru: "${item.title}"`);
    }
    this.save(db);
    return item;
  }

  public deleteNews(id: string, actorName = 'Admin'): boolean {
    const db = this.load();
    const news = db.news.find(n => n.id === id);
    db.news = db.news.filter(n => n.id !== id);
    this.save(db);
    this.logActivity(actorName, 'admin', 'DELETE_NEWS', `Menghapus berita: "${news?.title || id}"`);
    return true;
  }

  public getAnnouncements(targetRole?: string, classId?: string): AnnouncementItem[] {
    const db = this.load();
    return db.announcements.filter(a => {
      if (!targetRole) return true;
      if (a.targetRole === 'Semua') return true;
      if (targetRole === 'OrangTua' && (a.targetRole === 'OrangTua' || (a.targetRole === 'KelasTertentu' && a.targetClassId === classId))) return true;
      if (targetRole === 'Guru' && a.targetRole === 'Guru') return true;
      if (classId && a.targetRole === 'KelasTertentu' && a.targetClassId === classId) return true;
      return false;
    });
  }

  public saveAnnouncement(item: AnnouncementItem, actorName: string, role: UserRole): AnnouncementItem {
    const db = this.load();
    const idx = db.announcements.findIndex(a => a.id === item.id);
    if (idx >= 0) {
      db.announcements[idx] = { ...item };
      this.logActivity(actorName, role, 'UPDATE_ANNOUNCEMENT', `Memperbarui pengumuman: "${item.title}"`);
    } else {
      db.announcements.unshift(item);
      this.logActivity(actorName, role, 'ADD_ANNOUNCEMENT', `Membuat pengumuman baru: "${item.title}"`);
    }
    this.save(db);
    return item;
  }

  public deleteAnnouncement(id: string, actorName: string): boolean {
    const db = this.load();
    db.announcements = db.announcements.filter(a => a.id !== id);
    this.save(db);
    this.logActivity(actorName, 'admin', 'DELETE_ANNOUNCEMENT', `Menghapus pengumuman`);
    return true;
  }

  // --- ADMISSIONS (PPDB) ---
  public getAdmissions(): AdmissionApplicant[] {
    return this.load().admissions;
  }

  public getAdmissionByRegNumber(regNumber: string): AdmissionApplicant | undefined {
    return this.load().admissions.find(a => a.regNumber.toUpperCase() === regNumber.trim().toUpperCase());
  }

  public submitAdmission(data: Omit<AdmissionApplicant, 'id' | 'regNumber' | 'registeredAt' | 'isConvertedToStudent'>): AdmissionApplicant {
    const db = this.load();
    const nextNumber = db.admissions.length + 1;
    const regNumber = `PPDB-2026-${String(nextNumber).padStart(3, '0')}`;
    const newApplicant: AdmissionApplicant = {
      ...data,
      id: `adm_${Date.now()}`,
      regNumber,
      registeredAt: new Date().toISOString(),
      isConvertedToStudent: false
    };

    db.admissions.unshift(newApplicant);
    this.save(db);
    this.logActivity(data.parentName, 'public', 'PPDB_SUBMIT', `Pendaftaran santri baru masuk: ${data.fullName} (No. Reg: ${regNumber})`);
    return newApplicant;
  }

  public updateAdmissionStatus(id: string, status: AdmissionApplicant['status'], notes?: string, actorName = 'Admin'): boolean {
    const db = this.load();
    const applicant = db.admissions.find(a => a.id === id);
    if (!applicant) return false;

    applicant.status = status;
    if (notes !== undefined) applicant.notes = notes;
    this.save(db);

    this.logActivity(actorName, 'admin', 'PPDB_UPDATE_STATUS', `Status pendaftaran ${applicant.fullName} diubah menjadi "${status}"`);
    return true;
  }

  public convertApplicantToStudent(applicantId: string, assignedClassId: string, actorName = 'Admin'): { success: boolean; message: string; student?: Student } {
    const db = this.load();
    const applicant = db.admissions.find(a => a.id === applicantId);
    if (!applicant) return { success: false, message: 'Data pendaftar tidak ditemukan.' };
    if (applicant.status !== 'Diterima') return { success: false, message: 'Santri harus berstatus "Diterima" terlebih dahulu.' };
    if (applicant.isConvertedToStudent) return { success: false, message: 'Pendaftar ini telah dikonversi sebelumnya.' };

    const classItem = db.classes.find(c => c.id === assignedClassId);
    if (!classItem) return { success: false, message: 'Kelas tidak valid.' };

    // 1. Create or link parent
    let parent = db.parents.find(p => p.phone === applicant.parentPhone || p.fullName.toLowerCase() === applicant.parentName.toLowerCase());
    let parentUserId = '';
    let parentProfileId = '';

    if (!parent) {
      const nextParentNum = String(db.parents.length + 1).padStart(2, '0');
      parentUserId = `user_parent_${nextParentNum}`;
      parentProfileId = `parent_${nextParentNum}`;

      db.users.push({
        id: parentUserId,
        username: `orangtua_${nextParentNum}`,
        fullName: applicant.parentName,
        role: 'parent',
        passwordHash: 'wali123',
        isActive: true,
        phone: applicant.parentPhone,
        createdAt: new Date().toISOString()
      });

      parent = {
        id: parentProfileId,
        userId: parentUserId,
        fullName: applicant.parentName,
        relationship: applicant.parentRelationship as 'Ayah' | 'Ibu' | 'Wali',
        phone: applicant.parentPhone,
        address: applicant.address,
        studentIds: [],
        isActive: true
      };
      db.parents.push(parent);
    } else {
      parentProfileId = parent.id;
    }

    // 2. Create student
    const nextStudentNum = String(db.students.length + 1).padStart(2, '0');
    const studentId = `student_${nextStudentNum}`;
    const nis = `2026${assignedClassId.replace('class_', '0')}${String(db.students.filter(s => s.classId === assignedClassId).length + 1).padStart(3, '0')}`;

    const newStudent: Student = {
      id: studentId,
      nis,
      fullName: applicant.fullName,
      gender: applicant.gender,
      birthPlace: applicant.birthPlace,
      birthDate: applicant.birthDate,
      classId: assignedClassId,
      parentId: parentProfileId,
      address: applicant.address,
      enrollmentYear: 2026,
      status: 'Aktif',
      notes: `Diterima melalui jalur PPDB Online (${applicant.regNumber})`
    };

    db.students.push(newStudent);
    if (!parent.studentIds.includes(studentId)) {
      parent.studentIds.push(studentId);
    }

    applicant.isConvertedToStudent = true;
    applicant.convertedStudentId = studentId;

    this.save(db);
    this.logActivity(actorName, 'admin', 'PPDB_CONVERT_STUDENT', `Pendaftar ${applicant.fullName} (${applicant.regNumber}) berhasil dikonversi menjadi santri aktif dengan NIS: ${nis}`);

    return {
      success: true,
      message: `Santri ${newStudent.fullName} berhasil ditambahkan ke ${classItem.name} dengan NIS ${nis}.`,
      student: newStudent
    };
  }

  // --- GALLERY ---
  public getGallery(): GalleryItem[] {
    return this.load().gallery;
  }

  public saveGalleryItem(item: GalleryItem, actorName = 'Admin'): GalleryItem {
    const db = this.load();
    const idx = db.gallery.findIndex(g => g.id === item.id);
    if (idx >= 0) {
      db.gallery[idx] = { ...item };
    } else {
      db.gallery.unshift(item);
    }
    this.save(db);
    this.logActivity(actorName, 'admin', 'SAVE_GALLERY', `Memperbarui foto galeri: ${item.title}`);
    return item;
  }

  public deleteGalleryItem(id: string, actorName = 'Admin'): boolean {
    const db = this.load();
    db.gallery = db.gallery.filter(g => g.id !== id);
    this.save(db);
    this.logActivity(actorName, 'admin', 'DELETE_GALLERY', 'Menghapus foto galeri');
    return true;
  }

  // --- CONTACT MESSAGES ---
  public getContactMessages(): ContactMessage[] {
    return this.load().contactMessages;
  }

  public submitContactMessage(data: Omit<ContactMessage, 'id' | 'sentAt' | 'isRead'>): ContactMessage {
    const db = this.load();
    const newMsg: ContactMessage = {
      ...data,
      id: `msg_${Date.now()}`,
      sentAt: new Date().toISOString(),
      isRead: false
    };
    db.contactMessages.unshift(newMsg);
    this.save(db);
    this.logActivity(data.senderName, 'public', 'SUBMIT_CONTACT_MESSAGE', `Pesan masuk baru dari ${data.senderName} (${data.subject})`);
    return newMsg;
  }

  public markContactMessageRead(id: string, replyNotes?: string, actorName = 'Admin'): boolean {
    const db = this.load();
    const msg = db.contactMessages.find(m => m.id === id);
    if (!msg) return false;
    msg.isRead = true;
    if (replyNotes) msg.replyNotes = replyNotes;
    this.save(db);
    this.logActivity(actorName, 'admin', 'READ_CONTACT_MESSAGE', `Membaca pesan dari ${msg.senderName}`);
    return true;
  }

  // --- BILLS & FINANCES ---
  public getPaymentTypes(): PaymentType[] {
    return this.load().paymentTypes;
  }

  public savePaymentType(pt: PaymentType, actorName = 'Admin'): PaymentType {
    const db = this.load();
    const idx = db.paymentTypes.findIndex(p => p.id === pt.id);
    if (idx >= 0) {
      db.paymentTypes[idx] = { ...pt };
    } else {
      db.paymentTypes.push(pt);
    }
    this.save(db);
    this.logActivity(actorName, 'admin', 'SAVE_PAYMENT_TYPE', `Memperbarui jenis tagihan ${pt.name} (Rp ${pt.amount.toLocaleString('id-ID')})`);
    return pt;
  }

  public getBills(filter?: { studentId?: string; classId?: string; month?: string; status?: string }): StudentBill[] {
    const db = this.load();
    let result = db.bills;

    if (filter?.studentId) {
      result = result.filter(b => b.studentId === filter.studentId);
    }

    if (filter?.classId) {
      const studentIdsInClass = new Set(db.students.filter(s => s.classId === filter.classId).map(s => s.id));
      result = result.filter(b => studentIdsInClass.has(b.studentId));
    }

    if (filter?.month) {
      result = result.filter(b => b.billingMonth === filter.month);
    }

    if (filter?.status) {
      result = result.filter(b => b.status === filter.status);
    }

    return result;
  }

  public getBillById(id: string): StudentBill | undefined {
    return this.load().bills.find(b => b.id === id);
  }

  public getFinancialSummary() {
    const db = this.load();
    const totalBills = db.bills.reduce((sum, b) => sum + b.amount, 0);
    const verifiedIncome = db.bills.reduce((sum, b) => sum + b.paidAmount, 0);
    const pendingVerificationReports = db.paymentReports.filter(r => r.status === 'Menunggu Verifikasi');
    const pendingVerificationAmount = pendingVerificationReports.reduce((sum, r) => sum + r.reportedAmount, 0);
    const totalArrears = db.bills.reduce((sum, b) => sum + b.remainingAmount, 0);

    const paidBillsCount = db.bills.filter(b => b.status === 'Lunas').length;
    const unpaidBillsCount = db.bills.filter(b => b.status === 'Belum Bayar' || b.status === 'Ditolak').length;

    return {
      totalBills,
      verifiedIncome,
      pendingVerificationCount: pendingVerificationReports.length,
      pendingVerificationAmount,
      totalArrears,
      paidBillsCount,
      unpaidBillsCount,
      totalBillsCount: db.bills.length
    };
  }

  public generateMonthlyBillsForPeriod(monthYear: string, paymentTypeId: string, dueDate: string, targetClassId?: string, actorName = 'Admin'): { createdCount: number; message: string } {
    const db = this.load();
    const paymentType = db.paymentTypes.find(pt => pt.id === paymentTypeId);
    if (!paymentType) return { createdCount: 0, message: 'Jenis pembayaran tidak ditemukan.' };

    let targetStudents = db.students.filter(s => s.status === 'Aktif');
    if (targetClassId) {
      targetStudents = targetStudents.filter(s => s.classId === targetClassId);
    }

    let createdCount = 0;
    targetStudents.forEach(student => {
      // Check duplicate
      const exists = db.bills.some(b => b.studentId === student.id && b.paymentTypeId === paymentTypeId && b.billingMonth === monthYear);
      if (!exists) {
        const billNumber = `INV-${monthYear.replace(/\s+/g, '-').toUpperCase()}-${student.nis.slice(-4)}`;
        db.bills.push({
          id: `bill_${student.id}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          billNumber,
          studentId: student.id,
          paymentTypeId: paymentType.id,
          paymentTypeName: paymentType.name,
          billingMonth: monthYear,
          academicYear: '2025/2026',
          amount: paymentType.amount,
          paidAmount: 0,
          remainingAmount: paymentType.amount,
          dueDate,
          status: 'Belum Bayar',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        createdCount++;
      }
    });

    this.save(db);
    this.logActivity(actorName, 'admin', 'GENERATE_BILLS', `Menerbitkan ${createdCount} tagihan ${paymentType.name} periode ${monthYear}`);
    return {
      createdCount,
      message: `Berhasil menerbitkan ${createdCount} tagihan untuk periode ${monthYear}.`
    };
  }

  // Submit payment report by parent
  public submitPaymentReport(data: {
    billId: string;
    studentId: string;
    parentId: string;
    reportedAmount: number;
    paymentMethod: 'Transfer Bank' | 'Tunai';
    bankName?: string;
    senderAccountName?: string;
    referenceNumber?: string;
    proofImageUrl?: string;
    notes?: string;
    parentName: string;
  }): { success: boolean; message: string; report?: PaymentReport } {
    const db = this.load();
    const bill = db.bills.find(b => b.id === data.billId);
    if (!bill) return { success: false, message: 'Tagihan tidak ditemukan.' };

    const newReport: PaymentReport = {
      id: `rep_${Date.now()}`,
      billId: data.billId,
      studentId: data.studentId,
      parentId: data.parentId,
      reportedAmount: data.reportedAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: data.paymentMethod,
      bankName: data.bankName,
      senderAccountName: data.senderAccountName,
      referenceNumber: data.referenceNumber,
      proofImageUrl: data.proofImageUrl || '/src/assets/images/madrasah_emblem_logo_1792550360091.jpg',
      notes: data.notes,
      status: 'Menunggu Verifikasi',
      createdAt: new Date().toISOString()
    };

    bill.status = 'Menunggu Verifikasi';
    bill.updatedAt = new Date().toISOString();

    db.paymentReports.unshift(newReport);

    // Audit log
    db.paymentAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      billId: data.billId,
      action: 'REPORT_PAYMENT',
      actorName: data.parentName,
      actorRole: 'parent',
      details: `Wali santri melaporkan pembayaran ${bill.paymentTypeName} (${bill.billingMonth}) sebesar Rp ${data.reportedAmount.toLocaleString('id-ID')}`,
      previousStatus: 'Belum Bayar',
      newStatus: 'Menunggu Verifikasi',
      amount: data.reportedAmount,
      timestamp: new Date().toISOString()
    });

    this.save(db);
    this.logActivity(data.parentName, 'parent', 'REPORT_PAYMENT', `Konfirmasi pembayaran tagihan ${bill.billNumber}`);

    return {
      success: true,
      message: 'Laporan pembayaran Anda telah berhasil dikirim dan menunggu verifikasi dari admin/bendahara.',
      report: newReport
    };
  }

  // Admin approves or rejects payment report
  public verifyPaymentReport(reportId: string, action: 'APPROVE' | 'REJECT', rejectionReason?: string, verifierName = 'Ust. Ade Yusup, S.Pd.'): { success: boolean; message: string; receipt?: PaymentReceipt } {
    const db = this.load();
    const report = db.paymentReports.find(r => r.id === reportId);
    if (!report) return { success: false, message: 'Laporan pembayaran tidak ditemukan.' };

    const bill = db.bills.find(b => b.id === report.billId);
    if (!bill) return { success: false, message: 'Tagihan terkait tidak ditemukan.' };

    const student = db.students.find(s => s.id === bill.studentId);
    const classItem = student ? db.classes.find(c => c.id === student.classId) : undefined;

    if (action === 'APPROVE') {
      report.status = 'Disetujui';
      report.verifiedAt = new Date().toISOString();

      bill.paidAmount = report.reportedAmount;
      bill.remainingAmount = Math.max(0, bill.amount - bill.paidAmount);
      bill.status = bill.remainingAmount === 0 ? 'Lunas' : 'Sebagian Dibayar';
      bill.updatedAt = new Date().toISOString();

      // Generate Official Receipt
      const receiptNumber = `KW-NH-2026-${String(db.receipts.length + 1).padStart(4, '0')}`;
      const receipt: PaymentReceipt = {
        id: `rcpt_${bill.id}_${Date.now()}`,
        receiptNumber,
        billId: bill.id,
        studentId: bill.studentId,
        studentName: student?.fullName || 'Santri',
        className: classItem?.name || 'Kelas',
        paymentTypeName: bill.paymentTypeName,
        period: bill.billingMonth,
        amountPaid: report.reportedAmount,
        paymentMethod: report.paymentMethod,
        issuedDate: new Date().toISOString().split('T')[0],
        issuedBy: verifierName,
        verificationCode: `VERIF-MDTU-${receiptNumber}-${Date.now().toString().slice(-4)}`
      };

      db.receipts.unshift(receipt);

      db.paymentAuditLogs.unshift({
        id: `audit_${Date.now()}`,
        billId: bill.id,
        action: 'VERIFY_PAYMENT',
        actorName: verifierName,
        actorRole: 'admin',
        details: `Pembayaran disetujui lunas. Kuitansi sah diterbitkan: ${receiptNumber}`,
        previousStatus: 'Menunggu Verifikasi',
        newStatus: bill.status,
        amount: report.reportedAmount,
        timestamp: new Date().toISOString()
      });

      this.save(db);
      this.logActivity(verifierName, 'admin', 'APPROVE_PAYMENT', `Menyetujui pembayaran tagihan ${bill.billNumber} (${student?.fullName})`);

      return {
        success: true,
        message: `Pembayaran telah diverifikasi sah. Kuitansi ${receiptNumber} berhasil diterbitkan.`,
        receipt
      };
    } else {
      report.status = 'Ditolak';
      report.rejectionReason = rejectionReason || 'Bukti transfer tidak terbaca atau nominal tidak sesuai.';
      report.verifiedAt = new Date().toISOString();

      bill.status = 'Ditolak';
      bill.updatedAt = new Date().toISOString();

      db.paymentAuditLogs.unshift({
        id: `audit_${Date.now()}`,
        billId: bill.id,
        action: 'REJECT_PAYMENT',
        actorName: verifierName,
        actorRole: 'admin',
        details: `Pembayaran ditolak: ${report.rejectionReason}`,
        previousStatus: 'Menunggu Verifikasi',
        newStatus: 'Ditolak',
        amount: report.reportedAmount,
        timestamp: new Date().toISOString()
      });

      this.save(db);
      this.logActivity(verifierName, 'admin', 'REJECT_PAYMENT', `Menolak laporan pembayaran tagihan ${bill.billNumber}: ${report.rejectionReason}`);

      return {
        success: true,
        message: 'Laporan pembayaran ditolak dan alasan telah disampaikan ke akun orang tua santri.'
      };
    }
  }

  // Admin directly records cash payment in madrasah office
  public recordDirectCashPayment(billId: string, amount: number, verifierName = 'Ust. Ade Yusup, S.Pd.'): { success: boolean; message: string; receipt?: PaymentReceipt } {
    const db = this.load();
    const bill = db.bills.find(b => b.id === billId);
    if (!bill) return { success: false, message: 'Tagihan tidak ditemukan.' };

    const student = db.students.find(s => s.id === bill.studentId);
    const classItem = student ? db.classes.find(c => c.id === student.classId) : undefined;

    bill.paidAmount = amount;
    bill.remainingAmount = Math.max(0, bill.amount - amount);
    bill.status = bill.remainingAmount === 0 ? 'Lunas' : 'Sebagian Dibayar';
    bill.updatedAt = new Date().toISOString();

    const receiptNumber = `KW-NH-2026-${String(db.receipts.length + 1).padStart(4, '0')}`;
    const receipt: PaymentReceipt = {
      id: `rcpt_${bill.id}_${Date.now()}`,
      receiptNumber,
      billId: bill.id,
      studentId: bill.studentId,
      studentName: student?.fullName || 'Santri',
      className: classItem?.name || 'Kelas',
      paymentTypeName: bill.paymentTypeName,
      period: bill.billingMonth,
      amountPaid: amount,
      paymentMethod: 'Tunai di Kantor Madrasah',
      issuedDate: new Date().toISOString().split('T')[0],
      issuedBy: verifierName,
      verificationCode: `VERIF-MDTU-CASH-${receiptNumber}`
    };

    db.receipts.unshift(receipt);

    db.paymentAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      billId: bill.id,
      action: 'MANUAL_CASH_PAYMENT',
      actorName: verifierName,
      actorRole: 'admin',
      details: `Penerimaan pembayaran tunai di kantor sebesar Rp ${amount.toLocaleString('id-ID')}. Kuitansi sah: ${receiptNumber}`,
      previousStatus: 'Belum Bayar',
      newStatus: bill.status,
      amount,
      timestamp: new Date().toISOString()
    });

    this.save(db);
    this.logActivity(verifierName, 'admin', 'RECORD_CASH_PAYMENT', `Mencatat pembayaran tunai tagihan ${bill.billNumber} untuk santri ${student?.fullName}`);

    return {
      success: true,
      message: `Pembayaran tunai berhasil dicatat. Kuitansi ${receiptNumber} telah terbit.`,
      receipt
    };
  }

  public getReceiptByBillId(billId: string): PaymentReceipt | undefined {
    return this.load().receipts.find(r => r.billId === billId);
  }

  public getReceiptsByStudentId(studentId: string): PaymentReceipt[] {
    return this.load().receipts.filter(r => r.studentId === studentId);
  }

  public getPaymentReports(billId?: string): PaymentReport[] {
    const db = this.load();
    return billId ? db.paymentReports.filter(r => r.billId === billId) : db.paymentReports;
  }

  public getAuditLogs(): PaymentAuditLog[] {
    return this.load().paymentAuditLogs;
  }

  public getActivityLogs(): ActivityLog[] {
    return this.load().activityLogs;
  }

  // --- BACKUP & RESTORE ---
  public exportDatabaseJson(): string {
    return JSON.stringify(this.load(), null, 2);
  }

  public importDatabaseJson(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString) as DatabaseState;
      if (!parsed.settings || !parsed.users || !parsed.students) {
        return { success: false, message: 'Format data JSON tidak valid untuk MDTU Nurul Hidayah.' };
      }
      this.save(parsed);
      this.logActivity('Admin', 'admin', 'IMPORT_DATABASE', 'Memulihkan database dari file cadangan JSON.');
      return { success: true, message: 'Database berhasil dipulihkan dengan sukses.' };
    } catch (e) {
      return { success: false, message: 'Gagal membaca file JSON: ' + (e as Error).message };
    }
  }

  public resetToDefaults(): void {
    const initial = initDefaultDatabase();
    this.save(initial);
    this.logActivity('System', 'system', 'RESET_DATABASE', 'Database di-reset ke data bawaan awal.');
  }
}

export const storageService = new StorageService();
