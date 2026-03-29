import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  Bot, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  ShieldCheck,
  MessageSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { profile, user } = useAuth();
  const { mockExams, studyPlan, mistakes, toggleTaskCompleted } = useAppContext();
  const navigate = useNavigate();
  const [repliedFeedbacks, setRepliedFeedbacks] = useState<any[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = studyPlan.filter(task => task.date === today);
  const completedTasks = todaysTasks.filter(t => t.isCompleted).length;
  const progress = todaysTasks.length > 0 ? (completedTasks / todaysTasks.length) * 100 : 0;

  const chartData = mockExams.map(exam => ({
    name: exam.name,
    net: exam.totalNet
  })).slice(-5); // Son 5 deneme

  const unresolvedMistakes = mistakes.filter(m => !m.isResolved).length;
  const isAdmin = profile?.role === 'admin' || 
                  profile?.email?.toLowerCase() === 'selim388028@gmail.com' ||
                  user?.email?.toLowerCase() === 'selim388028@gmail.com';

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'feedbacks'),
      where('userId', '==', user.uid),
      where('status', '==', 'replied')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRepliedFeedbacks(docs);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="space-y-6">
      {isAdmin && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-900">Yönetici Erişimi Aktif</p>
              <p className="text-xs text-indigo-600">Ödeme bildirimlerini ve kullanıcıları yönetebilirsiniz.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-indigo-700 transition-all"
          >
            Admin Paneline Git
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {repliedFeedbacks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {repliedFeedbacks.map((f) => (
              <div key={f.id} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-900">Geri Bildirimin Cevaplandı!</p>
                    <p className="text-xs text-emerald-700 mt-1 font-medium italic">"{f.message}"</p>
                    <div className="mt-2 bg-white/50 rounded-xl p-3 border border-emerald-200/50">
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">Kurucu Cevabı:</p>
                      <p className="text-sm text-emerald-900">{f.reply}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Merhaba, {profile?.displayName}! 👋</h1>
            {profile?.isPremium && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                Premium
              </span>
            )}
          </div>
          <p className="text-slate-500">Bugün harika bir gün, hedeflerine bir adım daha yaklaş.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Target className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Hedef Lise</p>
            <p className="text-sm font-bold text-slate-900">{profile?.targetHighSchool}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-slate-800">Özet</h2>
        <button 
          onClick={() => navigate('/exams')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all group"
        >
          Denemeye Git
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Announcement Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target className="w-32 h-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-[10px] font-bold uppercase tracking-widest">Duyuru</span>
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
            </div>
            <h2 className="text-xl md:text-2xl font-black">Türkiye Geneli LGS 2026 Prova Denemesi</h2>
            <p className="text-indigo-100 text-sm md:text-base max-w-xl">
              Tüm Türkiye ile aynı anda prova denemesine katıl, eksiklerini gör ve sıralamanı öğren!
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 min-w-[140px]">
            <span className="text-xl font-black text-center">Devam Ediyor</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">7 Nisan'a Kadar</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'AI Koçum', icon: Bot, href: '/ai-coach', color: 'bg-indigo-50 text-indigo-600', hover: 'hover:bg-indigo-100' },
          { name: 'Canlı Çözüm', icon: Sparkles, href: '/ai-solver', color: 'bg-amber-50 text-amber-600', hover: 'hover:bg-amber-100' },
          { name: 'Yazılı Hazırlık', icon: FileText, href: '/school-exams', color: 'bg-emerald-50 text-emerald-600', hover: 'hover:bg-emerald-100' },
          { name: 'Mini Özetler', icon: BookOpen, href: '/summaries', color: 'bg-blue-50 text-blue-600', hover: 'hover:bg-blue-100' },
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.href)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border border-transparent transition-all hover:shadow-md",
              item.color,
              item.hover
            )}
          >
            <item.icon className="w-6 h-6 mb-2" />
            <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/plan')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-300 transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Günlük İlerleme
            </h3>
            <span className="text-sm font-medium text-slate-500">{completedTasks}/{todaysTasks.length} Görev</span>
          </div>
          <div className="relative pt-2">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100">
              <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 group-hover:bg-indigo-500"></div>
            </div>
            <p className="text-sm text-slate-600">
              {progress === 100 ? "Harika! Bugünün tüm görevlerini tamamladın." : "Bugün için planlanan görevlerini tamamlamaya devam et."}
            </p>
          </div>
        </motion.div>

        {/* Mock Exam Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/exams')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-emerald-300 transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Net Gelişimi
            </h3>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              Son {chartData.length} Deneme
            </span>
          </div>
          {chartData.length > 0 ? (
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-24 flex items-center justify-center text-sm text-slate-400">
              Henüz deneme girilmemiş.
            </div>
          )}
        </motion.div>

        {/* Mistakes Alert */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/mistakes')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-rose-300 transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Çözülmemiş Yanlışlar
            </h3>
            <span className="text-2xl font-bold text-rose-600">{unresolvedMistakes}</span>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Yanlış yaptığın soruları tekrar çözmek, netlerini artırmanın en kesin yoludur.
          </p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate('/mistakes');
            }}
            className="w-full py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors"
          >
            Yanlış Defterine Git
          </button>
        </motion.div>
      </div>

      {/* Today's Tasks List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Bugünün Görevleri</h2>
          <span className="text-sm text-slate-500">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {todaysTasks.length > 0 ? (
            todaysTasks.map(task => (
              <div key={task.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleTaskCompleted(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.isCompleted ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {task.isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                  <div>
                    <h4 className={`font-medium ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.subject} - {task.topic}
                    </h4>
                    <p className="text-sm text-slate-500">{task.type} • {task.durationMinutes} dk</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.type === 'Konu Çalışması' ? 'bg-blue-50 text-blue-600' :
                  task.type === 'Soru Çözümü' ? 'bg-amber-50 text-amber-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {task.type}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              Bugün için planlanmış bir görevin yok. Dinlenebilir veya yeni görev ekleyebilirsin!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
