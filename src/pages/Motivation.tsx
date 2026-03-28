import React, { useState, useEffect } from 'react';
import { Flame, Quote, Target, Award, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const QUOTES = [
  { text: "Başarı, her gün tekrarlanan küçük çabaların toplamıdır.", author: "Robert Collier" },
  { text: "Gelecek, bugünden hazırlananlara aittir.", author: "Malcolm X" },
  { text: "Hiçbir zafere çiçekli yollardan gidilmez.", author: "La Fontaine" },
  { text: "Başlamak için mükemmel olmak zorunda değilsin, ama mükemmel olmak için başlamak zorundasın.", author: "Zig Ziglar" },
  { text: "Zorluklar, başarının değerini artıran süslerdir.", author: "Moliere" }
];

export default function Motivation() {
  const [quote, setQuote] = useState(QUOTES[0]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  // LGS Date (Approximate: First Sunday of June 2026)
  const lgsDate = new Date('2026-06-07T09:30:00');

  useEffect(() => {
    // Random quote on load
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    const calculateTimeLeft = () => {
      const difference = +lgsDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Motivasyon İstasyonu</h1>
        <p className="text-slate-500">Hedefine giden yolda enerjini yüksek tut!</p>
      </div>

      {/* Countdown Hero */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
            <Target className="w-4 h-4" /> LGS 2026'ya Kalan Süre
          </div>
          
          <div className="flex gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-7xl font-black tracking-tighter">{timeLeft.days}</span>
              <span className="text-indigo-200 font-medium mt-2 uppercase tracking-widest text-sm">Gün</span>
            </div>
            <span className="text-5xl md:text-7xl font-light text-indigo-300/50">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-7xl font-black tracking-tighter">{timeLeft.hours}</span>
              <span className="text-indigo-200 font-medium mt-2 uppercase tracking-widest text-sm">Saat</span>
            </div>
            <span className="text-5xl md:text-7xl font-light text-indigo-300/50">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-7xl font-black tracking-tighter">{timeLeft.minutes}</span>
              <span className="text-indigo-200 font-medium mt-2 uppercase tracking-widest text-sm">Dakika</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quote of the Day */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <Quote className="w-10 h-10 text-indigo-200 mb-6" />
          <p className="text-2xl font-medium text-slate-800 leading-relaxed mb-6">
            "{quote.text}"
          </p>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="w-8 h-px bg-slate-300"></span>
            {quote.author}
          </p>
        </div>

        {/* Tips */}
        <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <Flame className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-amber-900">Günün Tavsiyesi</h2>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800">Çalışmaya başlamadan önce masanı düzenle. Karmaşık bir masa, karmaşık bir zihin demektir.</p>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800">Zorlandığın konuları sabahın erken saatlerinde, zihnin en berrakken çalış.</p>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800">Deneme çözerken mutlaka süre tut ve gerçek sınav ortamını simüle et.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
