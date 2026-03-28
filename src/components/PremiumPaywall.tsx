import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Crown, CheckCircle2, Sparkles, Lock } from 'lucide-react';

interface PremiumPaywallProps {
  featureName: string;
}

export default function PremiumPaywall({ featureName }: PremiumPaywallProps) {
  const navigate = useNavigate();

  const features = [
    "AI Koçum ile kişiselleştirilmiş rehberlik",
    "LGS 2026 Yeni Nesil Soru Havuzu",
    "Yanlış Defteri ve eksik analizi",
    "Detaylı Deneme Takibi",
    "Akıllı Çalışma Planı",
    "Yazılı Hazırlık asistanı"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden"
      >
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Crown className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{featureName} Kilitli</h2>
            <p className="text-amber-50">Bu özelliğe erişmek için Kazananlar Planı'na geçiş yapmalısın.</p>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              Kazananlar Planı
            </h3>
            <div className="mt-4 flex items-end justify-center gap-1">
              <span className="text-4xl font-black text-slate-900">359</span>
              <span className="text-lg font-bold text-slate-500 mb-1">TL</span>
              <span className="text-sm text-slate-400 mb-2">/aylık</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/payment')}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Şimdi Yükselt
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-4">
            Aylık yenilenen abonelik. İstediğin zaman iptal edebilirsin.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
