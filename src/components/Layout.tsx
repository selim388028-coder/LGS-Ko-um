import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
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
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

const navigation = [
  { name: 'Özet', href: '/', icon: LayoutDashboard },
  { name: 'Çalışma Planı', href: '/plan', icon: CalendarDays },
  { name: 'Denemeler', href: '/online-exams', icon: FileText },
  { name: 'Deneme Takibi', href: '/exams', icon: Target },
  { name: 'Yanlış Defteri', href: '/mistakes', icon: BookX },
  { name: 'Süre Tutucu', href: '/timer', icon: TimerIcon },
  { name: 'LGS 2026', href: '/lgs-2026', icon: Target },
  { name: 'Mini Özetler', href: '/summaries', icon: BookOpen },
  { name: 'Yazılı Hazırlık', href: '/school-exams', icon: FileText },
  { name: 'AI Koçum', href: '/ai-coach', icon: Bot },
  { name: 'Canlı Soru Çözümü', href: '/ai-solver', icon: Bot },
  { name: 'Motivasyon', href: '/motivation', icon: Flame },
  { name: 'Profilim', href: '/profile', icon: User },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile } = useAuth();
  const { hasNewExamResult } = useAppContext();

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
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )
                }
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.name}
                {item.name === 'Deneme Takibi' && hasNewExamResult && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </NavLink>
            ))}
          </nav>
          
          {!profile?.isPremium && (
            <div className="p-4 border-t">
              <NavLink
                to="/payment"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-200"
              >
                <Sparkles className="w-4 h-4" />
                Premium'a Geç
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200">
        <div className="flex items-center h-16 px-6 border-b border-slate-200">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className={cn("w-5 h-5 mr-3 flex-shrink-0", "opacity-80")} />
              {item.name}
              {item.name === 'Deneme Takibi' && hasNewExamResult && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </NavLink>
          ))}
        </nav>

        {!profile?.isPremium && (
          <div className="p-4 border-t border-slate-100">
            <NavLink
              to="/payment"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-100 hover:shadow-amber-200 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Premium'a Geç
            </NavLink>
          </div>
        )}
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
          <div className="w-6" /> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
