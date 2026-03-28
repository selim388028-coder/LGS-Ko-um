import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';

export default function Timer() {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound here if needed
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Süre Tutucu</h1>
        <p className="text-slate-500">Pomodoro tekniği ile odaklanarak çalış.</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 w-full max-w-md relative overflow-hidden">
        {/* Progress Background */}
        <div 
          className={`absolute bottom-0 left-0 right-0 opacity-10 transition-all duration-1000 ease-linear ${mode === 'work' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
          style={{ height: `${progress}%` }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex gap-4 mb-12 bg-slate-100 p-1.5 rounded-full">
            <button
              onClick={() => switchMode('work')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${
                mode === 'work' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Çalışma
            </button>
            <button
              onClick={() => switchMode('break')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${
                mode === 'break' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Coffee className="w-4 h-4" /> Mola
            </button>
          </div>

          <div className="text-[6rem] md:text-[8rem] font-black tracking-tighter text-slate-800 leading-none mb-12 font-mono">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={resetTimer}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            
            <button 
              onClick={toggleTimer}
              className={`w-20 h-20 flex items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                mode === 'work' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
