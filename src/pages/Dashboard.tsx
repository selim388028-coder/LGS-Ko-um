import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Target, TrendingUp, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const { profile, mockExams, studyPlan, mistakes, toggleTaskCompleted } = useAppContext();

  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = studyPlan.filter(task => task.date === today);
  const completedTasks = todaysTasks.filter(t => t.isCompleted).length;
  const progress = todaysTasks.length > 0 ? (completedTasks / todaysTasks.length) * 100 : 0;

  const chartData = mockExams.map(exam => ({
    name: exam.name,
    net: exam.totalNet
  })).slice(-5); // Son 5 deneme

  const unresolvedMistakes = mistakes.filter(m => !m.isResolved).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Merhaba, {profile?.name}! 👋</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
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
              <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
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
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
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
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
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
          <button className="w-full py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">
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
