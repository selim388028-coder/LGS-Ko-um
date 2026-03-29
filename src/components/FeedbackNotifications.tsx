import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, MessageSquare, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function FeedbackNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Listen for feedbacks
    const qFeedbacks = query(
      collection(db, 'feedbacks'),
      where('userId', '==', user.uid),
      where('status', '==', 'replied'),
      orderBy('repliedAt', 'desc')
    );

    // Listen for general notifications
    const qNotifications = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );

    const unsubFeedbacks = onSnapshot(qFeedbacks, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, type: 'feedback', ...doc.data() }));
      setNotifications(prev => [...prev.filter(n => n.type !== 'feedback'), ...docs]);
    });

    const unsubNotifications = onSnapshot(qNotifications, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, type: 'notification', ...doc.data() }));
      setNotifications(prev => [...prev.filter(n => n.type !== 'notification'), ...docs]);
    });

    return () => {
      unsubFeedbacks();
      unsubNotifications();
    };
  }, [user]);

  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  const markAsRead = async (id: string, type: string) => {
    if (type === 'notification') {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all",
          isOpen && "text-indigo-600 bg-indigo-50"
        )}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Geri Bildirim Yanıtları
                </h3>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto p-2 space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} 
                    onClick={() => markAsRead(n.id, n.type)}
                    className={cn(
                    "p-3 rounded-xl border space-y-2 cursor-pointer transition-colors",
                    n.type === 'feedback' 
                      ? "bg-indigo-50/50 border-indigo-100/50 hover:bg-indigo-50" 
                      : "bg-emerald-50/50 border-emerald-100/50 hover:bg-emerald-50"
                  )}>
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                        n.type === 'feedback' ? "bg-indigo-100" : "bg-emerald-100"
                      )}>
                        {n.type === 'feedback' ? (
                          <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                        ) : (
                          <Bell className="w-3 h-3 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {n.type === 'feedback' ? 'Geri Bildirim Yanıtı' : n.title}
                        </p>
                        {n.type === 'feedback' ? (
                          <p className="text-xs text-slate-600 line-clamp-1 italic">"{n.message}"</p>
                        ) : (
                          <p className="text-xs text-slate-800 font-medium">{n.message}</p>
                        )}
                      </div>
                    </div>
                    {n.type === 'feedback' && (
                      <div className="pl-8">
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Kurucu Yanıtı:</p>
                        <p className="text-xs text-slate-800 font-medium">{n.reply}</p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          {n.repliedAt?.toDate().toLocaleString('tr-TR')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
