import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Subject, MockExam } from '../types';
import { Plus, Calculator, TrendingUp, Calendar, Target, Bot } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import AIAnalysisModal from '../components/AIAnalysisModal';
import PremiumPaywall from '../components/PremiumPaywall';

const SUBJECTS: { name: Subject; questionCount: number; coefficient: number }[] = [
  { name: "Türkçe", questionCount: 20, coefficient: 4 },
  { name: "Matematik", questionCount: 20, coefficient: 4 },
  { name: "Fen Bilimleri", questionCount: 20, coefficient: 4 },
  { name: "T.C. İnkılap Tarihi ve Atatürkçülük", questionCount: 10, coefficient: 1 },
  { name: "Din Kültürü ve Ahlak Bilgisi", questionCount: 10, coefficient: 1 },
  { name: "Yabancı Dil", questionCount: 10, coefficient: 1 }
];

export default function MockExams() {
  const { mockExams, addMockExam, profile } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedExamForAnalysis, setSelectedExamForAnalysis] = useState<MockExam | null>(null);
  
  const [scores, setScores] = useState<Record<Subject, { correct: number | ''; incorrect: number | '' }>>(
    SUBJECTS.reduce((acc, sub) => ({ ...acc, [sub.name]: { correct: '', incorrect: '' } }), {} as any)
  );

  const handleScoreChange = (subject: Subject, field: 'correct' | 'incorrect', value: number | '') => {
    setScores(prev => ({
      ...prev,
      [subject]: { ...prev[subject], [field]: value }
    }));
  };

  const calculateResults = () => {
    let totalNet = 0;
    let totalWeightedNet = 0;
    const finalScores: any = {};

    SUBJECTS.forEach(sub => {
      const correct = Number(scores[sub.name].correct) || 0;
      const incorrect = Number(scores[sub.name].incorrect) || 0;
      
      // Ensure correct + incorrect doesn't exceed question count
      const actualCorrect = Math.min(Math.max(0, correct), sub.questionCount);
      const actualIncorrect = Math.min(Math.max(0, incorrect), sub.questionCount - actualCorrect);

      const blank = sub.questionCount - actualCorrect - actualIncorrect;
      const net = Math.max(0, actualCorrect - (actualIncorrect / 3));
      
      finalScores[sub.name] = { correct: actualCorrect, incorrect: actualIncorrect, blank, net };
      totalNet += net;
      totalWeightedNet += net * sub.coefficient;
    });

    // Standard LGS Score Calculation (Approximate)
    // Base score is usually around 194.75
    // Multiplier is approximately 1.13 to reach 500
    const totalScore = Math.min(500, 194.75 + (totalWeightedNet * 1.1305));

    return { finalScores, totalNet, totalScore };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { finalScores, totalNet, totalScore } = calculateResults();
    
    addMockExam({
      id: Math.random().toString(36).substring(7),
      name: examName || `${mockExams.length + 1}. Deneme`,
      date: examDate,
      scores: finalScores,
      totalNet,
      totalScore
    });
    
    setIsAdding(false);
    setExamName("");
    // Reset scores
    setScores(SUBJECTS.reduce((acc, sub) => ({ ...acc, [sub.name]: { correct: '', incorrect: '' } }), {} as any));
  };

  if (!profile?.isPremium) {
    return <PremiumPaywall featureName="Deneme Takibi" />;
  }

  const chartData = mockExams.map(exam => ({
    name: exam.name,
    Puan: Math.round(exam.totalScore),
    Net: Number(exam.totalNet.toFixed(2))
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deneme Takibi</h1>
          <p className="text-slate-500">Deneme sınavı sonuçlarını gir ve gelişimini izle.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          {isAdding ? 'İptal' : <><Plus className="w-5 h-5" /> Deneme Ekle</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">Yeni Deneme Sonucu Gir</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deneme Adı / Yayın</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={examName}
                  onChange={e => setExamName(e.target.value)}
                  placeholder="Örn: Özdebir Türkiye Geneli 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 font-semibold text-slate-700">Ders</th>
                    <th className="pb-3 font-semibold text-slate-700 text-center">Soru</th>
                    <th className="pb-3 font-semibold text-emerald-600 text-center">Doğru</th>
                    <th className="pb-3 font-semibold text-rose-600 text-center">Yanlış</th>
                    <th className="pb-3 font-semibold text-indigo-600 text-center">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {SUBJECTS.map(sub => {
                    const correctVal = scores[sub.name].correct;
                    const incorrectVal = scores[sub.name].incorrect;
                    const correct = typeof correctVal === 'number' ? correctVal : (Number(correctVal) || 0);
                    const incorrect = typeof incorrectVal === 'number' ? incorrectVal : (Number(incorrectVal) || 0);
                    const net = Math.max(0, correct - (incorrect / 3)).toFixed(2);
                    
                    return (
                      <tr key={sub.name} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 font-medium text-slate-800">{sub.name}</td>
                        <td className="py-3 text-center text-slate-500">{sub.questionCount}</td>
                        <td className="py-3 text-center">
                          <input 
                            type="number" min="0" max={sub.questionCount}
                            className="w-16 px-2 py-1 text-center border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={correctVal === 0 ? 0 : (correctVal || '')}
                            onChange={e => handleScoreChange(sub.name, 'correct', Number(e.target.value))}
                          />
                        </td>
                        <td className="py-3 text-center">
                          <input 
                            type="number" min="0" max={sub.questionCount - correct}
                            className="w-16 px-2 py-1 text-center border border-slate-300 rounded focus:ring-2 focus:ring-rose-500 outline-none"
                            value={incorrectVal === 0 ? 0 : (incorrectVal || '')}
                            onChange={e => handleScoreChange(sub.name, 'incorrect', Number(e.target.value))}
                          />
                        </td>
                        <td className="py-3 text-center font-bold text-indigo-600">{net}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Kaydet ve Hesapla
              </button>
            </div>
          </form>
        </div>
      )}

      {mockExams.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-slate-800">Puan Gelişimi</h2>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis yAxisId="left" domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="Puan" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-800">Hedef Durumu</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Hedef Puan</p>
                <p className="text-2xl font-bold text-slate-900">{profile?.targetScore || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-1">Son Deneme Puanı</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {Math.round(mockExams[mockExams.length - 1].totalScore)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-2">Hedefe Kalan Puan</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ 
                        width: `${Math.min(100, (mockExams[mockExams.length - 1].totalScore / (profile?.targetScore || 500)) * 100)}%` 
                      }}
                    />
                  </div>
                  <span className="font-bold text-slate-700">
                    {Math.max(0, Math.round((profile?.targetScore || 0) - mockExams[mockExams.length - 1].totalScore))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Geçmiş Denemeler</h2>
        {mockExams.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-500">Henüz deneme sonucu girmedin. İlk denemeni ekleyerek gelişimi takip etmeye başla!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...mockExams].reverse().map(exam => (
              <div key={exam.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800">{exam.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(exam.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">{Math.round(exam.totalScore)}</p>
                    <p className="text-xs font-medium text-slate-500">Puan</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Toplam Net</p>
                    <p className="font-bold text-slate-800">{exam.totalNet.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Toplam Soru</p>
                    <p className="font-bold text-slate-800">90</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setSelectedExamForAnalysis(exam)}
                    className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Bot className="w-4 h-4" /> AI Analizi Al
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AIAnalysisModal exam={selectedExamForAnalysis} onClose={() => setSelectedExamForAnalysis(null)} />
    </div>
  );
}
