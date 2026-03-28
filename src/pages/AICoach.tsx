import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import PremiumPaywall from '../components/PremiumPaywall';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AICoach() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (profile && profile.isPremium && !chatRef.current) {
      const initChat = async () => {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const systemInstruction = `Sen LGS'ye hazırlanan öğrencilere ders anlatan, konu öğreten ve örnekler çözen bir yapay zeka öğretmenisin (AI Koçum). Öğrencinin adı ${profile.displayName}, hedefi ${profile.targetHighSchool}.
          
Görevlerin:
1. Öğrenci sana bir konu sorduğunda (örn: "Üslü sayılar nedir?"), konuyu onun seviyesine uygun, akılda kalıcı ve kısa bir şekilde anlat.
2. Konuyu anlattıktan sonra MUTLAKA LGS tarzında veya konuyu pekiştirecek 1-2 tane örnek soru yaz ve çözümünü adım adım göster.
3. Öğrenciyi sürekli motive et.
4. Yanıtlarını Markdown formatında ver. Önemli yerleri kalın yaz, maddeler kullan.`;
          
          chatRef.current = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: { systemInstruction }
          });

          setMessages([
            { 
              role: 'model', 
              text: `Merhaba ${profile.displayName}! Ben senin kişisel AI Koçunum. Hedefin olan **${profile.targetHighSchool}** lisesine ulaşman için buradayım.\n\nHangi konuyu çalışmak istersin veya hangi soruyu çözemedin? Bana yaz, hemen anlatayım ve örneklerle pekiştirelim!` 
            }
          ]);
        } catch (error) {
          console.error("AI Error:", error);
          setMessages([{ role: 'model', text: "Üzgünüm, bağlantı kurulurken bir hata oluştu. Lütfen sayfayı yenile." }]);
        }
      };
      initChat();
    }
  }, [profile]);

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

  if (!profile?.isPremium) {
    return <PremiumPaywall featureName="AI Koçum" />;
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <Bot className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            AI Koçum <Sparkles className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-slate-500">Konu çalış, soru sor, örneklerle öğren.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                {msg.role === 'user' ? (
                  <p>{msg.text}</p>
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
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                <span className="text-sm text-slate-500">Koç yazıyor...</span>
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
              placeholder="Hangi konuyu çalışalım? Veya anlamadığın bir soruyu yaz..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              Gönder <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
