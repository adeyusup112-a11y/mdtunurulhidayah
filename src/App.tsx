import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { storageService } from './services/storageService';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/public/HomePage';
import { ProfilePage } from './pages/public/ProfilePage';
import { VisiMisiPage } from './pages/public/VisiMisiPage';
import { GuruPage } from './pages/public/GuruPage';
import { JadwalPage } from './pages/public/JadwalPage';
import { BeritaPage } from './pages/public/BeritaPage';
import { PPDBPage } from './pages/public/PPDBPage';
import { GaleriPage } from './pages/public/GaleriPage';
import { KontakPage } from './pages/public/KontakPage';
import { PortalGatewayPage } from './pages/portal/PortalGatewayPage';
import { TeacherDashboard } from './pages/portal/teacher/TeacherDashboard';
import { ParentDashboard } from './pages/portal/parent/ParentDashboard';
import { AdminDashboard } from './pages/portal/admin/AdminDashboard';
import { NewsItem, UserRole } from './types';

const VALID_TABS = ['beranda', 'profil', 'visi-misi', 'guru', 'jadwal', 'berita', 'ppdb', 'galeri', 'kontak', 'portal'];

function getInitialTab(): string {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (VALID_TABS.includes(hash)) {
      return hash;
    }
  }
  return 'beranda';
}

function MainAppContent() {
  const { currentUser, currentRole } = useAuth();
  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [portalDefaultRole, setPortalDefaultRole] = useState<UserRole | undefined>(undefined);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Core data states for reactivity
  const [settings, setSettings] = useState(storageService.getSiteSettings());
  const [news, setNews] = useState(storageService.getNews());
  const [announcements, setAnnouncements] = useState(storageService.getAnnouncements());
  const [gallery, setGallery] = useState(storageService.getGallery());
  const [teachers, setTeachers] = useState(storageService.getTeachers());
  const [schedules, setSchedules] = useState(storageService.getSchedules());
  const [classes, setClasses] = useState(storageService.getClasses());

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  const refreshPublicData = () => {
    setSettings(storageService.getSiteSettings());
    setNews(storageService.getNews());
    setAnnouncements(storageService.getAnnouncements());
    setGallery(storageService.getGallery());
    setTeachers(storageService.getTeachers());
    setSchedules(storageService.getSchedules());
    setClasses(storageService.getClasses());
  };

  useEffect(() => {
    refreshPublicData();
    const unsub = storageService.subscribe(() => refreshPublicData());

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim().toLowerCase();
      if (VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      unsub();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // When user logs in, automatically switch activeTab to 'portal'
  useEffect(() => {
    if (currentUser) {
      setActiveTab('portal');
    }
  }, [currentUser]);

  const handleOpenPortal = (role?: UserRole) => {
    setPortalDefaultRole(role);
    setActiveTab('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNews = (item: NewsItem | null) => {
    setSelectedNews(item);
    if (item && activeTab !== 'berita') {
      setActiveTab('berita');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setPortalDefaultRole(undefined);
        }}
        onOpenPortal={handleOpenPortal}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'portal' ? (
          currentUser ? (
            currentRole === 'admin' ? (
              <AdminDashboard />
            ) : currentRole === 'teacher' ? (
              <TeacherDashboard />
            ) : (
              <ParentDashboard />
            )
          ) : (
            <PortalGatewayPage
              onNavigatePublic={(tab) => setActiveTab(tab)}
              defaultRole={portalDefaultRole}
            />
          )
        ) : activeTab === 'beranda' ? (
          <HomePage
            settings={settings}
            news={news}
            gallery={gallery}
            teachers={teachers}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenPortal={handleOpenPortal}
            onSelectNews={handleSelectNews}
          />
        ) : activeTab === 'profil' ? (
          <ProfilePage settings={settings} />
        ) : activeTab === 'visi-misi' ? (
          <VisiMisiPage settings={settings} />
        ) : activeTab === 'guru' ? (
          <GuruPage teachers={teachers} />
        ) : activeTab === 'jadwal' ? (
          <JadwalPage settings={settings} schedules={schedules} classes={classes} teachers={teachers} />
        ) : activeTab === 'berita' ? (
          <BeritaPage
            news={news}
            announcements={announcements}
            selectedNews={selectedNews}
            onSelectNews={setSelectedNews}
          />
        ) : activeTab === 'ppdb' ? (
          <PPDBPage settings={settings} onRefreshData={refreshPublicData} />
        ) : activeTab === 'galeri' ? (
          <GaleriPage gallery={gallery} />
        ) : activeTab === 'kontak' ? (
          <KontakPage settings={settings} />
        ) : (
          <HomePage
            settings={settings}
            news={news}
            gallery={gallery}
            teachers={teachers}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenPortal={handleOpenPortal}
            onSelectNews={handleSelectNews}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPortal={handleOpenPortal}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
