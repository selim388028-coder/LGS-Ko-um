import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { motion } from 'motion/react';
import { Monitor, Mic, MicOff, Square, AlertCircle, Loader2, Bot, Camera } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import PremiumPaywall from '../components/PremiumPaywall';

export default function AISolver() {
  const { profile } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [inputMode, setInputMode] = useState<'screen' | 'camera'>('screen');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [subtitles, setSubtitles] = useState('');
  const [micLevel, setMicLevel] = useState(0);
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micContextRef = useRef<AudioContext | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const addDebug = (msg: string) => {
    console.log(`[AISolver] ${msg}`);
    setDebugInfo(prev => `${new Date().toLocaleTimeString()}: ${msg}\n${prev}`.slice(0, 500));
  };

  const forceResumeAudio = async () => {
    if (audioContextRef.current) {
      addDebug("Ses motoru zorla yeniden başlatılıyor...");
      try {
        await audioContextRef.current.resume();
        addDebug(`Ses motoru durumu: ${audioContextRef.current.state}`);
        
        // Play a quick test beep
        const osc = audioContextRef.current.createOscillator();
        const gain = audioContextRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
        gain.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioContextRef.current.destination);
        osc.start();
        osc.stop(audioContextRef.current.currentTime + 0.2);
      } catch (e) {
        addDebug(`Ses başlatma hatası: ${e}`);
      }
    }
  };

  const stopSession = (reason: string = "Bilinmeyen/Unmount") => {
    addDebug(`Oturum durduruluyor (Neden: ${reason})`);
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {}
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
    if (micContextRef.current) {
      micContextRef.current.close();
      micContextRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
    setSubtitles('');
    setMicLevel(0);
    setAiIsSpeaking(false);
    setIsSpeaking(false);
  };

  const startSession = async (mode: 'screen' | 'camera') => {
    setIsConnecting(true);
    setError(null);
    setInputMode(mode);
    setSubtitles('');
    addDebug(`Oturum başlatılıyor: ${mode}`);
    
    try {
      if (!window.isSecureContext) {
        throw new Error("Bu özellik sadece güvenli bağlantı (HTTPS) üzerinden kullanılabilir.");
      }

      if (!navigator.mediaDevices) {
        throw new Error("Tarayıcınız medya cihazlarını (kamera/mikrofon) desteklemiyor.");
      }

      if (mode === 'screen' && !navigator.mediaDevices.getDisplayMedia) {
        throw new Error("Tarayıcınız ekran paylaşımını desteklemiyor. Lütfen güncel bir tarayıcı kullanın.");
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Sistem yapılandırma hatası: API Anahtarı bulunamadı.");
      }

      if (!profile?.isPremium) {
        throw new Error("Bu özelliği kullanmak için premium üyeliğinizin olması gerekmektedir.");
      }

      // 1. Get Media Streams
      addDebug("Medya izinleri isteniyor...");
      let visualStream: MediaStream;
      let micStream: MediaStream;

      try {
        if (mode === 'camera') {
          const combinedStream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
          visualStream = new MediaStream(combinedStream.getVideoTracks());
          micStream = new MediaStream(combinedStream.getAudioTracks());
          addDebug("Kamera ve Mikrofon akışları başarıyla alındı.");
        } else {
          addDebug("Ekran paylaşımı izni bekleniyor...");
          visualStream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: 15 },
            audio: false
          });
          addDebug("Ekran akışı alındı. Mikrofon izni bekleniyor...");
          micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
          addDebug("Mikrofon akışı başarıyla alındı.");
        }
      } catch (mediaErr: any) {
        addDebug(`Medya Hatası: ${mediaErr.name} - ${mediaErr.message}`);
        if (mediaErr.name === 'NotAllowedError') {
          throw new Error("Kamera veya mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.");
        }
        throw new Error(`Medya erişim hatası: ${mediaErr.message}`);
      }
      
      activeStreamRef.current = visualStream;
      micStreamRef.current = micStream;

      // 3. Setup Audio Context for playback
      addDebug("Ses motoru hazırlanıyor...");
      const audioCtx = new AudioContext({ sampleRate: 24000 });
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioContextRef.current = audioCtx;
      nextPlayTimeRef.current = audioCtx.currentTime;
      addDebug("Ses motoru hazır.");

      // 4. Initialize Gemini Live
      addDebug("Gemini Live bağlantısı kuruluyor...");
      const ai = new GoogleGenAI({ apiKey });
      
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Fenrir" } },
          },
          systemInstruction: `Sen bir LGS (Liselere Geçiş Sistemi) koçusun. Adın "LGS Koçum". Öğrencinin paylaştığı ${mode === 'screen' ? 'ekrandaki' : 'kameradaki'} soruları görüyorsun. 
          GÖREVİN:
          1. Soruları adım adım çözmesine rehberlik et.
          2. Hemen cevabı söyleme, öğrenciyi düşünmeye sevk et.
          3. Motivasyonel, enerjik ve destekleyici bir erkek sesi tonuyla konuş.
          4. Yanıtların kısa, öz ve anlaşılır olsun.
          5. Öğrenci bir soruda takıldığında ona ipucu ver.
          6. ÖNEMLİ: Oturumu asla kendiliğinden kapatma. Her zaman öğrencinin yeni bir şey sormasını veya bir işlem yapmasını bekle.`,
        },
        callbacks: {
          onopen: () => {
            addDebug("Bağlantı kanalı açıldı.");
            setIsActive(true);
            setIsConnecting(false);
          },
          onmessage: async (message) => {
            try {
              if (message.serverContent) {
                if (message.serverContent.modelTurn) {
                  const parts = message.serverContent.modelTurn.parts;
                  if (parts) {
                    let hasAudio = false;
                    for (const part of parts) {
                      if (part.inlineData && part.inlineData.data) {
                        hasAudio = true;
                        playAudioChunk(part.inlineData.data);
                      }
                      if (part.text) {
                        setSubtitles(prev => prev + part.text);
                      }
                    }
                    if (hasAudio) {
                      setAiIsSpeaking(true);
                    }
                  }
                }
                
                if (message.serverContent.interrupted) {
                  addDebug("AI sözü kesildi (Kullanıcı konuştu).");
                  nextPlayTimeRef.current = audioContextRef.current?.currentTime || 0;
                  setSubtitles('');
                  setAiIsSpeaking(false);
                }

                if (message.serverContent.turnComplete) {
                  addDebug("AI yanıtı tamamladı. Dinlemeye devam ediyor...");
                  setTimeout(() => setAiIsSpeaking(false), 1000);
                }
              }
            } catch (msgErr) {
              addDebug(`Mesaj işleme hatası: ${msgErr}`);
            }
          },
          onclose: () => {
            stopSession("Sunucu bağlantıyı kapattı.");
          },
          onerror: (err) => {
            stopSession(`Hata: ${err.message || 'Bağlantı hatası'}`);
          }
        }
      });
      
      sessionRef.current = session;
      
      // Start streaming immediately after connection is established
      addDebug("Akış başlatılıyor...");
      startStreaming(session);
      session.sendRealtimeInput({
        text: "Merhaba! Ben LGS Koçun. Ekranını görüyorum, harika bir çalışma seansı bizi bekliyor. Hangi sorudan başlayalım?"
      });

    } catch (err: any) {
      addDebug(`Başlatma Hatası: ${err.message}`);
      setError(err.message || "Oturum başlatılamadı.");
      setIsConnecting(false);
      stopSession("Başlatma Hatası");
    }
  };

  const startStreaming = (session: any) => {
    try {
      if (!activeStreamRef.current) {
        addDebug("Hata: Aktif medya akışı bulunamadı.");
        return;
      }

      // Stream Visual Frames
      const video = document.createElement('video');
      video.srcObject = activeStreamRef.current;
      video.muted = true;
      video.playsInline = true;
      video.play().catch(e => addDebug(`Video oynatma hatası: ${e}`));
      videoRef.current = video;

      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;
      const ctx = canvas.getContext('2d');

      const sendFrame = () => {
        try {
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
        } catch (frameErr) {
          addDebug(`Görüntü gönderim hatası: ${frameErr}`);
        }
      };
      sendFrame();

      // Stream Mic Audio
      const micCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      micContextRef.current = micCtx;
      
      const source = micCtx.createMediaStreamSource(micStreamRef.current || activeStreamRef.current);
      const processor = micCtx.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      const gainNode = micCtx.createGain();
      gainNode.gain.value = 0;
      processor.connect(gainNode);
      gainNode.connect(micCtx.destination);

      processor.onaudioprocess = (e) => {
        try {
          if (!sessionRef.current || !isMicOn || !isActive) return;
          
          // Ensure mic context is running
          if (micCtx.state === 'suspended') {
            micCtx.resume();
          }

          const inputData = e.inputBuffer.getChannelData(0);
          
          // Calculate mic level for UI feedback
          let sum = 0;
          for (let i = 0; i < inputData.length; i++) {
            sum += inputData[i] * inputData[i];
          }
          const rms = Math.sqrt(sum / inputData.length);
          setMicLevel(rms);
          setIsSpeaking(rms > 0.01);

          // Convert Float32 to Int16 PCM
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
          }
          
          // More efficient base64 encoding
          const uint8Array = new Uint8Array(pcmData.buffer);
          let binary = '';
          const len = uint8Array.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8Array[i]);
          }
          const base64Audio = btoa(binary);
          
          session.sendRealtimeInput({
            audio: { data: base64Audio, mimeType: 'audio/pcm;rate=16000' }
          });
        } catch (audioErr) {
          addDebug(`Ses gönderim hatası: ${audioErr}`);
        }
      };

      // Ensure mic context is resumed
      if (micCtx.state === 'suspended') {
        micCtx.resume();
      }
    } catch (streamErr) {
      addDebug(`Akış başlatma hatası: ${streamErr}`);
    }
  };

  const playAudioChunk = (base64Data: string) => {
    if (!audioContextRef.current) return;

    try {
      if (audioContextRef.current.state !== 'running') {
        audioContextRef.current.resume();
      }

      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const arrayBuffer = bytes.buffer;
      const length = Math.floor(arrayBuffer.byteLength / 2);
      const pcmData = new Int16Array(arrayBuffer, 0, length);
      
      const floatData = new Float32Array(pcmData.length);
      for (let i = 0; i < pcmData.length; i++) {
        floatData[i] = pcmData[i] / 32768.0;
      }

      const buffer = audioContextRef.current.createBuffer(1, floatData.length, 24000);
      buffer.getChannelData(0).set(floatData);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);

      // Improved scheduling to prevent gaps and overlaps
      const now = audioContextRef.current.currentTime;
      let startTime = nextPlayTimeRef.current;
      
      // If we're behind or just starting, start with a small buffer
      if (startTime < now) {
        startTime = now + 0.05; 
      }

      source.start(startTime);
      nextPlayTimeRef.current = startTime + buffer.duration;
    } catch (e) {
      addDebug(`Ses çalma hatası: ${e}`);
    }
  };

  useEffect(() => {
    const handleInteraction = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      if (micContextRef.current && micContextRef.current.state === 'suspended') {
        micContextRef.current.resume();
      }
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      stopSession("Sayfadan Ayrılma/Unmount");
    };
  }, []);

  if (!profile?.isPremium) {
    return <PremiumPaywall featureName="Canlı Soru Çözümü" />;
  }

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
                      disabled={isConnecting || !navigator.mediaDevices?.getDisplayMedia}
                      className={cn(
                        "flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95",
                        (isConnecting || !navigator.mediaDevices?.getDisplayMedia) && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {isConnecting && inputMode === 'screen' ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Monitor className="w-6 h-6" />
                      )}
                      {navigator.mediaDevices?.getDisplayMedia ? 'Ekran Paylaş' : 'Ekran Paylaşımı Desteklenmiyor'}
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
                  <div className="absolute top-4 right-4 flex gap-2">
                    {isMicOn && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                        <div 
                          className="w-1.5 bg-emerald-500 rounded-full transition-all duration-75" 
                          style={{ height: `${Math.max(4, micLevel * 100)}px` }}
                        />
                        <Mic className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Canlı</span>
                    </div>
                  </div>
                  {/* Pulse Overlay */}
                  <div className={cn(
                    "absolute inset-0 pointer-events-none border-4 rounded-2xl transition-all duration-500",
                    aiIsSpeaking ? "border-indigo-500/50 scale-[1.02]" : "border-transparent"
                  )} />
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
                  <Bot className={cn("w-6 h-6", aiIsSpeaking && "animate-bounce")} />
                  <span className="font-bold uppercase tracking-widest text-xs">AI Koçun Bağlı</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 px-4">
                  {isSpeaking ? 'Seni Dinliyorum...' : (aiIsSpeaking ? 'AI Koç Konuşuyor...' : 'Sorunu Bekliyorum...')}
                </h2>
                <div className="min-h-[60px] px-6 flex items-center justify-center">
                  {subtitles ? (
                    <p className="text-sm sm:text-base text-slate-700 font-medium bg-slate-100 p-4 rounded-xl inline-block max-w-2xl">
                      {subtitles}
                    </p>
                  ) : (
                    <p className="text-sm sm:text-base text-slate-500 italic">
                      {isSpeaking ? '"Şu an seni dinliyorum, devam et..."' : '"Hangi soruda takıldın? Sesli olarak sorabilirsin."'}
                    </p>
                  )}
                </div>
              </div>

              {/* Debug Info (Only for development/troubleshooting) */}
              {debugInfo && (
                <div className="mx-6 p-4 bg-slate-900 rounded-xl text-[10px] font-mono text-emerald-400 overflow-auto max-h-32">
                  <p className="font-bold mb-1 uppercase text-slate-500">Sistem Günlüğü:</p>
                  <pre className="whitespace-pre-wrap">{debugInfo}</pre>
                </div>
              )}

              {/* Controls */}
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
                  onClick={() => stopSession("Kullanıcı")}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 sm:py-6 bg-rose-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95"
                >
                  <Square className="w-6 h-6 fill-current" />
                  Oturumu Kapat
                </button>

                <button
                  onClick={forceResumeAudio}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                >
                  Ses Gelmiyor mu?
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
