import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { motion } from 'motion/react';
import { Monitor, Mic, MicOff, Play, Square, AlertCircle, Loader2, Bot, Camera } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AISolver() {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [inputMode, setInputMode] = useState<'screen' | 'camera'>('screen');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach(t => t.stop());
      activeStreamRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  };

  const startSession = async (mode: 'screen' | 'camera') => {
    setIsConnecting(true);
    setError(null);
    setInputMode(mode);
    
    try {
      // 1. Get Visual Stream
      let visualStream: MediaStream;
      if (mode === 'screen') {
        visualStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 5 },
          audio: false
        });
      } else {
        visualStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "environment", // Prefer back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      }
      activeStreamRef.current = visualStream;

      // 2. Get Mic Stream
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      micStreamRef.current = micStream;

      // 3. Setup Audio Context for playback
      const audioCtx = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      nextPlayTimeRef.current = audioCtx.currentTime;

      // 4. Initialize Gemini Live
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `Sen bir LGS koçusun. Öğrencinin paylaştığı ${mode === 'screen' ? 'ekrandaki' : 'kameradaki'} soruları görmene ve sesini duymana izin verildi. Soruları adım adım çözmesine yardımcı ol, ipuçları ver ama hemen cevabı söyleme. Motivasyonel ve destekleyici bir dil kullan.`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
          }
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            startStreaming(session);
          },
          onmessage: async (message) => {
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              playAudioChunk(base64Audio);
            }
            if (message.serverContent?.interrupted) {
              // Stop current playback if interrupted
              nextPlayTimeRef.current = audioContextRef.current?.currentTime || 0;
            }
          },
          onclose: () => stopSession(),
          onerror: (err) => {
            console.error("Gemini Live Error:", err);
            setError("Bağlantı hatası oluştu.");
            stopSession();
          }
        }
      });
      sessionRef.current = session;

    } catch (err: any) {
      console.error("Start Session Error:", err);
      setError(err.message || "Oturum başlatılamadı. Lütfen mikrofon ve kamera/ekran izinlerini kontrol edin.");
      setIsConnecting(false);
      stopSession();
    }
  };

  const startStreaming = (session: any) => {
    // Stream Visual Frames
    const video = document.createElement('video');
    video.srcObject = activeStreamRef.current;
    video.play();
    videoRef.current = video;

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    const sendFrame = () => {
      if (!sessionRef.current || !isActive) return;
      
      if (ctx && video.videoWidth) {
        canvas.width = 640; // Scale down for performance
        canvas.height = (video.videoHeight / video.videoWidth) * 640;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Frame = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
        
        session.sendRealtimeInput({
          video: { data: base64Frame, mimeType: 'image/jpeg' }
        });
      }
      setTimeout(sendFrame, 1000); // Send 1 frame per second
    };
    sendFrame();

    // Stream Mic Audio
    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const source = audioCtx.createMediaStreamSource(micStreamRef.current!);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioCtx.destination);

    processor.onaudioprocess = (e) => {
      if (!sessionRef.current || !isActive || !isMicOn) return;
      
      const inputData = e.inputBuffer.getChannelData(0);
      // Convert Float32 to Int16 PCM
      const pcmData = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
      }
      
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
      session.sendRealtimeInput({
        audio: { data: base64Audio, mimeType: 'audio/pcm;rate=16000' }
      });
    };
  };

  const playAudioChunk = (base64Data: string) => {
    if (!audioContextRef.current) return;

    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // PCM 16bit is 2 bytes per sample
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }

    const buffer = audioContextRef.current.createBuffer(1, floatData.length, 24000);
    buffer.getChannelData(0).set(floatData);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);

    const startTime = Math.max(audioContextRef.current.currentTime, nextPlayTimeRef.current);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + buffer.duration;
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Canlı Soru Çözümü</h1>
        <p className="text-slate-500">Ekranını paylaş, AI Koçunla birlikte soruları sesli olarak çöz.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-12 flex flex-col items-center justify-center space-y-8">
          {!isActive ? (
            <div className="text-center space-y-6">
              <div className="flex gap-4 justify-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                  <Monitor className="w-10 h-10 text-indigo-600" />
                </div>
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                  <Camera className="w-10 h-10 text-indigo-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-800">Oturumu Başlat</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  Ekranını paylaşarak veya kameranı kullanarak AI Koçunla birlikte soru çözebilirsin.
                </p>
              </div>
              
              {error && (
                <div className="flex items-center gap-2 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => startSession('screen')}
                  disabled={isConnecting}
                  className={cn(
                    "flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95",
                    isConnecting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isConnecting && inputMode === 'screen' ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Monitor className="w-6 h-6" />
                  )}
                  Ekran Paylaş
                </button>

                <button
                  onClick={() => startSession('camera')}
                  disabled={isConnecting}
                  className={cn(
                    "flex items-center justify-center gap-3 px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-50 hover:bg-indigo-50 transition-all active:scale-95",
                    isConnecting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isConnecting && inputMode === 'camera' ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6" />
                  )}
                  Kamera Kullan
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-8">
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-indigo-500/30">
                  <video 
                    ref={el => {
                      if (el && activeStreamRef.current) {
                        el.srcObject = activeStreamRef.current;
                      }
                    }}
                    autoPlay 
                    playsInline 
                    muted 
                    className={cn(
                      "w-full h-full object-cover",
                      inputMode === 'camera' && "scale-x-[-1]" // Mirror camera for natural feel
                    )}
                  />
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Canlı</span>
                    </div>
                  </div>
                  {/* Pulse Overlay */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-indigo-500/50 rounded-2xl animate-pulse" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
                  <Bot className="w-6 h-6" />
                  <span className="font-bold uppercase tracking-widest text-xs">AI Koçun Bağlı</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 px-4">
                  {inputMode === 'screen' 
                    ? 'Ekranını İnceliyorum...' 
                    : 'Sorunu Görüyorum...'}
                </h2>
                <p className="text-sm sm:text-base text-slate-500 italic px-6">
                  {inputMode === 'screen' 
                    ? '"Şu an ekranını görebiliyorum, hangi soruda takıldın?"' 
                    : '"Soruyu net görebiliyorum, haydi birlikte çözelim!"'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={cn(
                    "w-full sm:w-auto flex items-center justify-center gap-3 p-4 sm:p-6 rounded-2xl transition-all",
                    isMicOn ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                  )}
                >
                  {isMicOn ? <Mic className="w-6 h-6 sm:w-8 sm:h-8" /> : <MicOff className="w-6 h-6 sm:w-8 sm:h-8" />}
                  <span className="sm:hidden font-bold">{isMicOn ? 'Sesi Kapat' : 'Sesi Aç'}</span>
                </button>
                
                <button
                  onClick={stopSession}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 sm:py-6 bg-rose-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95"
                >
                  <Square className="w-6 h-6 fill-current" />
                  Oturumu Kapat
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Görüntü Durumu</p>
                  <div className="flex items-center gap-2 text-emerald-600 font-medium">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    {inputMode === 'screen' ? 'Ekran Paylaşılıyor' : 'Kamera Aktif'}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ses Durumu</p>
                  <div className={cn("flex items-center gap-2 font-medium", isMicOn ? "text-emerald-600" : "text-rose-600")}>
                    <div className={cn("w-2 h-2 rounded-full", isMicOn ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                    {isMicOn ? "Mikrofon Açık" : "Mikrofon Kapalı"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">Nasıl Çalışır?</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Ekranını paylaştığında AI Koçun soruyu analiz eder. Sen sesli olarak sorunu sorduğunda sana gerçek zamanlı yanıt verir.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">İpucu Al</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            AI Koçun sana doğrudan cevabı vermez. Bunun yerine çözüm yolunu anlaman için seni yönlendirir.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">Tüm Dersler</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Matematik, Fen, Türkçe veya diğer LGS derslerindeki tüm soruların için yardım alabilirsin.
          </p>
        </div>
      </div>
    </div>
  );
}
