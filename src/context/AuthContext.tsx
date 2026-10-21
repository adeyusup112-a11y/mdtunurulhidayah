import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, TeacherProfile, ParentProfile, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  teacherProfile: TeacherProfile | null;
  parentProfile: ParentProfile | null;
  selectedChildId: string | null;
  setSelectedChildId: (id: string) => void;
  login: (identifier: string, passwordPlain: string, role: UserRole) => { success: boolean; message: string };
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; message: string };
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'mdtu_auth_session_v1';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.userId && parsed.role) {
          const res = storageService.authenticate(parsed.userId, parsed.passwordHash, parsed.role);
          if (res.success && res.user) {
            setCurrentUser(res.user);
            setCurrentRole(res.user.role);
            setTeacherProfile(res.teacher || null);
            setParentProfile(res.parent || null);
            if (res.parent && res.parent.studentIds.length > 0) {
              setSelectedChildId(res.parent.studentIds[0]);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Session restore error:', e);
    }
  }, []);

  const login = (identifier: string, passwordPlain: string, role: UserRole) => {
    const res = storageService.authenticate(identifier, passwordPlain, role);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setCurrentRole(res.user.role);
      setTeacherProfile(res.teacher || null);
      setParentProfile(res.parent || null);
      if (res.parent && res.parent.studentIds.length > 0) {
        setSelectedChildId(res.parent.studentIds[0]);
      }

      // Persist session
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          userId: res.user.id,
          passwordHash: res.user.passwordHash,
          role: res.user.role
        })
      );

      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setTeacherProfile(null);
    setParentProfile(null);
    setSelectedChildId(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const changePassword = (oldPassword: string, newPassword: string) => {
    if (!currentUser) return { success: false, message: 'Tidak ada sesi aktif.' };
    const res = storageService.changePassword(currentUser.id, oldPassword, newPassword);
    if (res.success) {
      // update stored session
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          userId: currentUser.id,
          passwordHash: newPassword,
          role: currentUser.role
        })
      );
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        teacherProfile,
        parentProfile,
        selectedChildId,
        setSelectedChildId,
        login,
        logout,
        changePassword,
        isLoggedIn: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
