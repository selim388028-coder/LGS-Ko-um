import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Subject, UserProfile } from '../types';
import { motion } from 'motion/react';
import Logo from '../components/Logo';

const SUBJECTS: Subject[] = [
  "Türkçe",
  "Matematik",
  "Fen Bilimleri",
  "T.C. İnkılap Tarihi ve Atatürkçülük",
  "Din Kültürü ve Ahlak Bilgisi",
  "Yabancı Dil"
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setProfile, generateStudyPlan } = useAppContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    weakSubjects: [],
    currentLevel: "Orta"
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (formData.name && formData.targetHighSchool && formData.targetScore) {
      const profile = formData as UserProfile;
      setProfile(profile);
      generateStudyPlan(profile);
      navigate('/');
    }
  };

  const toggleSubject = (subject: Subject) => {
    setFormData(prev => {
      const weak = prev.weakSubjects || [];
      if (weak.includes(subject)) {
        return { ...prev, weakSubjects: weak.filter(s => s !== subject) };
      } else {
        return { ...prev, weakSubjects: [...weak, subject] };
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8"
      >
        <div className="text-center mb-8">
          <Logo className="justify-center mb-6" size="md" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">LGS Koçum'a Hoş Geldin!</h1>
          <p className="text-slate-500">Sana özel bir çalışma planı hazırlayabilmemiz için seni biraz tanıyalım.</p>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adın Ne?</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Örn: Ahmet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hedef Lisen Hangisi?</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.targetHighSchool || ''}
                onChange={e => setFormData({...formData, targetHighSchool: e.target.value})}
                placeholder="Örn: Galatasaray Lisesi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hedef Puanın Kaç?</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.targetScore || ''}
                onChange={e => setFormData({...formData, targetScore: Number(e.target.value)})}
                placeholder="Örn: 480"
              />
            </div>
            <button 
              onClick={handleNext}
              disabled={!formData.name || !formData.targetHighSchool || !formData.targetScore}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-6"
            >
              İleri
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Hangi konularda kendini daha zayıf hissediyorsun?</label>
              <div className="grid grid-cols-2 gap-3">
                {SUBJECTS.map(subject => (
                  <button
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium border text-left transition-all ${
                      formData.weakSubjects?.includes(subject)
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Şu anki seviyeni nasıl tanımlarsın?</label>
              <div className="flex gap-3">
                {["Başlangıç", "Orta", "İleri"].map(level => (
                  <button
                    key={level}
                    onClick={() => setFormData({...formData, currentLevel: level as any})}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      formData.currentLevel === level
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={handleBack}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Geri
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!formData.weakSubjects?.length}
                className="flex-[2] py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Planımı Oluştur!
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
