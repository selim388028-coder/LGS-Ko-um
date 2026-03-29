import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Clock, User, Mail, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface PaymentNotification {
  id: string;
  userId: string;
  userEmail: string;
  senderName: string;
  paymentDate: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export default function Admin() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'admin') return;

    const q = query(collection(db, 'payment_notifications'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentNotification[];
      setNotifications(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  const handleApprove = async (notification: PaymentNotification) => {
    try {
      // 1. Update user's premium status
      await updateDoc(doc(db, 'users', notification.userId), {
        isPremium: true
      });

      // 2. Update notification status
      await updateDoc(doc(db, 'payment_notifications', notification.id), {
        status: 'approved',
        updatedAt: serverTimestamp()
      });

      alert('Ödeme onaylandı ve üyelik aktif edildi.');
    } catch (error) {
      console.error(error);
      alert('Onaylama sırasında bir hata oluştu.');
    }
  };

  const handleReject = async (notificationId: string) => {
    if (!window.confirm('Bu ödemeyi reddetmek istediğinize emin misiniz?')) return;

    try {
      await updateDoc(doc(db, 'payment_notifications', notificationId), {
        status: 'rejected',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error(error);
      alert('Reddetme sırasında bir hata oluştu.');
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <ShieldCheck className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Yetkisiz Erişim</h1>
          <p className="text-slate-500">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Admin Paneli</h1>
          <p className="text-slate-500">Ödeme bildirimlerini yönetin ve onaylayın.</p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Yönetici Modu
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Bekleyen Bildirim Yok</h3>
            <p className="text-slate-500">Şu an onay bekleyen herhangi bir ödeme bildirimi bulunmuyor.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Kullanıcı</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{notif.userEmail}</p>
                      <p className="text-xs text-slate-500">ID: {notif.userId.substring(0, 8)}...</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Gönderen</p>
                  <p className="text-sm font-bold text-slate-800">{notif.senderName}</p>
                  <p className="text-xs text-slate-500">Tarih: {notif.paymentDate}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tutar</p>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CreditCard className="w-4 h-4" />
                    {notif.amount}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Bildirim Zamanı</p>
                  <p className="text-xs text-slate-500">
                    {notif.createdAt?.toDate().toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleReject(notif.id)}
                  className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reddet
                </button>
                <button
                  onClick={() => handleApprove(notif)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Onayla
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
