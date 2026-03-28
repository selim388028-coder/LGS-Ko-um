import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle2, Circle, Plus, Calendar as CalendarIcon, Clock, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { StudyTask, Subject } from '../types';
import { GoogleGenAI } from '@google/genai';
import PremiumPaywall from '../components/PremiumPaywall';

const SUBJECTS: Subject[] = [
  "Türkçe",
  "Matematik",
  "Fen Bilimleri",
  "T.C. İnkılap Tarihi ve Atatürkçülük",
  "Din Kültürü ve Ahlak Bilgisi",
  "Yabancı Dil"
];

export default function StudyPlan() {
  const { studyPlan, addStudyTask, toggleTaskCompleted, replaceStudyPlan, profile, mistakes } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  const [newTask, setNewTask] = useState<Partial<StudyTask>>({
    date: selectedDate,
    subject: "Matematik",
    type: "Soru Çözümü",
    durationMinutes: 45,
    topic: ""
  });

  const tasksForSelectedDate = studyPlan.filter(t => t.date === selectedDate);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.topic && newTask.subject && newTask.type && newTask.durationMinutes) {
      addStudyTask({
        id: Math.random().toString(36).substring(7),
        date: selectedDate,
        subject: newTask.subject as Subject,
        topic: newTask.topic,
        type: newTask.type as any,
        durationMinutes: newTask.durationMinutes,
        isCompleted: false
      });
      setIsAdding(false);
      setNewTask({ ...newTask, topic: "" });
    }
  };

  const handleGenerateAIPlan = async () => {
    if (!profile) return;
    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const unresolvedMistakes = mistakes.filter(m => !m.isResolved);
      const mistakeTopics = unresolvedMistakes.map(m => `${m.subject}: ${m.topic}`).join(', ');
      
      const prompt = `Sen bir LGS Koçusun. Öğrencinin adı ${profile.name}, hedefi ${profile.targetScore} puan. Zayıf olduğu dersler: ${profile.weakSubjects.join(', ')}. Çözemediği yanlış soru konuları: ${mistakeTopics || 'Yok'}.
      
Bu öğrenci için bugünden başlayarak önümüzdeki 7 gün için günlük bir çalışma planı oluştur. Her gün için 2-3 görev olsun. Görevler zayıf derslere ve yanlış yapılan konulara odaklansın.

DİKKAT: Sadece ve sadece aşağıdaki JSON formatında bir dizi (array) döndür. Başka hiçbir açıklama, markdown veya metin ekleme. Sadece JSON.

[
  {
    "date": "YYYY-MM-DD", // Bugünden başlayarak ardışık 7 gün
    "subject": "Türkçe" | "Matematik" | "Fen Bilimleri" | "T.C. İnkılap Tarihi ve Atatürkçülük" | "Din Kültürü ve Ahlak Bilgisi" | "Yabancı Dil",
    "topic": "Çalışılacak Konu Adı",
    "type": "Konu Çalışması" | "Soru Çözümü" | "Deneme",
    "durationMinutes": 45 // 30, 45 veya 60
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const generatedTasks = JSON.parse(response.text);
      const newPlan: StudyTask[] = generatedTasks.map((task: any) => ({
        ...task,
        id: Math.random().toString(36).substring(7),
        isCompleted: false
      }));

      replaceStudyPlan(newPlan);
    } catch (error) {
      console.error("AI Plan Generation Error:", error);
      alert("Plan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Generate next 7 days
  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  if (!profile?.isPremium) {
    return <PremiumPaywall featureName="Akıllı Çalışma Planı" />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Çalışma Planı</h1>
          <p className="text-slate-500">Günlük hedeflerini belirle ve takip et.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleGenerateAIPlan}
            disabled={isGeneratingAI}
            className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg font-bold hover:bg-amber-200 transition-colors disabled:opacity-50"
          >
            {isGeneratingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            AI ile Plan Oluştur
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Görev Ekle
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {nextDays.map(dateStr => {
          const date = new Date(dateStr);
          const isSelected = selectedDate === dateStr;
          const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' });
          const dayNum = date.getDate();
          
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex flex-col items-center justify-center min-w-[4rem] p-3 rounded-xl border transition-all ${
                isSelected 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
              }`}
            >
              <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                {dayName}
              </span>
              <span className="text-lg font-bold">{dayNum}</span>
            </button>
          );
        })}
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Yeni Görev Ekle</h3>
          <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ders</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newTask.subject}
                onChange={e => setNewTask({...newTask, subject: e.target.value as Subject})}
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Konu</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newTask.topic}
                onChange={e => setNewTask({...newTask, topic: e.target.value})}
                placeholder="Örn: Üslü İfadeler"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Çalışma Tipi</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newTask.type}
                onChange={e => setNewTask({...newTask, type: e.target.value as any})}
              >
                <option value="Konu Çalışması">Konu Çalışması</option>
                <option value="Soru Çözümü">Soru Çözümü</option>
                <option value="Deneme">Deneme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Süre (Dakika)</label>
              <input 
                type="number" 
                required min="5" step="5"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newTask.durationMinutes}
                onChange={e => setNewTask({...newTask, durationMinutes: Number(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                İptal
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-slate-500" />
          <h2 className="font-semibold text-slate-800">
            {new Date(selectedDate).toLocaleDateString('tr-TR', { weekday: 'long', month: 'long', day: 'numeric' })} Görevleri
          </h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {tasksForSelectedDate.length > 0 ? (
            tasksForSelectedDate.map(task => (
              <div key={task.id} className="p-4 sm:p-6 flex items-start sm:items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-start sm:items-center gap-4">
                  <button 
                    onClick={() => toggleTaskCompleted(task.id)}
                    className="mt-1 sm:mt-0 flex-shrink-0"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        task.subject === 'Matematik' ? 'bg-blue-100 text-blue-700' :
                        task.subject === 'Türkçe' ? 'bg-rose-100 text-rose-700' :
                        task.subject === 'Fen Bilimleri' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {task.subject}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.durationMinutes} dk
                      </span>
                    </div>
                    <h4 className={`text-lg font-medium ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.topic}
                    </h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <BookOpen className="w-4 h-4" /> {task.type}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">Görev Bulunamadı</h3>
              <p className="text-slate-500 max-w-sm">Bu tarih için henüz bir çalışma planlamadın. Yukarıdaki "Görev Ekle" butonunu kullanarak plan yapmaya başlayabilirsin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
