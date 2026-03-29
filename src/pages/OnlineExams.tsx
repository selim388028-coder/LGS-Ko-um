import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, FileText, Clock, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export default function OnlineExams() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Denemeler</h1>
        <p className="text-slate-500">Türkiye geneli ve online deneme sınavlarına buradan katılabilirsin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider rounded-full">
              Aktif
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2">Sözel Bölüm Deneme Sınavı</h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            Türkçe, T.C. İnkılap Tarihi, Din Kültürü ve İngilizce derslerinden oluşan 50 soruluk sözel bölüm denemesi.
          </p>
          
          <div className="flex items-center gap-4 mb-6 text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>50 Soru</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>75 Dakika</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/take-exam/sozel')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-sm"
          >
            <Play className="w-5 h-5 fill-current" /> Sınava Başla
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider rounded-full">
              Aktif
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2">Sayısal Bölüm Deneme Sınavı</h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            Matematik ve Fen Bilimleri derslerinden oluşan 40 soruluk sayısal bölüm denemesi. Yeni nesil sorular içerir.
          </p>
          
          <div className="flex items-center gap-4 mb-6 text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>40 Soru</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>80 Dakika</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/take-exam/sayisal')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-colors shadow-sm"
          >
            <Play className="w-5 h-5 fill-current" /> Sınava Başla
          </button>
        </motion.div>
      </div>
    </div>
  );
}
