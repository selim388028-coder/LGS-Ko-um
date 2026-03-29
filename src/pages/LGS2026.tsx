import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Target, ArrowRight, CheckCircle2, XCircle, AlertCircle, ChevronLeft, BookOpen, Calendar as CalendarIcon, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import { Subject } from '../types';
import { LGS_2026_QUESTIONS } from '../data/lgs2026Questions';
import PremiumPaywall from '../components/PremiumPaywall';

const SUBJECTS: Subject[] = [
  "Türkçe",
  "Matematik",
  "Fen Bilimleri",
  "T.C. İnkılap Tarihi ve Atatürkçülük",
  "Din Kültürü ve Ahlak Bilgisi",
  "Yabancı Dil"
];

export default function LGS2026() {
  const { addStudyTask, profile } = useAppContext();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const activeQuestions = selectedSubject 
    ? LGS_2026_QUESTIONS.filter(q => q.subject === selectedSubject)
    : [];

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < activeQuestions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    activeQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const generateStudyPlanFromMistakes = () => {
    const mistakes = activeQuestions.filter((q, index) => answers[index] !== q.correctAnswer);
    
    mistakes.forEach(mistake => {
      addStudyTask({
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString().split('T')[0],
        subject: mistake.subject,
        topic: mistake.topic,
        type: "Konu Çalışması",
        durationMinutes: 45,
        isCompleted: false
      });
    });

    alert(`${mistakes.length} adet eksik konu için çalışma planına görevler eklendi!`);
    navigate('/plan');
  };

  if (!profile?.isPremium) {
    return <PremiumPaywall featureName="LGS 2026 Soruları" />;
  }

  if (showResults) {
    const score = calculateScore();
    const mistakes = activeQuestions.filter((q, index) => answers[index] !== q.correctAnswer);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">LGS 2026 {selectedSubject} Testi Tamamlandı!</h2>
          <p className="text-slate-500 mb-6">{activeQuestions.length} soruda {score} doğru yaptın.</p>
          
          {mistakes.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-left mb-8">
              <div className="flex items-center gap-2 text-amber-800 font-bold mb-2 text-lg">
                <AlertCircle className="w-6 h-6" />
                Eksik Konuların Tespit Edildi
              </div>
              <p className="text-amber-700 mb-4">
                Yanlış yaptığın sorulara göre aşağıdaki konularda eksiğin olduğunu görüyoruz. Bu konuları çalışma planına ekleyerek eksiklerini kapatabilirsin.
              </p>
              <ul className="list-disc list-inside text-amber-800 mb-6 space-y-1">
                {mistakes.map(m => <li key={m.id} className="font-medium">{m.topic}</li>)}
              </ul>
              <button 
                onClick={generateStudyPlanFromMistakes}
                className="flex items-center justify-center w-full sm:w-auto gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-700 transition-colors shadow-sm"
              >
                <CalendarIcon className="w-5 h-5" />
                Eksik Konuları Çalışma Planıma Ekle
              </button>
            </div>
          )}

          <div className="space-y-6 text-left mt-8">
            <h3 className="font-bold text-slate-800 text-xl border-b pb-4">Soru Çözümleri ve Analiz</h3>
            {activeQuestions.map((q, index) => {
              const isCorrect = answers[index] === q.correctAnswer;
              return (
                <div key={q.id} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                  <div className="flex items-start gap-4">
                    {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" /> : <XCircle className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />}
                    <div className="flex-1">
                      <div className="inline-block px-3 py-1 bg-white/60 text-slate-700 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                        {q.topic}
                      </div>
                      {q.imageUrl && (
                        <img src={q.imageUrl} alt="Soru" className="w-full max-w-lg rounded-xl border border-slate-200 mb-4 shadow-sm" />
                      )}
                      <p className="font-medium text-slate-800 mb-4 text-lg">{q.question}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {q.options.map((opt, i) => (
                          <div key={i} className={`p-3 rounded-lg text-sm border ${
                            i === q.correctAnswer ? 'bg-emerald-100 border-emerald-200 text-emerald-800 font-bold' :
                            i === answers[index] && !isCorrect ? 'bg-rose-100 border-rose-200 text-rose-800 font-bold' :
                            'bg-white border-slate-200 text-slate-600'
                          }`}>
                            {opt}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 bg-white/80 rounded-xl text-sm text-slate-700 border border-slate-100">
                        <span className="font-bold text-indigo-700 flex items-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4" /> Çözüm Adımları:
                        </span> 
                        {q.explanation}
                      </div>

                      {!isCorrect && (
                        <button 
                          onClick={() => navigate('/ai-coach')}
                          className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Bot className="w-4 h-4" /> Bu Soruyu AI Koçuna Sor
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => {
              setQuizStarted(false);
              setShowResults(false);
              setCurrentQuestion(0);
              setAnswers({});
              setSelectedSubject(null);
            }}
            className="mt-8 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
          >
            Ana Ekrana Dön
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">LGS 2026 Denemeleri</h1>
          <p className="text-lg text-slate-600">
            Her dersten özenle hazırlanmış, yeni nesil görsel destekli 10'ar soru. Toplam 60 soru ile LGS 2026 provasını yap, eksiklerini yapay zeka ile anında tespit et.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS.map(subject => (
            <div 
              key={subject}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group cursor-pointer flex flex-col h-full"
              onClick={() => {
                setSelectedSubject(subject);
                setQuizStarted(true);
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{subject}</h3>
              <p className="text-slate-500 mb-6 flex-1">
                Yeni nesil görselli 10 soru ile {subject} dersindeki seviyeni ölç.
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-400">10 Soru</span>
                <span className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-3 transition-all">
                  Teste Başla <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const question = activeQuestions[currentQuestion];

  if (!question) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (window.confirm("Testten çıkmak istediğinize emin misiniz? İlerleyişiniz kaybolacak.")) {
                setQuizStarted(false);
                setCurrentQuestion(0);
                setAnswers({});
              }
            }}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">LGS 2026 - {selectedSubject}</h2>
            <p className="text-sm text-slate-500">{question.topic}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-sm font-bold text-indigo-600">Soru {currentQuestion + 1}</span>
            <span className="block text-xs text-slate-400">Toplam {activeQuestions.length}</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 flex items-center justify-center">
            <span className="font-bold text-slate-700">{currentQuestion + 1}</span>
          </div>
        </div>
      </div>

      <motion.div 
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200"
      >
        {question.imageUrl && (
          <div className="mb-8 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            <img 
              src={question.imageUrl} 
              alt="Soru Görseli" 
              className="w-full h-auto max-h-[400px] object-contain mx-auto" 
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
              Görsel 1.1
            </div>
          </div>
        )}
        
        <p className="text-xl sm:text-2xl font-medium text-slate-800 mb-8 leading-relaxed whitespace-pre-wrap">
          {question.question}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                answers[currentQuestion] === index 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md scale-[1.02]' 
                  : 'border-slate-200 hover:border-indigo-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-colors ${
                answers[currentQuestion] === index ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {['A', 'B', 'C', 'D'][index]}
              </div>
              <span className="font-medium text-lg">{option.substring(3)}</span>
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-end border-t border-slate-100 pt-6">
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-sm hover:shadow-md"
          >
            {currentQuestion === activeQuestions.length - 1 ? 'Testi Bitir ve Sonuçları Gör' : 'Sonraki Soru'}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
