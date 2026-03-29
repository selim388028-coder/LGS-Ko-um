import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { sozelDeneme } from '../data/sozelDeneme';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

const SUBJECTS = ['Türkçe', 'T.C. İnkılap Tarihi', 'Din Kültürü', 'İngilizce'] as const;
type ExamSubject = typeof SUBJECTS[number];

export default function TakeExam() {
  const navigate = useNavigate();
  const { addMockExam, setHasNewExamResult } = useAppContext();
  
  const [selectedSubject, setSelectedSubject] = useState<ExamSubject>('Türkçe');
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const subjectQuestions = sozelDeneme.filter(q => q.subject === selectedSubject);
  const currentQuestion = subjectQuestions[subjectIndex];

  const handleAnswer = (option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const handleNext = () => {
    if (subjectIndex < subjectQuestions.length - 1) {
      setSubjectIndex(prev => prev + 1);
    } else {
      const currentSubjIdx = SUBJECTS.indexOf(selectedSubject);
      if (currentSubjIdx < SUBJECTS.length - 1) {
        setSelectedSubject(SUBJECTS[currentSubjIdx + 1]);
        setSubjectIndex(0);
      }
    }
  };

  const handlePrev = () => {
    if (subjectIndex > 0) {
      setSubjectIndex(prev => prev - 1);
    } else {
      const currentSubjIdx = SUBJECTS.indexOf(selectedSubject);
      if (currentSubjIdx > 0) {
        const prevSubj = SUBJECTS[currentSubjIdx - 1];
        setSelectedSubject(prevSubj);
        const prevSubjQuestions = sozelDeneme.filter(q => q.subject === prevSubj);
        setSubjectIndex(prevSubjQuestions.length - 1);
      }
    }
  };

  const handleSubjectChange = (subject: ExamSubject) => {
    setSelectedSubject(subject);
    setSubjectIndex(0);
  };

  const calculateScore = () => {
    const results = {
      'Türkçe': { correct: 0, incorrect: 0, blank: 0 },
      'T.C. İnkılap Tarihi': { correct: 0, incorrect: 0, blank: 0 },
      'Din Kültürü': { correct: 0, incorrect: 0, blank: 0 },
      'İngilizce': { correct: 0, incorrect: 0, blank: 0 },
    };

    sozelDeneme.forEach(q => {
      const userAnswer = answers[q.id];
      if (!userAnswer) {
        results[q.subject].blank++;
      } else if (userAnswer === q.correctAnswer) {
        results[q.subject].correct++;
      } else {
        results[q.subject].incorrect++;
      }
    });

    const calculateNet = (correct: number, incorrect: number) => correct - (incorrect / 3);

    const turkceNet = calculateNet(results['Türkçe'].correct, results['Türkçe'].incorrect);
    const inkilapNet = calculateNet(results['T.C. İnkılap Tarihi'].correct, results['T.C. İnkılap Tarihi'].incorrect);
    const dinNet = calculateNet(results['Din Kültürü'].correct, results['Din Kültürü'].incorrect);
    const ingilizceNet = calculateNet(results['İngilizce'].correct, results['İngilizce'].incorrect);

    const totalWeightedNet = (turkceNet * 4) + (inkilapNet * 1) + (dinNet * 1) + (ingilizceNet * 1);
    const totalScore = (totalWeightedNet / 110) * 500; // Simplified score calculation for verbal only

    addMockExam({
      id: Math.random().toString(36).substring(7),
      name: 'Sözel Bölüm Deneme Sınavı',
      date: new Date().toISOString().split('T')[0],
      totalNet: turkceNet + inkilapNet + dinNet + ingilizceNet,
      totalScore: Math.round(totalScore),
      scores: {
        'Türkçe': { ...results['Türkçe'], net: turkceNet },
        'Matematik': { correct: 0, incorrect: 0, blank: 20, net: 0 }, // Sözel deneme
        'Fen Bilimleri': { correct: 0, incorrect: 0, blank: 20, net: 0 }, // Sözel deneme
        'T.C. İnkılap Tarihi ve Atatürkçülük': { ...results['T.C. İnkılap Tarihi'], net: inkilapNet },
        'Yabancı Dil': { ...results['İngilizce'], net: ingilizceNet },
        'Din Kültürü ve Ahlak Bilgisi': { ...results['Din Kültürü'], net: dinNet },
      }
    });

    setHasNewExamResult(true);
    navigate('/exams');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sözel Bölüm Deneme Sınavı</h1>
          <p className="text-slate-500">Toplam 50 Soru • 75 Dakika</p>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Sınavı Bitir
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {SUBJECTS.map(subj => {
          const subjQuestions = sozelDeneme.filter(q => q.subject === subj);
          const answeredCount = subjQuestions.filter(q => answers[q.id]).length;
          return (
            <button
              key={subj}
              onClick={() => handleSubjectChange(subj)}
              className={cn(
                "px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all border-2",
                selectedSubject === subj
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-2">
                <span>{subj}</span>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  selectedSubject === subj ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  {answeredCount}/{subjQuestions.length}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <span className="font-semibold text-indigo-600">{currentQuestion.subject}</span>
          <span className="text-sm font-medium text-slate-500">Soru {currentQuestion.questionNumber}</span>
        </div>
        
        <div className="p-6 sm:p-8">
          <p className="text-lg text-slate-800 mb-8 whitespace-pre-wrap leading-relaxed">
            {currentQuestion.text}
          </p>

          <div className="space-y-3">
            {(Object.keys(currentQuestion.options) as Array<'A' | 'B' | 'C' | 'D'>).map((key) => (
              <button
                key={key}
                onClick={() => handleAnswer(key)}
                className={cn(
                  "w-full text-left px-6 py-4 rounded-xl border-2 transition-all",
                  answers[currentQuestion.id] === key
                    ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                    : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-700"
                )}
              >
                <span className="font-bold mr-3">{key})</span>
                {currentQuestion.options[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={selectedSubject === SUBJECTS[0] && subjectIndex === 0}
          className="flex items-center px-4 py-2 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Önceki Soru
        </button>
        
        <div className="flex gap-1 overflow-x-auto max-w-sm px-4 py-2 scrollbar-hide">
          {subjectQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setSubjectIndex(idx)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 transition-colors",
                subjectIndex === idx
                  ? "bg-indigo-600 text-white"
                  : answers[q.id]
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedSubject === SUBJECTS[SUBJECTS.length - 1] && subjectIndex === subjectQuestions.length - 1}
          className="flex items-center px-4 py-2 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
        >
          Sonraki Soru
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Sınavı Bitir</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Sınavı bitirmek istediğinize emin misiniz? İşaretlemediğiniz sorular boş bırakılmış sayılacaktır.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
              >
                İptal
              </button>
              <button
                onClick={calculateScore}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Evet, Bitir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
