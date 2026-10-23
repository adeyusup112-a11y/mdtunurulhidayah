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
  SubjectGrade,
  DigitalReportCard,
  DatabaseState
} from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  institutionName: 'MDTU Nurul Hidayah',
  headmasterName: 'Ust. Ade Yusup, S.Pd.',
  headmasterTitle: 'Kepala MDTU Nurul Hidayah',
  headmasterGreeting:
    'Assalamu’alaikum Warahmatullahi Wabarakatuh. Puji dan syukur kita panjatkan ke hadirat Allah SWT, shalawat serta salam senantiasa tercurah kepada junjungan alam Nabi Besar Muhammad SAW. Selamat datang di portal resmi MDTU Nurul Hidayah Cigoong, Sirnabaya, Rajadesa. Kami berkomitmen menyelenggarakan pendidikan diniyah yang mengokohkan akidah, menuntun ibadah, menanamkan akhlakul karimah, serta membekali putra-putri kita dengan kecintaan mendalam terhadap Al-Qur\'an dan nilai-nilai Islam.',
  headmasterPhotoUrl: '/src/assets/images/cartoon_ustadz_clean_1792552709074.jpg',
  address: 'Kp. Dukuh Sari, Dusun Cigoong, RT 03 RW 01, Desa Sirnabaya, Kecamatan Rajadesa, Kabupaten Ciamis, Jawa Barat 46254',
  phone: '182315987599',
  email: 'nurulhidayah177@gmail.com',
  logoUrl: '/src/assets/images/madrasah_emblem_logo_1792550360091.jpg',
  heroImageUrl: '/src/assets/images/hero_madrasah_building_1792550359080.jpg',
  heroHeadline: 'Membentuk Generasi Santri Berakhlak Mulia, Berilmu, dan Cinta Al-Qur’an',
  heroSubheadline:
    'Pendidikan Madrasah Diniyah Takmiliyah Ula terintegrasi di Dusun Cigoong, Desa Sirnabaya, Kecamatan Rajadesa, Kabupaten Ciamis.',
  vision:
    'Terwujudnya generasi muslim yang berakhlak mulia, kokoh dalam aqidah, tertib dalam ibadah, mahir membaca dan memahami Al-Qur’an, serta berwawasan luas.',
  mission: [
    'Menyelenggarakan pembelajaran Al-Qur’an dan tahfidz dengan tartil dan tajwid yang benar.',
    'Menanamkan nilai-nilai aqidah tauhid dan membiasakan akhlak terpuji dalam kehidupan sehari-hari.',
    'Membimbing tata cara ibadah fardhu dan sunnah, khususnya pembiasaan shalat berjamaah dan shalat Dhuha.',
    'Mengajarkan dasar-dasar bahasa Arab dan pemahaman kitab-kitab dasar keislaman secara bertahap.',
    'Membangun sinergi yang harmonis antara guru, orang tua/wali santri, dan masyarakat sekitar.'
  ],
  educationalGoals: [
    'Santri mampu membaca Al-Qur’an dengan fasih serta menghafal juz 30 dan surat-surat pilihan.',
    'Santri mempraktikkan ibadah wajib dan sunnah harian secara benar sesuai tuntunan syariat.',
    'Santri memiliki adab mulia kepada orang tua, guru, sesama teman, dan lingkungan sekitar.',
    'Santri menguasai doa-doa harian dan dzikir ma’tsurat.'
  ],
  institutionalValues: [
    'Ikhlas — Mengabdi dan mendidik semata-mata karena mengharap ridha Allah SWT.',
    'Amanah — Menjaga kepercayaan orang tua dan masyarakat dengan penuh tanggung jawab.',
    'Keteladanan — Menjadikan keteladanan pendidik sebagai pilar utama pembentukan karakter.',
    'Kebersamaan — Membangun ukhuwah islamiyah dan keterbukaan komunikasi.'
  ],
  history:
    'MDTU Nurul Hidayah didirikan sebagai ikhtiar luhur para tokoh agama dan masyarakat di Kp. Dukuh Sari, Dusun Cigoong, Desa Sirnabaya, Kecamatan Rajadesa, Kabupaten Ciamis, untuk menyediakan wadah pembinaan keagamaan formal sore hari bagi anak-anak usia sekolah dasar. Dengan mengintegrasikan kurikulum Kementerian Agama Republik Indonesia dan tradisi diniyah yang mengedepankan pembiasaan ibadah praktis, madrasah terus berkhidmah mencetak santri-santri yang berkarakter islami.',
  bankAccounts: [
    {
      bankName: 'DANA (Dompet Digital)',
      accountNumber: '081324168105',
      accountHolder: 'Azmi M Nurjamil'
    },
    {
      bankName: 'Bank BRI',
      accountNumber: '4056 0101 3846 503',
      accountHolder: 'MDTU Nurul Hidayah'
    }
  ],
  ppdbActive: true,
  ppdbRequirements: [
    'Mengisi formulir pendaftaran online atau langsung di kantor madrasah',
    'Menyerahkan fotokopi Akta Kelahiran santri (1 lembar)',
    'Menyerahkan fotokopi Kartu Keluarga (KK) (1 lembar)',
    'Menyerahkan fotokopi KTP orang tua/wali santri (1 lembar)',
    'Pas foto berwarna santri ukuran 3x4 (2 lembar)'
  ],
  studyHours: 'Hari Senin - Minggu pukul 13.00 - 16.00 WIB (Jumat Libur)',
  monthlySppAmount: 25000
};

export const INITIAL_CLASSES: ClassItem[] = [
  { id: 'class_1', name: 'Kelas 1 (Ula A)', academicYear: '2025/2026', teacherId: 'teacher_2', roomName: 'Ruang Utsman bin Affan', studentCount: 15 },
  { id: 'class_2', name: 'Kelas 2 (Ula B)', academicYear: '2025/2026', teacherId: 'teacher_3', roomName: 'Ruang Ali bin Abi Thalib', studentCount: 15 },
  { id: 'class_3', name: 'Kelas 3 (Ula C)', academicYear: '2025/2026', teacherId: 'teacher_4', roomName: 'Ruang Umar bin Khattab', studentCount: 15 },
  { id: 'class_4', name: 'Kelas 4 (Ula D)', academicYear: '2025/2026', teacherId: 'teacher_1', roomName: 'Ruang Abu Bakar Ash-Shiddiq', studentCount: 15 }
];

export const INITIAL_TEACHERS: TeacherProfile[] = [
  {
    id: 'teacher_1',
    userId: 'user_teacher_1',
    nip: '198104122014031001',
    fullName: 'Ade Yusup',
    title: 'Ust. Ade Yusup, S.Pd.',
    roleTitle: 'Kepala Lembaga sekaligus Wali Kelas 4',
    assignedClassId: 'class_4',
    education: 'S1 Pendidikan Agama Islam',
    phone: '182315987599',
    photoUrl: '/src/assets/images/cartoon_ustadz_clean_1792552709074.jpg',
    bio: 'Pendidik berdedikasi membina santri MDTU Nurul Hidayah, fokus pada penguatan akhlak, fiqih dasar, dan kepemimpinan santri.',
    subjects: ['Fiqih', 'Aqidah Akhlak', 'Al-Qur\'an Hadits'],
    permissions: {
      canManageAttendance: true,
      canManageGrades: true,
      canManageAnnouncements: true,
      canViewPaymentStatus: true
    },
    isActive: true
  },
  {
    id: 'teacher_2',
    userId: 'user_teacher_2',
    nip: '198708212017042002',
    fullName: 'Siti Saadah',
    title: 'Usth. Siti Saadah, S.Pd.',
    roleTitle: 'Wali Kelas 1',
    assignedClassId: 'class_1',
    education: 'S1 Tarbiyah',
    phone: '085223419082',
    photoUrl: '/src/assets/images/cartoon_ustadzah_clean_1792552725068.jpg',
    bio: 'Berpengalaman mendidik santri baru kelas awal dengan metode Iqro ceria, tajwid dasar, hafalan doa harian, dan pembiasaan adab.',
    subjects: ['Tahfidz & Iqro', 'Doa Harian', 'Praktek Ibadah'],
    permissions: {
      canManageAttendance: true,
      canManageGrades: true,
      canManageAnnouncements: true,
      canViewPaymentStatus: true
    },
    isActive: true
  },
  {
    id: 'teacher_3',
    userId: 'user_teacher_3',
    nip: '199003152019052003',
    fullName: 'Fitri Hermawati',
    title: 'Usth. Fitri Hermawati',
    roleTitle: 'Wali Kelas 2',
    assignedClassId: 'class_2',
    education: 'Diploma Pendidikan Islam',
    phone: '082119845321',
    photoUrl: '/src/assets/images/cartoon_ustadzah_soft_1792552770682.jpg',
    bio: 'Pengajar telaten membimbing tartil Al-Qur’an juz 30, kosa kata Bahasa Arab dasar, serta sejarah para Nabi dan Rasul.',
    subjects: ['Tarikh Islam', 'Bahasa Arab Dasar', 'Tahfidz Al-Qur\'an'],
    permissions: {
      canManageAttendance: true,
      canManageGrades: true,
      canManageAnnouncements: true,
      canViewPaymentStatus: true
    },
    isActive: true
  },
  {
    id: 'teacher_4',
    userId: 'user_teacher_4',
    nip: '199211042020081004',
    fullName: 'Azmi M Nurjamil',
    title: 'Ust. Azmi M Nurjamil',
    roleTitle: 'Wali Kelas 3',
    assignedClassId: 'class_3',
    education: 'Pondok Pesantren Salafiyyah & Ma’had Aly',
    phone: '081394120934',
    photoUrl: '/src/assets/images/cartoon_ustadz_young_1792552747499.jpg',
    bio: 'Mengajar gramatika Bahasa Arab, tajwid lanjutan, safinatun najah, serta pembina kegiatan kepanduan pramuka santri.',
    subjects: ['Fiqih Safinah', 'Tajwid Lanjutan', 'Ekstrakurikuler Pramuka'],
    permissions: {
      canManageAttendance: true,
      canManageGrades: true,
      canManageAnnouncements: true,
      canViewPaymentStatus: true
    },
    isActive: true
  }
];

// Student & Parent names list for 60 pairs (15 santri x 4 kelas)
const RAW_STUDENT_NAMES = [
  // Kelas 1 (15 santri)
  { name: 'Muhammad Al-Fatih', gender: 'L', classId: 'class_1', parentName: 'Bapak Ahmad Sobari', phone: '081234567801' },
  { name: 'Aisyah Humaira', gender: 'P', classId: 'class_1', parentName: 'Ibu Enok Rohayati', phone: '081234567802' },
  { name: 'Bilal Habasyi', gender: 'L', classId: 'class_1', parentName: 'Bapak Dedi Kusnadi', phone: '081234567803' },
  { name: 'Fatimah Az-Zahra', gender: 'P', classId: 'class_1', parentName: 'Ibu Ai Sumiati', phone: '081234567804' },
  { name: 'Ibrahim Khalilullah', gender: 'L', classId: 'class_1', parentName: 'Bapak Maman Suherman', phone: '081234567805' },
  { name: 'Maryam binti Imran', gender: 'P', classId: 'class_1', parentName: 'Ibu Nining Yuningsih', phone: '081234567806' },
  { name: 'Yusuf Habiburrahman', gender: 'L', classId: 'class_1', parentName: 'Bapak Nana Suryana', phone: '081234567807' },
  { name: 'Khadijah Al-Kubra', gender: 'P', classId: 'class_1', parentName: 'Ibu Kokom Komalasari', phone: '081234567808' },
  { name: 'Hasan Ali Al-Husain', gender: 'L', classId: 'class_1', parentName: 'Bapak Agus Setiawan', phone: '081234567809' },
  { name: 'Zahra Syahirah', gender: 'P', classId: 'class_1', parentName: 'Ibu Siti Munawaroh', phone: '081234567810' },
  { name: 'Ziyad Abdullah', gender: 'L', classId: 'class_1', parentName: 'Bapak Endang Hidayat', phone: '081234567841' },
  { name: 'Halimah As-Sa\'diyah', gender: 'P', classId: 'class_1', parentName: 'Ibu Elis Rosidah', phone: '081234567842' },
  { name: 'Luqman Al-Hakim', gender: 'L', classId: 'class_1', parentName: 'Bapak Yudi Mulyadi', phone: '081234567843' },
  { name: 'Salwa Nur Salsabila', gender: 'P', classId: 'class_1', parentName: 'Ibu Imas Rodiah', phone: '081234567844' },
  { name: 'Yahya Zakariya', gender: 'L', classId: 'class_1', parentName: 'Bapak Tatang Rohimat', phone: '081234567845' },

  // Kelas 2 (15 santri)
  { name: 'Hamzah Asadullah', gender: 'L', classId: 'class_2', parentName: 'Bapak Cecep Hidayat', phone: '081234567811' },
  { name: 'Safiyyah binti Huyay', gender: 'P', classId: 'class_2', parentName: 'Ibu Cucu Rohimah', phone: '081234567812' },
  { name: 'Umar Faruq', gender: 'L', classId: 'class_2', parentName: 'Bapak Tatang Sutisna', phone: '081234567813' },
  { name: 'Zainab binti Jahsy', gender: 'P', classId: 'class_2', parentName: 'Ibu Imas Masitoh', phone: '081234567814' },
  { name: 'Ali bin Abi Thalib', gender: 'L', classId: 'class_2', parentName: 'Bapak Jajang Nurjaman', phone: '081234567815' },
  { name: 'Ruqayyah Al-Hasyimi', gender: 'P', classId: 'class_2', parentName: 'Ibu Euis Ratnasari', phone: '081234567816' },
  { name: 'Zaid bin Tsabit', gender: 'L', classId: 'class_2', parentName: 'Bapak Didin Saprudin', phone: '081234567817' },
  { name: 'Hafshah binti Umar', gender: 'P', classId: 'class_2', parentName: 'Ibu Entin Supriatin', phone: '081234567818' },
  { name: 'Thariq bin Ziyad', gender: 'L', classId: 'class_2', parentName: 'Bapak Wawan Kurniawan', phone: '081234567819' },
  { name: 'Asma binti Abu Bakar', gender: 'P', classId: 'class_2', parentName: 'Ibu Lilis Suryani', phone: '081234567820' },
  { name: 'Harun Al-Rasyid', gender: 'L', classId: 'class_2', parentName: 'Bapak Budi Gunawan', phone: '081234567846' },
  { name: 'Qanita Mumtazah', gender: 'P', classId: 'class_2', parentName: 'Ibu Nur Aisyah', phone: '081234567847' },
  { name: 'Ilyas Nurul Anwar', gender: 'L', classId: 'class_2', parentName: 'Bapak Rahmat Hidayat', phone: '081234567848' },
  { name: 'Syahla Syahidah', gender: 'P', classId: 'class_2', parentName: 'Ibu Yani Maryani', phone: '081234567849' },
  { name: 'Ammar bin Yasir', gender: 'L', classId: 'class_2', parentName: 'Bapak Kusnadi', phone: '081234567850' },

  // Kelas 3 (15 santri)
  { name: 'Salman Al-Farisi', gender: 'L', classId: 'class_3', parentName: 'Bapak Endang Komara', phone: '081234567821' },
  { name: 'Juwaidiyah Al-Khoir', gender: 'P', classId: 'class_3', parentName: 'Ibu Nunung Nurjanah', phone: '081234567822' },
  { name: 'Khalid bin Walid', gender: 'L', classId: 'class_3', parentName: 'Bapak Asep Saepudin', phone: '081234567823' },
  { name: 'Maimunah binti Harits', gender: 'P', classId: 'class_3', parentName: 'Ibu Ani Sumarni', phone: '081234567824' },
  { name: 'Sa’ad bin Abi Waqqash', gender: 'L', classId: 'class_3', parentName: 'Bapak Yayan Sopian', phone: '081234567825' },
  { name: 'Ummu Salamah', gender: 'P', classId: 'class_3', parentName: 'Ibu Oom Romlah', phone: '081234567826' },
  { name: 'Abdullah bin Mas’ud', gender: 'L', classId: 'class_3', parentName: 'Bapak Iwan Hermawan', phone: '081234567827' },
  { name: 'Athiyyah Ramadhani', gender: 'P', classId: 'class_3', parentName: 'Ibu Yanti Maryanti', phone: '081234567828' },
  { name: 'Zubair bin Awwam', gender: 'L', classId: 'class_3', parentName: 'Bapak Oding Suhendar', phone: '081234567829' },
  { name: 'Najma Salsabila', gender: 'P', classId: 'class_3', parentName: 'Ibu Rina Marlina', phone: '081234567830' },
  { name: 'Mu\'adz bin Jabal', gender: 'L', classId: 'class_3', parentName: 'Bapak Aceng Kurnia', phone: '081234567851' },
  { name: 'Syakira Nur Fadhilah', gender: 'P', classId: 'class_3', parentName: 'Ibu Neni Triana', phone: '081234567852' },
  { name: 'Hudzaifah Al-Yamani', gender: 'L', classId: 'class_3', parentName: 'Bapak Dani Ramdani', phone: '081234567853' },
  { name: 'Wardah Maulida', gender: 'P', classId: 'class_3', parentName: 'Ibu Yanti Rosmiati', phone: '081234567854' },
  { name: 'Usamah bin Zaid', gender: 'L', classId: 'class_3', parentName: 'Bapak Aang Suhanda', phone: '081234567855' },

  // Kelas 4 (15 santri)
  { name: 'Faqih Rahmatullah', gender: 'L', classId: 'class_4', parentName: 'Bapak Dudung Abdullah', phone: '081234567831' },
  { name: 'Naila Fauziyyah', gender: 'P', classId: 'class_4', parentName: 'Ibu Teti Rohaeti', phone: '081234567832' },
  { name: 'Rizki Nurhidayat', gender: 'L', classId: 'class_4', parentName: 'Bapak Dadang Mulyadi', phone: '081234567833' },
  { name: 'Syifa Nurul Izzah', gender: 'P', classId: 'class_4', parentName: 'Ibu Eli Herlina', phone: '081234567834' },
  { name: 'Akmal Ziyad Pratama', gender: 'L', classId: 'class_4', parentName: 'Bapak Hendra Gunawan', phone: '081234567835' },
  { name: 'Salma Qonitah', gender: 'P', classId: 'class_4', parentName: 'Ibu Neneng Hasanah', phone: '081234567836' },
  { name: 'Farhan Maulana', gender: 'L', classId: 'class_4', parentName: 'Bapak Ujang Kosasih', phone: '081234567837' },
  { name: 'Dina Kamila', gender: 'P', classId: 'class_4', parentName: 'Ibu Ema Rahmawati', phone: '081234567838' },
  { name: 'Rayhan Al-Ghifari', gender: 'L', classId: 'class_4', parentName: 'Bapak Solihin', phone: '081234567839' },
  { name: 'Hilya Aulia Rahmah', gender: 'P', classId: 'class_4', parentName: 'Ibu Yuyun Wahyuni', phone: '081234567840' },
  { name: 'Fakhri Musyaffa', gender: 'L', classId: 'class_4', parentName: 'Bapak Eman Sulaeman', phone: '081234567856' },
  { name: 'Atikah binti Zaid', gender: 'P', classId: 'class_4', parentName: 'Ibu Eni Rohaeni', phone: '081234567857' },
  { name: 'Miqdad bin Amr', gender: 'L', classId: 'class_4', parentName: 'Bapak Ikin Sadikin', phone: '081234567858' },
  { name: 'Raihanah binti Zaid', gender: 'P', classId: 'class_4', parentName: 'Ibu Ai Jamilah', phone: '081234567859' },
  { name: 'Sholahuddin Al-Ayyubi', gender: 'L', classId: 'class_4', parentName: 'Bapak Anwar Sanusi', phone: '081234567860' }
] as const;

export function generateInitialUsersAndEntities() {
  const users: User[] = [];
  const parents: ParentProfile[] = [];
  const students: Student[] = [];

  // 1. Admin User
  users.push({
    id: 'user_admin_1',
    username: 'admin',
    fullName: 'Administrator Lembaga',
    role: 'admin',
    passwordHash: 'admin123', // In demo storage, plain/hash verified via storage service
    isActive: true,
    email: 'nurulhidayah177@gmail.com',
    phone: '182315987599',
    createdAt: '2025-07-01T08:00:00Z'
  });

  // 2. Teacher Users (4)
  users.push(
    {
      id: 'user_teacher_1',
      username: 'ade_yusup',
      fullName: 'Ust. Ade Yusup, S.Pd.',
      role: 'teacher',
      passwordHash: 'guru123',
      isActive: true,
      phone: '182315987599',
      createdAt: '2025-07-01T08:00:00Z'
    },
    {
      id: 'user_teacher_2',
      username: 'siti_saadah',
      fullName: 'Usth. Siti Saadah, S.Pd.',
      role: 'teacher',
      passwordHash: 'guru123',
      isActive: true,
      phone: '085223419082',
      createdAt: '2025-07-01T08:00:00Z'
    },
    {
      id: 'user_teacher_3',
      username: 'fitri_hermawati',
      fullName: 'Usth. Fitri Hermawati',
      role: 'teacher',
      passwordHash: 'guru123',
      isActive: true,
      phone: '082119845321',
      createdAt: '2025-07-01T08:00:00Z'
    },
    {
      id: 'user_teacher_4',
      username: 'azmi_nurjamil',
      fullName: 'Ust. Azmi M Nurjamil',
      role: 'teacher',
      passwordHash: 'guru123',
      isActive: true,
      phone: '081394120934',
      createdAt: '2025-07-01T08:00:00Z'
    }
  );

  // 3. 40 Parents and 40 Students
  RAW_STUDENT_NAMES.forEach((item, index) => {
    const parentNum = String(index + 1).padStart(2, '0');
    const parentUserId = `user_parent_${parentNum}`;
    const parentProfileId = `parent_${parentNum}`;
    const studentId = `student_${parentNum}`;
    const nis = `2026${item.classId.replace('class_', '0')}${String(index % 10 + 1).padStart(3, '0')}`;
    const username = `orangtua_${parentNum}`;

    users.push({
      id: parentUserId,
      username,
      fullName: item.parentName,
      role: 'parent',
      passwordHash: 'wali123',
      isActive: true,
      phone: item.phone,
      createdAt: '2025-07-15T08:00:00Z'
    });

    parents.push({
      id: parentProfileId,
      userId: parentUserId,
      fullName: item.parentName,
      relationship: item.parentName.startsWith('Ibu') ? 'Ibu' : 'Ayah',
      phone: item.phone,
      address: `Kp. Dukuh Sari, Dusun Cigoong RT 0${(index % 3) + 1} RW 01, Desa Sirnabaya, Rajadesa`,
      occupation: (index % 3 === 0) ? 'Petani / Wiraswasta' : (index % 3 === 1) ? 'PNS / Guru' : 'Pedagang',
      studentIds: [studentId],
      isActive: true
    });

    students.push({
      id: studentId,
      nis,
      nisn: `01${index + 40023412}`,
      fullName: item.name,
      gender: item.gender as 'L' | 'P',
      birthPlace: 'Ciamis',
      birthDate: `201${7 - Math.floor(index / 10)}-0${(index % 9) + 1}-1${index % 8}`,
      classId: item.classId,
      parentId: parentProfileId,
      address: `Kp. Dukuh Sari, Dusun Cigoong RT 0${(index % 3) + 1} RW 01, Desa Sirnabaya, Rajadesa`,
      enrollmentYear: 2025,
      status: 'Aktif',
      notes: 'Santri aktif, rajin hadir tepat waktu.'
    });
  });

  return { users, parents, students };
}

export const INITIAL_PAYMENT_TYPES: PaymentType[] = [
  { id: 'pt_spp', name: 'SPP Bulanan MDTU', amount: 35000, frequency: 'Bulanan', isActive: true },
  { id: 'pt_kegiatan', name: 'Uang Kegiatan & PHBI', amount: 25000, frequency: 'Tahunan', isActive: true },
  { id: 'pt_kitab', name: 'Kitab & Modul Pembelajaran', amount: 50000, frequency: 'Sekali', isActive: true }
];

export function generateInitialBillsAndFinances(students: Student[], parents: ParentProfile[]) {
  const bills: StudentBill[] = [];
  const reports: PaymentReport[] = [];
  const receipts: PaymentReceipt[] = [];
  const auditLogs: PaymentAuditLog[] = [];

  const months = ['Januari 2026', 'Februari 2026', 'Maret 2026', 'April 2026', 'Mei 2026'];

  students.forEach((student, sIdx) => {
    months.forEach((month, mIdx) => {
      const billId = `bill_${student.id}_m${mIdx + 1}`;
      const billNumber = `INV-2026-${String(mIdx + 1).padStart(2, '0')}-${student.nis.slice(-4)}`;
      const dueDate = `2026-0${mIdx + 1}-15`;

      // Status logic:
      // Jan, Feb, Mar mostly Lunas
      // Apr: mix of Lunas, Menunggu Verifikasi, Belum Bayar
      // Mei: mix of Belum Bayar and Menunggu Verifikasi
      let status: 'Lunas' | 'Menunggu Verifikasi' | 'Belum Bayar' | 'Sebagian Dibayar' = 'Belum Bayar';
      let paidAmount = 0;
      let remainingAmount = 35000;

      if (mIdx <= 2) {
        // Jan, Feb, Mar
        if (sIdx % 8 !== 0) {
          status = 'Lunas';
          paidAmount = 35000;
          remainingAmount = 0;
        } else {
          status = 'Belum Bayar';
        }
      } else if (mIdx === 3) {
        // April
        if (sIdx % 3 === 0) {
          status = 'Lunas';
          paidAmount = 35000;
          remainingAmount = 0;
        } else if (sIdx % 3 === 1) {
          status = 'Menunggu Verifikasi';
          paidAmount = 0;
          remainingAmount = 35000;
        } else {
          status = 'Belum Bayar';
        }
      } else {
        // Mei
        if (sIdx % 5 === 0) {
          status = 'Menunggu Verifikasi';
        } else if (sIdx === 1 || sIdx === 2) {
          status = 'Lunas';
          paidAmount = 35000;
          remainingAmount = 0;
        } else {
          status = 'Belum Bayar';
        }
      }

      bills.push({
        id: billId,
        billNumber,
        studentId: student.id,
        paymentTypeId: 'pt_spp',
        paymentTypeName: 'SPP Bulanan MDTU',
        billingMonth: month,
        academicYear: '2025/2026',
        amount: 35000,
        paidAmount,
        remainingAmount,
        dueDate,
        status,
        createdAt: `2026-0${mIdx + 1}-01T08:00:00Z`,
        updatedAt: `2026-0${mIdx + 1}-10T09:00:00Z`
      });

      // If status is Lunas, generate a receipt and report
      if (status === 'Lunas') {
        const receiptNumber = `KW-NH-2026-${String(bills.length).padStart(4, '0')}`;
        receipts.push({
          id: `rcpt_${billId}`,
          receiptNumber,
          billId,
          studentId: student.id,
          studentName: student.fullName,
          className: student.classId === 'class_1' ? 'Kelas 1 (Ula A)' : student.classId === 'class_2' ? 'Kelas 2 (Ula B)' : student.classId === 'class_3' ? 'Kelas 3 (Ula C)' : 'Kelas 4 (Ula D)',
          paymentTypeName: 'SPP Bulanan MDTU',
          period: month,
          amountPaid: 35000,
          paymentMethod: (sIdx % 2 === 0) ? 'Transfer Bank BRI' : 'Tunai di Kantor',
          issuedDate: dueDate,
          issuedBy: 'Ust. Ade Yusup, S.Pd. (Kepala Lembaga)',
          verificationCode: `VERIF-MDTU-${billNumber}-${sIdx + 100}`
        });

        auditLogs.push({
          id: `audit_${billId}_paid`,
          billId,
          action: 'VERIFY_PAYMENT',
          actorName: 'Ust. Ade Yusup, S.Pd.',
          actorRole: 'admin',
          details: `Pembayaran SPP ${month} santri ${student.fullName} terverifikasi lunas. No Kuitansi: ${receiptNumber}`,
          previousStatus: 'Menunggu Verifikasi',
          newStatus: 'Lunas',
          amount: 35000,
          timestamp: `2026-0${mIdx + 1}-10T10:15:00Z`
        });
      }

      // If status is Menunggu Verifikasi, create a submitted payment report with proof
      if (status === 'Menunggu Verifikasi') {
        const parent = parents.find(p => p.id === student.parentId);
        reports.push({
          id: `rep_${billId}`,
          billId,
          studentId: student.id,
          parentId: student.parentId,
          reportedAmount: 35000,
          paymentDate: `2026-0${mIdx + 1}-12`,
          paymentMethod: 'Transfer Bank',
          bankName: 'Bank BRI (Simpedes)',
          senderAccountName: parent?.fullName || 'Wali Santri',
          referenceNumber: `TRX-${student.nis.slice(-4)}-${mIdx + 1}283`,
          proofImageUrl: '/src/assets/images/madrasah_emblem_logo_1792550360091.jpg',
          notes: `Laporan transfer SPP ${month} a.n ${student.fullName}. Mohon verifikasi.`,
          status: 'Menunggu Verifikasi',
          createdAt: `2026-0${mIdx + 1}-12T14:30:00Z`
        });

        auditLogs.push({
          id: `audit_${billId}_rep`,
          billId,
          action: 'REPORT_PAYMENT',
          actorName: parent?.fullName || 'Wali Santri',
          actorRole: 'parent',
          details: `Orang tua melaporkan transfer pembayaran SPP ${month} sebesar Rp 35.000`,
          previousStatus: 'Belum Bayar',
          newStatus: 'Menunggu Verifikasi',
          amount: 35000,
          timestamp: `2026-0${mIdx + 1}-12T14:30:00Z`
        });
      }
    });
  });

  return { bills, reports, receipts, auditLogs };
}

export function generateInitialAttendance(students: Student[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const dates = ['2026-05-18', '2026-05-19', '2026-05-20'];

  dates.forEach(date => {
    students.forEach((student, idx) => {
      let status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' = 'Hadir';
      if ((idx + date.length) % 17 === 0) status = 'Sakit';
      else if ((idx + date.length) % 23 === 0) status = 'Izin';

      records.push({
        id: `att_${student.id}_${date}`,
        studentId: student.id,
        classId: student.classId,
        date,
        status,
        notes: status === 'Sakit' ? 'Surat izin sakit dari orang tua' : status === 'Izin' ? 'Kepentingan keluarga' : '',
        recordedByTeacherId: student.classId === 'class_1' ? 'teacher_2' : student.classId === 'class_2' ? 'teacher_3' : student.classId === 'class_3' ? 'teacher_4' : 'teacher_1',
        updatedAt: `${date}T16:00:00Z`
      });
    });
  });

  return records;
}

export function generateInitialGrades(students: Student[]): AcademicNote[] {
  const notes: AcademicNote[] = [];
  const subjects = ['Tahfidz Al-Qur\'an', 'Fiqih Ibadah', 'Aqidah Akhlak', 'Bahasa Arab', 'Tajwid'];

  students.forEach((student, sIdx) => {
    subjects.forEach((subj, subIdx) => {
      const score = 82 + ((sIdx + subIdx * 3) % 17);
      let juzNote = '';
      if (subj === 'Tahfidz Al-Qur\'an') {
        if (student.classId === 'class_1') juzNote = 'Surat An-Nas s.d Al-Fil (Lancar tartil)';
        else if (student.classId === 'class_2') juzNote = 'Surat Al-Humazah s.d Al-Adiyat';
        else if (student.classId === 'class_3') juzNote = 'Surat Az-Zalzalah s.d Ad-Dhuha';
        else juzNote = 'Surat Al-Lail s.d An-Naba (Khatam Juz 30)';
      }

      notes.push({
        id: `grade_${student.id}_${subIdx}`,
        studentId: student.id,
        classId: student.classId,
        semester: 'Genap',
        academicYear: '2025/2026',
        subject: subj,
        score,
        memorizationProgress: juzNote,
        behaviorNote: 'Santri berakhlak terpuji, rajin mengikuti sholat berjamaah di madrasah.',
        recordedByTeacherId: student.classId === 'class_1' ? 'teacher_2' : student.classId === 'class_2' ? 'teacher_3' : student.classId === 'class_3' ? 'teacher_4' : 'teacher_1',
        updatedAt: '2026-05-15T11:00:00Z'
      });
    });
  });

  return notes;
}

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  // Kelas 1 (Wali Kelas: Usth. Siti Saadah, S.Pd.)
  { id: 'sch_1_1', classId: 'class_1', day: 'Senin', timeSlot: '13:00 - 14:15 WIB', subject: 'Iqro & Tahsin Al-Qur\'an', teacherId: 'teacher_2' },
  { id: 'sch_1_2', classId: 'class_1', day: 'Senin', timeSlot: '14:30 - 15:45 WIB', subject: 'Praktik Shalat & Doa Harian', teacherId: 'teacher_2' },
  { id: 'sch_1_3', classId: 'class_1', day: 'Selasa', timeSlot: '13:00 - 14:30 WIB', subject: 'Aqidah Dasar Santri', teacherId: 'teacher_2' },
  { id: 'sch_1_4', classId: 'class_1', day: 'Rabu', timeSlot: '13:00 - 14:30 WIB', subject: 'Kisah 25 Nabi & Rasul', teacherId: 'teacher_2' },
  { id: 'sch_1_5', classId: 'class_1', day: 'Kamis', timeSlot: '13:00 - 14:30 WIB', subject: 'Adab & Akhlak Santri', teacherId: 'teacher_2' },
  { id: 'sch_1_6', classId: 'class_1', day: 'Sabtu', timeSlot: '13:00 - 14:30 WIB', subject: 'Tahfidz Surat Pendek (Juz Amma)', teacherId: 'teacher_2' },
  { id: 'sch_1_7', classId: 'class_1', day: 'Minggu', timeSlot: '13:00 - 15:00 WIB', subject: 'Belajar Huruf Hijaiyah & Mewarnai Kaligrafi', teacherId: 'teacher_2' },

  // Kelas 2 (Wali Kelas: Usth. Fitri Hermawati)
  { id: 'sch_2_1', classId: 'class_2', day: 'Senin', timeSlot: '13:00 - 14:15 WIB', subject: 'Tajwid Dasar & Tahfidz Juz 30', teacherId: 'teacher_3' },
  { id: 'sch_2_2', classId: 'class_2', day: 'Selasa', timeSlot: '13:00 - 14:15 WIB', subject: 'Bahasa Arab Mufrodat', teacherId: 'teacher_3' },
  { id: 'sch_2_3', classId: 'class_2', day: 'Rabu', timeSlot: '13:00 - 14:15 WIB', subject: 'Fiqih Thoharoh & Wudhu', teacherId: 'teacher_3' },
  { id: 'sch_2_4', classId: 'class_2', day: 'Kamis', timeSlot: '13:00 - 14:30 WIB', subject: 'Akhlak Lil Banin / Banat', teacherId: 'teacher_3' },
  { id: 'sch_2_5', classId: 'class_2', day: 'Sabtu', timeSlot: '13:00 - 14:30 WIB', subject: 'Muroja\'ah Surat An-Nas s.d Ad-Dhuha', teacherId: 'teacher_3' },
  { id: 'sch_2_6', classId: 'class_2', day: 'Minggu', timeSlot: '13:00 - 15:00 WIB', subject: 'Praktik Ibadah & Doa Sehari-hari', teacherId: 'teacher_3' },

  // Kelas 3 (Wali Kelas: Ust. Azmi M Nurjamil)
  { id: 'sch_3_1', classId: 'class_3', day: 'Senin', timeSlot: '13:00 - 14:15 WIB', subject: 'Fiqih Safinatun Najah', teacherId: 'teacher_4' },
  { id: 'sch_3_2', classId: 'class_3', day: 'Selasa', timeSlot: '13:00 - 14:15 WIB', subject: 'Tajwid Tuhfatul Athfal', teacherId: 'teacher_4' },
  { id: 'sch_3_3', classId: 'class_3', day: 'Rabu', timeSlot: '13:00 - 14:15 WIB', subject: 'Bahasa Arab Dasar', teacherId: 'teacher_4' },
  { id: 'sch_3_4', classId: 'class_3', day: 'Kamis', timeSlot: '13:00 - 14:30 WIB', subject: 'Tarikh Islam & Sirah Nabawiyah', teacherId: 'teacher_4' },
  { id: 'sch_3_5', classId: 'class_3', day: 'Sabtu', timeSlot: '13:00 - 14:30 WIB', subject: 'Tahfidz Al-Fajr s.d An-Naba', teacherId: 'teacher_4' },
  { id: 'sch_3_6', classId: 'class_3', day: 'Minggu', timeSlot: '13:00 - 15:30 WIB', subject: 'Pramuka Santri & Kesenian Hadroh', teacherId: 'teacher_4' },

  // Kelas 4 (Wali Kelas: Ust. Ade Yusup, S.Pd.)
  { id: 'sch_4_1', classId: 'class_4', day: 'Senin', timeSlot: '13:00 - 14:15 WIB', subject: 'Fiqih Ibadah & Muamalah Lanjutan', teacherId: 'teacher_1' },
  { id: 'sch_4_2', classId: 'class_4', day: 'Selasa', timeSlot: '13:00 - 14:15 WIB', subject: 'Aqidah Akhlak & Penguatan Tauhid', teacherId: 'teacher_1' },
  { id: 'sch_4_3', classId: 'class_4', day: 'Rabu', timeSlot: '13:00 - 14:15 WIB', subject: 'Al-Qur\'an Hadits & Terjemah Pilihan', teacherId: 'teacher_1' },
  { id: 'sch_4_4', classId: 'class_4', day: 'Kamis', timeSlot: '13:00 - 14:30 WIB', subject: 'Tarikh Khulafaur Rasyidin & Sahabat', teacherId: 'teacher_1' },
  { id: 'sch_4_5', classId: 'class_4', day: 'Sabtu', timeSlot: '13:00 - 14:30 WIB', subject: 'Tahfidz Mandiri Juz 30 & Surat Al-Mulk', teacherId: 'teacher_1' },
  { id: 'sch_4_6', classId: 'class_4', day: 'Minggu', timeSlot: '13:00 - 15:30 WIB', subject: 'Khitobah & Latihan Pidato Santri', teacherId: 'teacher_1' }
];

export function generateInitialReportCards(students: Student[], teachers: TeacherProfile[]): DigitalReportCard[] {
  const reports: DigitalReportCard[] = [];

  const defaultSubjects = [
    { subject: 'Al-Qur\'an & Tahsin', kkm: 75 },
    { subject: 'Tajwid & Tahfidz Juz 30', kkm: 75 },
    { subject: 'Fiqih Ibadah & Praktik Shalat', kkm: 75 },
    { subject: 'Aqidah & Akhlakul Karimah', kkm: 75 },
    { subject: 'Bahasa Arab & Mufrodat', kkm: 70 },
    { subject: 'Tarikh Islam (Sejarah Kebudayaan Islam)', kkm: 70 },
    { subject: 'Hadits Pilihan & Doa Harian', kkm: 75 }
  ];

  students.forEach((student, idx) => {
    // Generate realistic authentic marks based on student index
    const baseScore = 80 + ((idx * 7) % 18); // range 80 - 97
    const grades: SubjectGrade[] = defaultSubjects.map((sub, sIdx) => {
      const variation = ((idx + sIdx) % 5) - 2;
      const score = Math.min(98, Math.max(76, baseScore + variation));
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

      let description = `Mampu menguasai materi ${sub.subject} dengan ${predicate.toLowerCase()} dan tekun.`;
      if (sub.subject.includes('Al-Qur\'an')) {
        description = 'Fasih membaca Al-Qur\'an dengan makharijul huruf tepat dan tajwid tertib.';
      } else if (sub.subject.includes('Tahfidz')) {
        description = 'Hafalan surat mutqin, lancar muroja\'ah dan tartil.';
      } else if (sub.subject.includes('Fiqih')) {
        description = 'Memahami rukun, syarat sah shalat dan thoharoh serta mempraktikkannya.';
      } else if (sub.subject.includes('Akhlak')) {
        description = 'Menunjukkan adab sopan santun kepada guru dan menyayangi sesama santri.';
      }

      return {
        subject: sub.subject,
        kkm: sub.kkm,
        score,
        gradeLetter,
        predicate,
        description
      };
    });

    const waliKelasMap: Record<string, string> = {
      class_1: 'Usth. Siti Saadah, S.Pd.',
      class_2: 'Usth. Fitri Hermawati',
      class_3: 'Ust. Azmi M Nurjamil',
      class_4: 'Ust. Ade Yusup, S.Pd.'
    };

    const promotionStatus = student.classId === 'class_4'
      ? 'Lulus dari MDTU Nurul Hidayah'
      : 'Naik ke Kelas Berikutnya';

    const nextClassMap: Record<string, string> = {
      class_1: 'Kelas 2 (Ula B)',
      class_2: 'Kelas 3 (Ula C)',
      class_3: 'Kelas 4 (Ula D)',
      class_4: 'Alumni / Lulus Pendidikan MDTU'
    };

    reports.push({
      id: `report_${student.id}_genap_2026`,
      studentId: student.id,
      classId: student.classId,
      academicYear: '2025/2026',
      semester: 'Genap',
      issueDate: '2026-06-20',
      place: 'Rajadesa',
      grades,
      tahfidzProgress: student.classId === 'class_1' ? 'Juz 30 (Surat An-Nas s.d Al-Fiil)' :
        student.classId === 'class_2' ? 'Juz 30 (Surat An-Nas s.d Ad-Dhuha)' :
        student.classId === 'class_3' ? 'Juz 30 (Surat An-Nas s.d Al-Fajr)' :
        'Juz 30 Lengkap (An-Naba s.d An-Nas) & Surat Al-Mulk',
      tahfidzScore: Math.min(99, baseScore + 2),
      tahfidzPredicate: baseScore >= 88 ? 'Mumtaz (Istimewa)' : 'Jayyid Jiddan (Sangat Baik)',
      tajwidQuality: 'Makharijul huruf tartil, harakat dan mad terkontrol dengan baik.',
      characterValues: {
        adabDanAkhlak: 'A',
        kedisiplinan: 'A',
        kebersihanKerapian: baseScore > 85 ? 'A' : 'B',
        keaktifanIbadah: 'A'
      },
      attendance: {
        hadir: 88 + (idx % 6),
        sakit: (idx % 3),
        izin: (idx % 2),
        alpa: 0
      },
      teacherNotes: 'Alhamdulillah, ananda menunjukkan kesungguhan belajar, akhlak yang santun, dan peningkatan hafalan Al-Qur\'an yang membanggakan. Pertahankan kebiasaan shalat berjamaah dan muroja\'ah di rumah.',
      promotionStatus,
      promotedToClass: nextClassMap[student.classId] || 'Kelas Lanjutan',
      headmasterName: 'Ust. Ade Yusup, S.Pd.',
      headmasterTitle: 'Kepala MDTU Nurul Hidayah',
      waliKelasName: waliKelasMap[student.classId] || 'Ust. Ade Yusup, S.Pd.',
      updatedAt: '2026-06-20T10:00:00Z',
      updatedBy: 'Ust. Ade Yusup, S.Pd.'
    });
  });

  return reports;
}

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news_1',
    title: 'Pembukaan Pendaftaran Santri Baru (PPDB) MDTU Nurul Hidayah Tahun Ajaran 2026/2027',
    slug: 'pembukaan-ppdb-2026-2027',
    category: 'Pengumuman',
    summary: 'MDTU Nurul Hidayah Cigoong Sirnabaya secara resmi membuka pendaftaran santri baru dengan alur online dan langsung.',
    content: 'Alhamdulillah, dalam rangka menyongsong tahun ajaran baru 2026/2027, MDTU Nurul Hidayah Dusun Cigoong Desa Sirnabaya Kecamatan Rajadesa membuka penerimaan santri baru. Kurikulum menggabungkan pendalaman Al-Qur\'an tartil, aqidah akhlak, tata cara ibadah harian, serta pembiasaan sholat berjamaah. Orang tua dapat mendaftar langsung secara daring melalui portal website atau datang ke kantor madrasah setiap sore hari.',
    imageUrl: '/src/assets/images/hero_madrasah_building_1792550359080.jpg',
    author: 'Ust. Ade Yusup, S.Pd.',
    publishedAt: '2026-05-01',
    isPublished: true,
    views: 142
  },
  {
    id: 'news_2',
    title: 'Semarak Khataman Tahfidz Juz 30 dan Uji Tasmi’ Al-Qur’an Santri',
    slug: 'semarak-khataman-tahfidz-juz-30',
    category: 'Kegiatan',
    summary: 'Sebanyak santriwan dan santriwati MDTU Nurul Hidayah mengikuti tasmi’ hafalan sekali duduk di hadapan dewan guru dan wali santri.',
    content: 'Kegiatan tasmi’ Al-Qur’an juz 30 merupakan salah satu agenda tahunan unggulan di MDTU Nurul Hidayah. Para santri melantunkan ayat suci Al-Qur’an secara tartil, menghafal surat An-Naba hingga An-Nas dengan tajwid yang sahih. Acara ini disaksikan dengan haru oleh orang tua/wali santri.',
    imageUrl: '/src/assets/images/activity_tahfidz_quran_1792550360058.jpg',
    author: 'Ust. Azmi M Nurjamil',
    publishedAt: '2026-04-20',
    isPublished: true,
    views: 98
  },
  {
    id: 'news_3',
    title: 'Latihan Gabungan Kepanduan Pramuka Santri Madrasah Ciamis',
    slug: 'latihan-gabungan-pramuka-santri',
    category: 'Kegiatan',
    summary: 'Santri kelas 3 dan 4 antusias mengikuti latihan kepanduan dan ketangkasan di halaman madrasah Dusun Cigoong.',
    content: 'Pendidikan karakter di MDTU Nurul Hidayah tidak hanya terbatas di ruang kelas, tetapi juga diasah melalui kepanduan Pramuka Santri. Melalui kegiatan ini, santri diajarkan kemandirian, kedisiplinan, kerjasama tim, dan cinta tanah air yang selaras dengan nilai-nilai akhlakul karimah.',
    imageUrl: '/src/assets/images/activity_pramuka_santri_1792550360800.jpg',
    author: 'Usth. Fitri Hermawati',
    publishedAt: '2026-04-10',
    isPublished: true,
    views: 76
  }
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'anc_1',
    title: 'Pemberitahuan Pelaksanaan Sholat Dhuha Berjamaah Sore Hari',
    content: 'Dihimbau kepada seluruh santri untuk membawa perlengkapan sholat bersih setiap hari dan berwudhu sebelum bel madrasah berbunyi.',
    targetRole: 'Semua',
    authorName: 'Ust. Ade Yusup, S.Pd.',
    publishedAt: '2026-05-10',
    isUrgent: false
  },
  {
    id: 'anc_2',
    title: 'Batas Konfirmasi Pembayaran SPP Bulan Mei 2026',
    content: 'Kepada para orang tua/wali santri, konfirmasi pembayaran SPP dan laporan bukti transfer dapat dilakukan via Portal Orang Tua sebelum tanggal 15 setiap bulannya.',
    targetRole: 'OrangTua',
    authorName: 'Bendahara Madrasah',
    publishedAt: '2026-05-08',
    isUrgent: true
  },
  {
    id: 'anc_3',
    title: 'Evaluasi Hafalan Surat Pendek Kelas 1 (Ula A)',
    content: 'Bapak/Ibu wali santri kelas 1 dimohon mendampingi muraja’ah ananda di rumah untuk surat Al-Kafirun dan An-Nashr.',
    targetRole: 'KelasTertentu',
    targetClassId: 'class_1',
    authorName: 'Usth. Siti Saadah, S.Pd.',
    publishedAt: '2026-05-15',
    isUrgent: false
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal_1',
    title: 'Gedung dan Halaman MDTU Nurul Hidayah Cigoong',
    category: 'Sarana & Prasarana',
    imageUrl: '/src/assets/images/hero_madrasah_building_1792550359080.jpg',
    caption: 'Suasana asri dan tenang lingkungan madrasah di Kp. Dukuh Sari, Sirnabaya.',
    date: '2026-05-01'
  },
  {
    id: 'gal_2',
    title: 'Halaqah Tahfidz & Bimbingan Tartil Al-Qur’an',
    category: 'Kegiatan Belajar',
    imageUrl: '/src/assets/images/activity_tahfidz_quran_1792550360058.jpg',
    caption: 'Santri tekun menyimak bacaan tajwid di atas rehal kayu dengan bimbingan ustadz.',
    date: '2026-04-22'
  },
  {
    id: 'gal_3',
    title: 'Pendidikan Kepanduan & Pramuka Santri',
    category: 'Ekstrakurikuler',
    imageUrl: '/src/assets/images/activity_pramuka_santri_1792550360800.jpg',
    caption: 'Keceriaan dan kekompakan santri dalam baris-berbaris dan permainan edukatif.',
    date: '2026-04-15'
  },
  {
    id: 'gal_4',
    title: 'Ruang Belajar & Perpustakaan Madrasah',
    category: 'Sarana & Prasarana',
    imageUrl: '/src/assets/images/hero_madrasah_building_1792550359080.jpg',
    caption: 'Fasilitas ruang belajar yang tertib, bersih, dan nyaman bagi santri menuntut ilmu diniyah.',
    date: '2026-04-05'
  }
];

export const INITIAL_ADMISSIONS: AdmissionApplicant[] = [
  {
    id: 'adm_1',
    regNumber: 'PPDB-2026-001',
    fullName: 'Raffasya Al-Hafidz',
    gender: 'L',
    birthPlace: 'Ciamis',
    birthDate: '2019-03-12',
    address: 'Kp. Dukuh Sari RT 02 RW 01 Desa Sirnabaya, Rajadesa',
    previousSchool: 'RA Al-Ikhlas Sirnabaya',
    targetClassId: 'class_1',
    parentName: 'Bapak Rahmat Hidayat',
    parentPhone: '081234998811',
    parentRelationship: 'Ayah',
    status: 'Sedang Diverifikasi',
    notes: 'Berkas KK dan Akta sudah lengkap diunggah.',
    registeredAt: '2026-05-10T09:30:00Z',
    isConvertedToStudent: false
  },
  {
    id: 'adm_2',
    regNumber: 'PPDB-2026-002',
    fullName: 'Nafisah Syakira',
    gender: 'P',
    birthPlace: 'Ciamis',
    birthDate: '2019-07-25',
    address: 'Dusun Cigoong RT 01 RW 01 Desa Sirnabaya, Rajadesa',
    previousSchool: 'TK Mawar Sirnabaya',
    targetClassId: 'class_1',
    parentName: 'Ibu Nani Suryani',
    parentPhone: '081234998822',
    parentRelationship: 'Ibu',
    status: 'Diterima',
    notes: 'Lolos verifikasi berkas dan wawancara dasar.',
    registeredAt: '2026-05-08T11:20:00Z',
    isConvertedToStudent: false
  },
  {
    id: 'adm_3',
    regNumber: 'PPDB-2026-003',
    fullName: 'Azka Maulana Malik',
    gender: 'L',
    birthPlace: 'Ciamis',
    birthDate: '2019-01-18',
    address: 'Desa Sirnabaya RT 03 RW 02 Rajadesa',
    previousSchool: 'PAUD Nurul Amal',
    targetClassId: 'class_1',
    parentName: 'Bapak Gunawan',
    parentPhone: '081234998833',
    parentRelationship: 'Ayah',
    status: 'Diajukan',
    notes: 'Menunggu penyerahan pas foto fisik.',
    registeredAt: '2026-05-16T14:15:00Z',
    isConvertedToStudent: false
  }
];

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg_1',
    senderName: 'H. Sudirman',
    senderPhone: '081234009988',
    senderEmail: 'sudirman.ciamis@gmail.com',
    subject: 'Konsultasi Pendaftaran Santri Pindahan Kelas 2',
    message: 'Assalamu’alaikum Ust. Ade, mohon info apakah kelas 2 MDTU Nurul Hidayah masih menerima santri pindahan dari luar kecamatan untuk semester ganjil mendatang? Jazakallahu khair.',
    sentAt: '2026-05-14T10:00:00Z',
    isRead: false
  },
  {
    id: 'msg_2',
    senderName: 'Ibu Wartini',
    senderPhone: '085311223344',
    senderEmail: 'wartini77@yahoo.com',
    subject: 'Jadwal Masuk Madrasah Sore Hari',
    message: 'Assalamu’alaikum, mau tanya jam berapa biasanya santri kelas 1 mulai masuk madrasah di sore hari? Terima kasih.',
    sentAt: '2026-05-12T15:30:00Z',
    isRead: true,
    replyNotes: 'Sudah dihubungi via WhatsApp, jam masuk sore pukul 14:00 - 16:30 WIB.'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log_1',
    userName: 'Ust. Ade Yusup, S.Pd.',
    userRole: 'admin',
    action: 'SYSTEM_INITIALIZE',
    details: 'Sistem Informasi MDTU Nurul Hidayah berhasil diinisialisasi dengan data 4 kelas dan 40 santri.',
    timestamp: '2026-05-01T08:00:00Z'
  },
  {
    id: 'log_2',
    userName: 'Usth. Siti Saadah, S.Pd.',
    userRole: 'teacher',
    action: 'ATTENDANCE_RECORD',
    details: 'Pengisian absensi harian Kelas 1 (Ula A) selesai.',
    timestamp: '2026-05-20T16:05:00Z'
  },
  {
    id: 'log_3',
    userName: 'Ust. Ade Yusup, S.Pd.',
    userRole: 'admin',
    action: 'PAYMENT_VERIFIED',
    details: 'Verifikasi pembayaran SPP santri berhasil dikonfirmasi.',
    timestamp: '2026-05-20T10:15:00Z'
  }
];

export function createDefaultDatabaseState(): DatabaseState {
  const { users, parents, students } = generateInitialUsersAndEntities();
  const { bills, reports, receipts, auditLogs } = generateInitialBillsAndFinances(students, parents);
  const attendance = generateInitialAttendance(students);
  const academicNotes = generateInitialGrades(students);
  const reportCards = generateInitialReportCards(students, INITIAL_TEACHERS);

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
    activityLogs: INITIAL_ACTIVITY_LOGS,
    reportCards
  };
}
