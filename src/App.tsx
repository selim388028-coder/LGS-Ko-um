import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import StudyPlan from './pages/StudyPlan';
import MockExams from './pages/MockExams';
import Mistakes from './pages/Mistakes';
import Timer from './pages/Timer';
import Motivation from './pages/Motivation';
import LGS2026 from './pages/LGS2026';
import MiniSummaries from './pages/MiniSummaries';
import AICoach from './pages/AICoach';
import AISolver from './pages/AISolver';
import SchoolExams from './pages/SchoolExams';
import Payment from './pages/Payment';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile } = useAppContext();
  if (!profile) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { profile } = useAppContext();

  return (
    <Routes>
      <Route path="/onboarding" element={!profile ? <Onboarding /> : <Navigate to="/" replace />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="plan" element={<StudyPlan />} />
        <Route path="exams" element={<MockExams />} />
        <Route path="mistakes" element={<Mistakes />} />
        <Route path="timer" element={<Timer />} />
        <Route path="motivation" element={<Motivation />} />
        <Route path="lgs-2026" element={<LGS2026 />} />
        <Route path="summaries" element={<MiniSummaries />} />
        <Route path="ai-coach" element={<AICoach />} />
        <Route path="ai-solver" element={<AISolver />} />
        <Route path="school-exams" element={<SchoolExams />} />
      </Route>
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
