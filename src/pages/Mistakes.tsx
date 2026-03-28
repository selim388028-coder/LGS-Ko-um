import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Subject, Mistake } from '../types';
import { BookX, Plus, CheckCircle2, Circle, Calendar, Tag, Image as ImageIcon, X, Bot } from 'lucide-react';
import PremiumPaywall from '../components/PremiumPaywall';

const SUBJECTS: Subject[] = [
  "Türkçe",
  "Matematik",
  "Fen Bilimleri",
  "T.C. İnkılap Tarihi ve Atatürkçülük",
  "Din Kültürü ve Ahlak Bilgisi",
  "Yabancı Dil"
];

export default function Mistakes() {
  const { mistakes, addMistake, toggleMistakeResolved, profile } = useAppContext();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  
  const [newMistake, setNewMistake] = useState<Partial<Mistake>>({
    date: new Date().toISOString().split('T')[0],
    subject: "Matematik",
    topic: "",
    notes: "",
    questionImage: ""
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG to save localStorage space
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setNewMistake(prev => ({ ...prev, questionImage: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMistake.subject && newMistake.topic && newMistake.notes) {
      addMistake({
        id: Math.random().toString(36).substring(7),
        date: newMistake.date || new Date().toISOString().split('T')[0],
        subject: newMistake.subject as Subject,
        topic: newMistake.topic,
        notes: newMistake.notes,
        questionImage: newMistake.questionImage,
        isResolved: false
      });
      setIsAdding(false);
      setNewMistake({ ...newMistake, topic: "", notes: "", questionImage: "" });
    }
  };

  if (!profile?.isPremium) {
    return <PremiumPaywall featureName="Yanlış Defteri" />;
  }

  const unresolvedMistakes = mistakes.filter(m => !m.isResolved);
  const resolvedMistakes = mistakes.filter(m => m.isResolved);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Yanlış Soru Defteri</h1>
          <p className="text-slate-500">Yanlışlarını öğrenme fırsatına çevir.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-700 transition-colors"
        >
          {isAdding ? 'İptal' : <><Plus className="w-5 h-5" /> Yanlış Ekle</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100">
          <div className="flex items-center gap-2 mb-6">
            <BookX className="w-6 h-6 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-800">Yeni Yanlış Kaydet</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ders</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  value={newMistake.subject}
                  onChange={e => setNewMistake({...newMistake, subject: e.target.value as Subject})}
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Konu</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  value={newMistake.topic}
                  onChange={e => setNewMistake({...newMistake, topic: e.target.value})}
                  placeholder="Örn: Çarpanlar ve Katlar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  value={newMistake.date}
                  onChange={e => setNewMistake({...newMistake, date: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Soru Fotoğrafı (İsteğe Bağlı)</label>
              {newMistake.questionImage ? (
                <div className="relative inline-block">
                  <img src={newMistake.questionImage} alt="Soru" className="h-32 rounded-lg border border-slate-200 object-cover" />
                  <button 
                    type="button"
                    onClick={() => setNewMistake({...newMistake, questionImage: ""})}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-slate-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-rose-400 focus:outline-none">
                  <span className="flex items-center space-x-2 text-slate-500">
                    <ImageIcon className="w-6 h-6" />
                    <span className="font-medium text-sm">Fotoğraf Çek veya Yükle</span>
                  </span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Doğru Çözüm / Notlar</label>
              <textarea 
                required
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                value={newMistake.notes}
                onChange={e => setNewMistake({...newMistake, notes: e.target.value})}
                placeholder="Bu soruyu neden yanlış yaptın? Doğru çözüm yolu nedir?"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="px-6 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
              >
                Deftere Ekle
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unresolved Mistakes */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Tekrar Edilecekler ({unresolvedMistakes.length})
          </h2>
          
          {unresolvedMistakes.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500">
              Harika! Tekrar etmen gereken yanlış soru yok.
            </div>
          ) : (
            <div className="space-y-3">
              {unresolvedMistakes.map(mistake => (
                <div key={mistake.id} className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100 hover:border-rose-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-1 bg-rose-50 text-rose-700 rounded uppercase tracking-wider">
                        {mistake.subject}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(mistake.date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleMistakeResolved(mistake.id)}
                        className="text-slate-400 hover:text-emerald-500 transition-colors flex items-center gap-1 text-sm font-medium"
                        title="Öğrendim olarak işaretle"
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-slate-400" /> {mistake.topic}
                  </h3>
                  
                  {mistake.questionImage && (
                    <div className="mb-3">
                      <img src={mistake.questionImage} alt="Yanlış Soru" className="w-full rounded-lg border border-slate-200" />
                    </div>
                  )}
                  
                  <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 border border-slate-100 mb-3">
                    {mistake.notes}
                  </div>

                  <button 
                    onClick={() => navigate('/ai-coach')}
                    className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Bot className="w-4 h-4" /> Bu Konuyu AI Koçuna Sor
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resolved Mistakes */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Öğrenilenler ({resolvedMistakes.length})
          </h2>
          
          {resolvedMistakes.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500">
              Henüz öğrenildi olarak işaretlediğin bir soru yok.
            </div>
          ) : (
            <div className="space-y-3">
              {resolvedMistakes.map(mistake => (
                <div key={mistake.id} className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded uppercase tracking-wider">
                        {mistake.subject}
                      </span>
                    </div>
                    <button 
                      onClick={() => toggleMistakeResolved(mistake.id)}
                      className="text-emerald-500 hover:text-slate-400 transition-colors"
                      title="Geri al"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-slate-600 mb-2 line-through decoration-slate-300">
                    {mistake.topic}
                  </h3>
                  
                  {mistake.questionImage && (
                    <div className="mb-3 opacity-60">
                      <img src={mistake.questionImage} alt="Yanlış Soru" className="w-full rounded-lg border border-slate-200 grayscale" />
                    </div>
                  )}
                  
                  <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-500 border border-slate-100">
                    {mistake.notes}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
