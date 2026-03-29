import React, { useState, useEffect, useRef } from 'react';
import { X, Bot, Send, User, Loader2 } from 'lucide-react';
import { MockExam } from '../types';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';

interface Props {
  exam: MockExam | null;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIAnalysisModal({ exam, onClose }: Props) {
  const { profile } = useAppContext();
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
    if (exam && profile && !chatRef.current) {
      const initChat = async () => {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const systemInstruction = `Sen LGS'ye hazırlanan öğrencilere rehberlik eden, motive edici ve uzman bir "LGS Koçu" yapay zekasın. Öğrencinin adı ${profile.displayName}, hedefi ${profile.targetHighSchool} (${profile.targetScore} puan). Öğrencinin deneme sonuçlarını analiz et, eksiklerini belirle, moral ver ve nokta atışı çalışma tavsiyeleri sun. Yanıtların samimi, cesaretlendirici ve Markdown formatında olsun. Çok uzun paragraflar yerine maddeler halinde okunması kolay cevaplar ver.`;
          
          chatRef.current = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: { systemInstruction }
          });

          const initialMessage = `Merhaba Koç! "${exam.name}" adlı deneme sınavına girdim. Sonuçlarım şöyle:\n${Object.entries(exam.scores).map(([subject, score]) => `- ${subject}: ${score.correct} Doğru, ${score.incorrect} Yanlış, ${score.net} Net`).join('\n')}\nToplam Netim: ${exam.totalNet.toFixed(2)}\nTahmini Puanım: ${Math.round(exam.totalScore)}\n\nLütfen bu sonucumu hedefim olan ${profile.targetScore} puanlık ${profile.targetHighSchool} lisesine göre analiz et ve bana bir çalışma stratejisi öner.`;

          setIsLoading(true);
          setMessages([{ role: 'user', text: "Deneme sonuçlarımı gönderiyorum, lütfen analiz et." }]);
          
          const response = await chatRef.current.sendMessage({ message: initialMessage });
          
          setMessages(prev => [...prev, { role: 'model', text: response.text }]);
        } catch (error) {
          console.error("AI Error:", error);
          setMessages(prev => [...prev, { role: 'model', text: "Üzgünüm, analizi yaparken bir hata oluştu. Lütfen daha sonra tekrar dene." }]);
        } finally {
          setIsLoading(false);
        }
      };
      initChat();
    }
  }, [exam, profile]);

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
      setMessages(prev => [...prev, { role: 'model', text: "Üzgünüm, bir hata oluştu." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!exam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">LGS Koçu AI Analizi</h2>
              <p className="text-xs text-slate-500">{exam.name} Sonuçları</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
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
                <span className="text-sm text-slate-500">Koç analiz yapıyor...</span>
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
              placeholder="Koça bir soru sor... (Örn: Matematik netimi nasıl artırabilirim?)"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
