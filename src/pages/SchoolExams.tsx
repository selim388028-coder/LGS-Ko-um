import React, { useState, useRef, useEffect } from 'react';
import { FileText, Bot, Send, User, Loader2, BookOpen, Sparkles, Download } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';
import { Subject } from '../types';
import PremiumPaywall from '../components/PremiumPaywall';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const SUBJECTS: Subject[] = [
  "Türkçe",
  "Matematik",
  "Fen Bilimleri",
  "T.C. İnkılap Tarihi ve Atatürkçülük",
  "Din Kültürü ve Ahlak Bilgisi",
  "Yabancı Dil"
];

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function SchoolExams() {
  const { profile } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState<Subject>("Matematik");
  const [selectedTerm, setSelectedTerm] = useState<"1. Dönem" | "2. Dönem">("1. Dönem");
  const [selectedExam, setSelectedExam] = useState<"1. Yazılı" | "2. Yazılı">("1. Yazılı");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const startExamPrep = async () => {
    if (!profile) return;
    
    setIsChatActive(true);
    setIsLoading(true);
    setMessages([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const systemInstruction = `Sen MEB 2026 müfredatına ve yayınlanan örnek yazılı senaryolarına tam hakim bir uzman öğretmensin. Öğrenci 8. sınıf LGS öğrencisi. Adı ${profile.name}.
      
Görevlerin:
1. Öğrencinin seçtiği ders, dönem ve yazılıya göre MEB'in 2026 yılı için yayınladığı konu dağılım tablolarını (Senaryo 1, Senaryo 2 vb.) analiz et.
2. Hangi konudan kaç soru çıkacağını ve hangi kazanımların önemli olduğunu bir tablo veya liste halinde sun.
3. Bu sınav için en kritik 5 püf noktasını "Altın Bilgiler" başlığı altında ver.
4. MEB'in yeni nesil "açık uçlu" yazılı formatına uygun, zorluk derecesi kademeli (kolay-orta-zor) en az 3 tane örnek yazılı sorusu yaz.
5. Her sorunun altında "Çözüm ve Puanlama" kısmında adım adım çözümü ve hangi adımın kaç puan getireceğini (Rubrik) belirt.
6. Yanıtlarını Markdown formatında, okunaklı, başlıklar kullanarak ve kalın yazılarla vurgulayarak ver.
7. KESİNLİKLE matematiksel ifadelerde LaTeX KULLANMA. Üslü sayıları 2^15 veya 2 üssü 15 şeklinde yaz. Çarpma için * veya x kullan.`;
      
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction }
      });

      const initialPrompt = `Merhaba öğretmenim! 8. Sınıf ${selectedSubject} dersi, ${selectedTerm} ${selectedExam} sınavıma hazırlanmak istiyorum. MEB 2026 senaryolarına göre bu sınavda hangi konular çıkacak? Bana önemli noktaları özetleyip açık uçlu örnek sorular çözebilir misin?`;
      
      setMessages([{ role: 'user', text: initialPrompt }]);
      
      const response = await chatRef.current.sendMessage({ message: initialPrompt });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Üzgünüm, MEB senaryolarını analiz ederken bir hata oluştu. Lütfen tekrar dene." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userText });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Üzgünüm, bir hata oluştu. Lütfen tekrar dene." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('exam-pdf-content');
    if (!element) return;

    // Suppress html2canvas oklch parsing errors in console
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    const suppressOklch = (...args: any[]) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes('oklch'))) return true;
      return false;
    };

    console.error = (...args) => {
      if (suppressOklch(...args)) return;
      originalConsoleError(...args);
    };
    console.warn = (...args) => {
      if (suppressOklch(...args)) return;
      originalConsoleWarn(...args);
    };

    const opt = {
      margin:       10,
      filename:     `${selectedSubject}_${selectedTerm}_${selectedExam}_Hazirlik.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore console
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    }).catch((err: any) => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.error('PDF generation failed:', err);
    });
  };

  if (!profile?.isPremium) {
    return <PremiumPaywall featureName="Yazılı Hazırlık" />;
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
          <FileText className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Yazılı Hazırlık <Sparkles className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-slate-500">MEB 2026 senaryolarına göre açık uçlu yazılılara hazırlan.</p>
        </div>
      </div>

      {!isChatActive ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Hangi Yazılıya Hazırlanıyoruz?</h2>
            <p className="text-slate-600">
              MEB'in 2026 yılı için yayınladığı konu dağılım senaryolarını yapay zeka ile analiz ediyoruz. 
              Sana çıkabilecek konuları, püf noktaları ve açık uçlu örnek soruları hazırlayacağız.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ders</label>
                <select 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value as Subject)}
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dönem</label>
                <select 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
                  value={selectedTerm}
                  onChange={e => setSelectedTerm(e.target.value as any)}
                >
                  <option value="1. Dönem">1. Dönem</option>
                  <option value="2. Dönem">2. Dönem</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sınav</label>
                <select 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
                  value={selectedExam}
                  onChange={e => setSelectedExam(e.target.value as any)}
                >
                  <option value="1. Yazılı">1. Yazılı</option>
                  <option value="2. Yazılı">2. Yazılı</option>
                </select>
              </div>
            </div>

            <button 
              onClick={startExamPrep}
              disabled={isLoading}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />} 
              MEB 2026 Senaryolarına Göre Hazırla
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* Active Exam Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-emerald-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
                {selectedSubject}
              </span>
              <span className="text-sm font-medium text-slate-600">
                {selectedTerm} - {selectedExam}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleDownloadPDF}
                disabled={messages.filter(m => m.role === 'model').length === 0}
                className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-100/50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Yazılıyı PDF Olarak İndir"
              >
                <Download className="w-4 h-4" /> PDF İndir
              </button>
              <button 
                onClick={() => {
                  setIsChatActive(false);
                }}
                className="text-sm text-slate-500 hover:text-slate-800 font-medium"
              >
                Başka Sınav Seç
              </button>
            </div>
          </div>

          {/* Hidden PDF Content */}
          <div className="fixed left-[-9999px] top-0 -z-50 pointer-events-none">
            <div id="exam-pdf-content" style={{ padding: '40px', backgroundColor: '#ffffff', color: '#000000', width: '800px', minHeight: '1100px', fontFamily: 'sans-serif' }}>
              <div style={{ border: '2px solid #059669', padding: '20px', marginBottom: '30px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#065f46', margin: 0 }}>{selectedSubject} Yazılı Hazırlık</h1>
                  <div style={{ textAlign: 'right', fontSize: '14px', color: '#64748b' }}>
                    <p style={{ margin: 0 }}>{profile.name}</p>
                    <p style={{ margin: 0 }}>{new Date().toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#334155' }}>{selectedTerm} - {selectedExam}</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>MEB 2026 Örnek Senaryolarına Göre Hazırlanmıştır</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {messages.filter(m => m.role === 'model').map((msg, idx) => (
                  <div key={idx} className="markdown-body" style={{ fontSize: '14px', lineHeight: '1.6', color: '#1e293b' }}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    {idx < messages.filter(m => m.role === 'model').length - 1 && (
                      <div style={{ margin: '30px 0', borderBottom: '1px dashed #cbd5e1' }} />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '50px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                <p>LGS Hazırlık Asistanı tarafından oluşturulmuştur. Başarılar dileriz!</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-indigo-500 text-white'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="markdown-body text-sm">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  <span className="text-sm text-slate-500">MEB senaryoları analiz ediliyor...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Yazılı ile ilgili aklına takılan bir şey sor... (Örn: Çarpanlar konusundan zor bir soru sorar mısın?)"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                Gönder <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
