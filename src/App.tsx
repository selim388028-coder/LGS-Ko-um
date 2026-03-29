import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudyPlan from './pages/StudyPlan';
import MockExams from './pages/MockExams';
import OnlineExams from './pages/OnlineExams';
import Mistakes from './pages/Mistakes';
import Timer from './pages/Timer';
import Motivation from './pages/Motivation';
import LGS2026 from './pages/LGS2026';
import MiniSummaries from './pages/MiniSummaries';
import AICoach from './pages/AICoach';
import AISolver from './pages/AISolver';
import SchoolExams from './pages/SchoolExams';
import TakeExam from './pages/TakeExam';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function ProtectedRoute() {
  const { user, profile, loading, isAuthReady } = useAuth();
  
  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  const { user, profile, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan" element={<StudyPlan />} />
          <Route path="/exams" element={<MockExams />} />
          <Route path="/online-exams" element={<OnlineExams />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/motivation" element={<Motivation />} />
          <Route path="/lgs-2026" element={<LGS2026 />} />
          <Route path="/summaries" element={<MiniSummaries />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/ai-solver" element={<AISolver />} />
          <Route path="/school-exams" element={<SchoolExams />} />
          <Route path="/take-exam" element={<TakeExam />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/payment" element={<Payment />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
