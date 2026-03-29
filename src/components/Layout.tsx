import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Target, 
  BookX, 
  Timer as TimerIcon, 
  Flame, 
  BookOpen, 
  Bot,
  FileText,
  Menu,
  X,
  User,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Lock,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import FeedbackModal from './FeedbackModal';
import FeedbackNotifications from './FeedbackNotifications';

const navigation = [
  { name: 'Özet', href: '/', icon: LayoutDashboard },
  { name: 'Çalışma Planı', href: '/plan', icon: CalendarDays },
  { name: 'Denemeler', href: '/online-exams', icon: FileText },
  { name: 'Deneme Takibi', href: '/exams', icon: Target },
  { name: 'Yanlış Defteri', href: '/mistakes', icon: BookX, premiumOnly: true },
  { name: 'LGS 2026', href: '/lgs-2026', icon: Target, premiumOnly: true },
  { name: 'Mini Özetler', href: '/summaries', icon: BookOpen, premiumOnly: true },
  { name: 'Yazılı Hazırlık', href: '/school-exams', icon: FileText, premiumOnly: true },
  { name: 'AI Koçum', href: '/ai-coach', icon: Bot, premiumOnly: true },
  { name: 'Canlı Soru Çözümü', href: '/ai-solver', icon: Bot, premiumOnly: true },
  { name: 'Motivasyon', href: '/motivation', icon: Flame },
  { name: 'Profilim', href: '/profile', icon: User },
  { name: 'Admin Paneli', href: '/admin', icon: ShieldCheck, adminOnly: true },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { profile, user } = useAuth();
  const { hasNewExamResult } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const isAdmin = profile?.role === 'admin' || 
                  profile?.email?.toLowerCase() === 'selim388028@gmail.com' ||
                  user?.email?.toLowerCase() === 'selim388028@gmail.com';

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  const handleNavClick = (e: React.MouseEvent, item: typeof navigation[0]) => {
    if (item.premiumOnly && !profile?.isPremium && !isAdmin) {
      e.preventDefault();
      navigate('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Logo size="sm" />
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={(e) => {
                  handleNavClick(e, item);
                  if (!item.premiumOnly || profile?.isPremium || isAdmin) setSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive && (!item.premiumOnly || profile?.isPremium || isAdmin)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )
                }
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.name}
                {item.premiumOnly && !profile?.isPremium && !isAdmin && <Lock className="w-4 h-4 ml-auto text-slate-400" />}
                {item.name === 'Deneme Takibi' && hasNewExamResult && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setSidebarOpen(false);
                setFeedbackOpen(true);
              }}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-3 flex-shrink-0" />
              Geri Bildirim
            </button>
          </nav>
          
          <div className="p-4 border-t space-y-3">
            {!profile?.isPremium && (
              <NavLink
                to="/payment"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-200"
              >
                <Sparkles className="w-4 h-4" />
                Premium'a Geç
              </NavLink>
            )}
            <button
              onClick={handleInstall}
              className="flex flex-col items-center justify-center gap-1 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
            >
              <Download className="w-5 h-5" />
              Mobile İndirin
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200">
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <Logo size="sm" />
          <FeedbackNotifications />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive && (!item.premiumOnly || profile?.isPremium || isAdmin)
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className={cn("w-5 h-5 mr-3 flex-shrink-0", "opacity-80")} />
              {item.name}
              {item.premiumOnly && !profile?.isPremium && !isAdmin && <Lock className="w-4 h-4 ml-auto text-slate-400" />}
              {item.name === 'Deneme Takibi' && hasNewExamResult && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
          >
            <MessageSquare className="w-5 h-5 mr-3 flex-shrink-0 opacity-80" />
            Geri Bildirim
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-3">
          {!profile?.isPremium && (
            <NavLink
              to="/payment"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-100 hover:shadow-amber-200 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Premium'a Geç
            </NavLink>
          )}
          <button
            onClick={handleInstall}
            className="flex flex-col items-center justify-center gap-1 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
          >
            <Download className="w-5 h-5" />
            Mobile İndirin
          </button>
        </div>
      </div>


      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Logo size="sm" />
          <FeedbackNotifications />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
