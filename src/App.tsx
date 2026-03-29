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
import Admin from './pages/Admin';

function ProtectedRoute() {
  const { user, profile, loading, isAuthReady } = useAuth();
  const [showSpinner, setShowSpinner] = React.useState(false);
  
  // Debounce the loading state to prevent flickering
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isAuthReady || loading) {
      // If it's still loading after 500ms, show the spinner
      timer = setTimeout(() => {
        setShowSpinner(true);
      }, 500);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [isAuthReady, loading]);

  // If we are definitely not logged in and auth is ready, redirect immediately
  if (isAuthReady && !loading && !user) {
    return <Navigate to="/login" replace />;
  }

  // If we are still waiting for auth or profile, show spinner (if debounced)
  if (!isAuthReady || loading) {
    if (!showSpinner) return null; // Return nothing for the first 500ms to prevent unmount flicker
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
          <Route path="/motivation" element={<Motivation />} />
          <Route path="/lgs-2026" element={<LGS2026 />} />
          <Route path="/summaries" element={<MiniSummaries />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/ai-solver" element={<AISolver />} />
          <Route path="/school-exams" element={<SchoolExams />} />
          <Route path="/take-exam/:type" element={<TakeExam />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
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
