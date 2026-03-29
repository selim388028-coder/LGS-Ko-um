import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { User, Target, Trophy, LogOut, CheckCircle2, Loader2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user, profile, logout, loading: authLoading, repairProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showUnlockAll, setShowUnlockAll] = useState(false);

  const isAdmin = profile?.role === 'admin' || 
                  profile?.email?.toLowerCase() === 'selim388028@gmail.com' ||
                  user?.email?.toLowerCase() === 'selim388028@gmail.com';

  const [formData, setFormData] = useState({
    displayName: '',
    targetHighSchool: '',
    dailyGoal: 50
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        targetHighSchool: profile.targetHighSchool || '',
        dailyGoal: profile.dailyGoal || 50
      });
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        targetHighSchool: formData.targetHighSchool,
        dailyGoal: Number(formData.dailyGoal)
      });
      setSuccess(true);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setError('Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePremium = async () => {
    if (!user || !profile) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isPremium: !profile.isPremium
      });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError('Premium durumu güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRepair = async () => {
    setLoading(true);
    try {
      await repairProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Profil Bulunamadı</h2>
        <p className="text-slate-500 mb-6">Hesap bilgilerine ulaşılamadı. Lütfen tekrar giriş yapmayı dene veya profilini onarmayı dene.</p>
        <div className="space-y-3">
          <button 
            onClick={handleRepair}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Profili Onar
          </button>
          <button 
            onClick={() => logout()}
            className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
          <User className="w-16 h-16" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-3xl font-black text-slate-900">{profile.displayName}</h1>
            {isAdmin && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Yönetici
              </span>
            )}
            {profile.isPremium && (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Premium
              </span>
            )}
          </div>
          <p className="text-slate-500">{profile.email}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Target className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-600">{profile.targetHighSchool}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Trophy className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-600">Hedef: {profile.dailyGoal} Soru/Gün</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {isAdmin && (
            <NavLink 
              to="/admin"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <ShieldCheck className="w-5 h-5" />
              Admin Paneli
            </NavLink>
          )}
          <button 
            onClick={handleTogglePremium}
            disabled={loading}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm",
              profile.isPremium 
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-100 hover:shadow-amber-200"
            )}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {profile.isPremium ? 'Premium İptal Et' : 'Premium Aktif Et'}
          </button>
          <button 
            onClick={() => logout()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Profil Bilgilerini Düzenle</h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 font-bold hover:underline"
            >
              Düzenle
            </button>
          )}
        </div>

        <div className="p-8">
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm flex items-center gap-2 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              Profil başarıyla güncellendi!
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm flex items-center gap-2 border border-rose-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ad Soyad</label>
                <input 
                  type="text"
                  disabled={!isEditing}
                  className={cn(
                    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none",
                    !isEditing && "opacity-60 cursor-not-allowed"
                  )}
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Hedef Lise</label>
                <input 
                  type="text"
                  disabled={!isEditing}
                  className={cn(
                    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none",
                    !isEditing && "opacity-60 cursor-not-allowed"
                  )}
                  value={formData.targetHighSchool}
                  onChange={(e) => setFormData({...formData, targetHighSchool: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Günlük Soru Hedefi</label>
                <input 
                  type="number"
                  disabled={!isEditing}
                  className={cn(
                    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none",
                    !isEditing && "opacity-60 cursor-not-allowed"
                  )}
                  value={formData.dailyGoal}
                  onChange={(e) => setFormData({...formData, dailyGoal: Number(e.target.value)})}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Değişiklikleri Kaydet
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  İptal
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
