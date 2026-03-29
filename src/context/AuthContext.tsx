import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  targetHighSchool?: string;
  dailyGoal?: number;
  isPremium?: boolean;
  premiumExpiry?: string;
  planName?: string;
  isEmailVerified?: boolean;
  role?: 'admin' | 'user';
  verificationCode?: string;
  verificationCodeExpires?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  logout: () => Promise<void>;
  repairProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(`[AuthContext] onAuthStateChanged: ${user ? user.uid : 'null'}`);
      setUser(user);
      if (!user) {
        setProfile(null);
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Only set loading to true if we don't have a profile yet
    if (!profile) {
      console.log(`[AuthContext] Profile yükleniyor, loading: true`);
      setLoading(true);
    }
    
    const path = `users/${user.uid}`;
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), async (docSnap) => {
      console.log(`[AuthContext] Profile snapshot alındı: ${docSnap.exists() ? 'mevcut' : 'yok'}`);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        
        // Check if premium has expired
        if (data.isPremium && data.premiumExpiry) {
          const expiry = new Date(data.premiumExpiry);
          if (expiry < new Date()) {
            console.log(`[AuthContext] Premium süresi dolmuş, güncelleniyor...`);
            updateDoc(docSnap.ref, { isPremium: false });
            data.isPremium = false;
          }
        }
        
        setProfile(data);
        setLoading(false);
        setIsAuthReady(true);
      } else {
        // Auto-repair: Create profile if it doesn't exist
        console.log(`[AuthContext] Profil bulunamadı, oluşturuluyor...`);
        try {
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
            targetHighSchool: 'Belirlenmedi',
            dailyGoal: 50,
            isPremium: false,
            isEmailVerified: true,
            role: user.email?.toLowerCase() === 'selim388028@gmail.com' ? 'admin' : 'user',
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', user.uid), newProfile);
          // Snapshot will trigger again
        } catch (err) {
          console.error(`[AuthContext] Profil oluşturma hatası: ${err}`);
          setLoading(false);
          setIsAuthReady(true);
        }
      }
    }, (error) => {
      console.error(`[AuthContext] Profile snapshot hatası: ${error}`);
      setLoading(false);
      setIsAuthReady(true);
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (e) {
        // Silently catch the error thrown by handleFirestoreError to prevent app crash
        console.error('Handled Firestore error in AuthContext:', e);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const repairProfile = async () => {
    if (!user) return;
    setLoading(true);
    console.log(`[AuthContext] Profil tamiri başlatıldı...`);
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
          targetHighSchool: 'Belirlenmedi',
          dailyGoal: 50,
          isPremium: false,
          isEmailVerified: true,
          role: user.email?.toLowerCase() === 'selim388028@gmail.com' ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, newProfile);
        console.log(`[AuthContext] Profil başarıyla oluşturuldu.`);
      } else {
        console.log(`[AuthContext] Profil zaten mevcut.`);
        setProfile(docSnap.data() as UserProfile);
      }
    } catch (err) {
      console.error(`[AuthContext] Profil tamir hatası: ${err}`);
    } finally {
      setLoading(false);
      setIsAuthReady(true);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthReady, logout, repairProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
