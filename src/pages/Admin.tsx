import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Clock, User, Mail, Calendar, CreditCard, ShieldCheck, MessageSquare, Send } from 'lucide-react';
import { cn } from '../lib/utils';

interface PaymentNotification {
  id: string;
  userId: string;
  userEmail: string;
  senderName: string;
  paymentDate: string;
  amount: string;
  planName?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  isPremium: boolean;
  planName?: string;
  premiumExpiry?: string;
  createdAt: string;
}

interface Feedback {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  message: string;
  reply?: string;
  status: 'pending' | 'replied';
  createdAt: any;
  repliedAt?: any;
}

export default function Admin() {
  const { profile, user } = useAuth();
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState<'notifications' | 'users' | 'feedbacks'>('notifications');
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const isAdmin = profile?.role === 'admin' || 
                  profile?.email?.toLowerCase() === 'selim388028@gmail.com' ||
                  user?.email?.toLowerCase() === 'selim388028@gmail.com';

  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);

    // Listen for notifications
    const qNotif = query(collection(db, 'payment_notifications'), where('status', '==', 'pending'));
    const unsubscribeNotif = onSnapshot(qNotif, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentNotification[];
      setNotifications(docs);
      if (activeTab === 'notifications') setLoading(false);
    });

    // Listen for users
    const qUsers = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserData[];
      setUsers(docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      if (activeTab === 'users') setLoading(false);
    });

    // Listen for feedbacks
    const qFeedbacks = collection(db, 'feedbacks');
    const unsubscribeFeedbacks = onSnapshot(qFeedbacks, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Feedback[];
      setFeedbacks(docs.sort((a, b) => b.createdAt?.toDate().getTime() - a.createdAt?.toDate().getTime()));
      if (activeTab === 'feedbacks') setLoading(false);
    });

    return () => {
      unsubscribeNotif();
      unsubscribeUsers();
      unsubscribeFeedbacks();
    };
  }, [isAdmin, activeTab]);

  const handleApprove = async (notification: PaymentNotification) => {
    try {
      // 1. Get current user data to check for existing expiry
      const userDoc = await getDoc(doc(db, 'users', notification.userId));
      const userData = userDoc.data();
      
      let newExpiry = new Date();
      
      // If user is already premium and has an expiry date in the future, extend it
      if (userData?.isPremium && userData?.premiumExpiry) {
        const currentExpiry = new Date(userData.premiumExpiry);
        const now = new Date();
        
        // Use the later of (now) or (currentExpiry) to start the 30-day addition
        const baseDate = currentExpiry > now ? currentExpiry : now;
        newExpiry = new Date(baseDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      } else {
        // New subscription starts now for 30 days
        newExpiry = new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000));
      }

      // 2. Update user's premium status and expiry
      await updateDoc(doc(db, 'users', notification.userId), {
        isPremium: true,
        premiumExpiry: newExpiry.toISOString(),
        planName: notification.planName || "Kazananlar Planı"
      });

      // 3. Update notification status
      await updateDoc(doc(db, 'payment_notifications', notification.id), {
        status: 'approved',
        updatedAt: serverTimestamp()
      });

      // 4. Create notification for user
      await addDoc(collection(db, 'notifications'), {
        userId: notification.userId,
        title: 'Premium Üyeliğin Onaylandı!',
        message: 'Ödemen onaylandı ve Premium özelliklerin aktif edildi. İyi çalışmalar!',
        type: 'premium_approved',
        isRead: false,
        createdAt: serverTimestamp()
      });

      alert('Ödeme onaylandı ve üyelik süresi uzatıldı.');
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

  const handleReplyFeedback = async (feedbackId: string) => {
    const reply = replyText[feedbackId];
    if (!reply?.trim()) return;

    try {
      await updateDoc(doc(db, 'feedbacks', feedbackId), {
        reply: reply.trim(),
        status: 'replied',
        repliedAt: serverTimestamp()
      });
      setReplyText(prev => ({ ...prev, [feedbackId]: '' }));
      alert('Cevap gönderildi.');
    } catch (error) {
      console.error(error);
      alert('Cevap gönderilirken bir hata oluştu.');
    }
  };

  if (!isAdmin) {
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
          <p className="text-slate-500">Ödeme bildirimlerini yönetin ve kullanıcıları takip edin.</p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Yönetici Modu
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-xl mb-8 w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('notifications')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'notifications' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Clock className="w-4 h-4" />
          Bildirimler ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'users' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <User className="w-4 h-4" />
          Kullanıcılar ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('feedbacks')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'feedbacks' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          Geri Bildirimler ({feedbacks.filter(f => f.status === 'pending').length})
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'notifications' ? (
          notifications.length === 0 ? (
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
                        <p className="text-xs text-slate-500">{notif.planName || "Kazananlar Planı"}</p>
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
          )
        ) : activeTab === 'users' ? (
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kullanıcı</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Bitiş Tarihi</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kayıt Tarihi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user) => (
                    <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                            {user.displayName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{user.displayName}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isPremium ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Premium
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Standart
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.planName || (user.isPremium ? "Kazananlar Planı" : "-")}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.premiumExpiry ? new Date(user.premiumExpiry).toLocaleDateString('tr-TR') : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Geri Bildirim Yok</h3>
                <p className="text-slate-500">Henüz herhangi bir geri bildirim veya öneri gönderilmemiş.</p>
              </div>
            ) : (
              feedbacks.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                        {f.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{f.userName}</p>
                        <p className="text-xs text-slate-500">{f.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{f.createdAt?.toDate().toLocaleString('tr-TR')}</p>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                        f.status === 'pending' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                      )}>
                        {f.status === 'pending' ? 'Bekliyor' : 'Cevaplandı'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                    <p className="text-slate-700 text-sm italic">"{f.message}"</p>
                  </div>

                  {f.reply ? (
                    <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Cevabın:</p>
                      <p className="text-indigo-900 text-sm">{f.reply}</p>
                      <p className="text-[10px] text-indigo-400 mt-2">{f.repliedAt?.toDate().toLocaleString('tr-TR')}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
                        placeholder="Cevabınızı yazın..."
                        rows={3}
                        value={replyText[f.id] || ''}
                        onChange={(e) => setReplyText(prev => ({ ...prev, [f.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => handleReplyFeedback(f.id)}
                        disabled={!replyText[f.id]?.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-sm transition-all ml-auto"
                      >
                        <Send className="w-4 h-4" />
                        Cevapla
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
