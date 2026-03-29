import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Calendar, Lock, ShieldCheck, ArrowLeft, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export default function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');

    if (success && sessionId && user) {
      verifyAndCompletePayment(sessionId);
    }

    if (canceled) {
      setError("Ödeme iptal edildi. Lütfen tekrar deneyin.");
    }
  }, [searchParams, user]);

  const verifyAndCompletePayment = async (sessionId: string) => {
    setIsProcessing(true);
    try {
      // Handle mock session
      if (sessionId.startsWith('mock_session_') && user) {
        await updateDoc(doc(db, 'users', user.uid), {
          isPremium: true
        });
        setIsSuccess(true);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
      const data = await response.json();

      if (data.success && user) {
        // Update premium status in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          isPremium: true
        });
        setIsSuccess(true);
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError("Ödeme doğrulanamadı. Lütfen destekle iletişime geçin.");
      }
    } catch (err) {
      console.error(err);
      setError("Ödeme doğrulanırken bir hata oluştu.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeCheckout = async () => {
    if (!user) {
      setError("Lütfen önce giriş yapın.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Check if Stripe is configured on client
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey || publishableKey.includes('your_')) {
        console.warn("Stripe is not configured on client. Using mock payment.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockSessionId = "mock_session_" + Math.random().toString(36).substring(7);
        window.location.href = `/payment?success=true&session_id=${mockSessionId}`;
        return;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      const session = await response.json();

      if (session.isMock) {
        console.warn("Server reported Stripe is not configured. Using mock payment.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockSessionId = "mock_session_" + Math.random().toString(36).substring(7);
        window.location.href = `/payment?success=true&session_id=${mockSessionId}`;
        return;
      }

      if (session.error) {
        throw new Error(session.error);
      }

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Checkout URL'i alınamadı.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center"
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
      </div>
    );
  }

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

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              </button>
              <h2 className="text-xl font-bold text-slate-800">Üyelik Planı</h2>
            </div>

            <div className="bg-indigo-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-indigo-100 font-medium mb-1">Kazananlar Planı</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">359 TL</span>
                  <span className="text-indigo-200 text-sm">/ay</span>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-indigo-50">
                    <CheckCircle2 className="w-4 h-4" />
                    Sınırsız AI Soru Çözümü
                  </li>
                  <li className="flex items-center gap-2 text-sm text-indigo-50">
                    <CheckCircle2 className="w-4 h-4" />
                    Kişiselleştirilmiş Çalışma Planı
                  </li>
                  <li className="flex items-center gap-2 text-sm text-indigo-50">
                    <CheckCircle2 className="w-4 h-4" />
                    Detaylı Deneme Analizleri
                  </li>
                </ul>
              </div>
              <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-500/20" />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm flex items-center gap-2 border border-rose-100">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button 
              onClick={handleStripeCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {(!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.includes('your_')) 
                    ? "Test Ödemesi Yap (Ücretsiz)" 
                    : "Güvenli Ödeme Yap"}
                </>
              )}
            </button>

            <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
              {(!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.includes('your_'))
                ? "Şu an test modundasınız. Herhangi bir ücret alınmayacaktır."
                : "Ödemeniz Stripe güvencesiyle gerçekleştirilir. İstediğiniz zaman iptal edebilirsiniz."}
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-50 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" className="h-4" />
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          256-bit SSL Güvenli Ödeme Altyapısı
        </p>
      </motion.div>
    </div>
  );
}
