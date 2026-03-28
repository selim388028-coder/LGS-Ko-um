import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Lock, ShieldCheck, ArrowLeft, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Logo from '../components/Logo';

export default function Payment() {
  const navigate = useNavigate();
  const { upgradeToPremium } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Upgrade to premium after a short delay to show success state
      setTimeout(() => {
        upgradeToPremium();
        navigate('/');
      }, 2000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <button 
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                  </button>
                  <h2 className="text-xl font-bold text-slate-800">Ödeme Bilgileri</h2>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-4 mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-600 font-medium">Kazananlar Planı</p>
                    <p className="text-xs text-indigo-400">Yıllık Abonelik</p>
                  </div>
                  <p className="text-xl font-black text-indigo-700">359 TL</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                      Kart Üzerindeki İsim
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        name="name"
                        required
                        placeholder="AD SOYAD"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                      Kart Numarası
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        name="cardNumber"
                        required
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                        Son Kullanma
                      </label>
                      <div className="relative">
                        <input 
                          type="text"
                          name="expiry"
                          required
                          placeholder="AA/YY"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                          value={formData.expiry}
                          onChange={handleInputChange}
                        />
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                        CVV
                      </label>
                      <div className="relative">
                        <input 
                          type="password"
                          name="cvv"
                          required
                          maxLength={3}
                          placeholder="***"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                          value={formData.cvv}
                          onChange={handleInputChange}
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        Güvenli Ödeme Yap
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-4 opacity-50 grayscale">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" className="h-4" />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Ödeme Başarılı!</h2>
                <p className="text-slate-500 mb-8">Kazananlar Planı üyeliğin aktif edildi. Başarıya bir adım daha yaklaştın!</p>
                <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold animate-pulse">
                  <Sparkles className="w-5 h-5" />
                  Yönlendiriliyorsun...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          256-bit SSL Güvenli Ödeme Altyapısı
        </p>
      </motion.div>
    </div>
  );
}
