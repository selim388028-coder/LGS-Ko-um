import React, { createContext, useContext, useState, useEffect } from "react";
import { AppState, UserProfile, MockExam, Mistake, StudyTask, PastQuestion } from "../types";

interface AppContextType extends AppState {
  setProfile: (profile: UserProfile | null) => void;
  addMockExam: (exam: MockExam) => void;
  addMistake: (mistake: Mistake) => void;
  toggleMistakeResolved: (id: string) => void;
  addStudyTask: (task: StudyTask) => void;
  toggleTaskCompleted: (id: string) => void;
  replaceStudyPlan: (tasks: StudyTask[]) => void;
  generateStudyPlan: (profile: UserProfile) => void;
  addPastQuestion: (question: PastQuestion) => void;
  upgradeToPremium: () => void;
  setPendingExamPart: (part: AppState['pendingExamPart']) => void;
  clearPendingExamPart: () => void;
  hasNewExamResult: boolean;
  setHasNewExamResult: (val: boolean) => void;
}

const defaultState: AppState = {
  profile: null,
  mockExams: [],
  mistakes: [],
  studyPlan: [],
  pastQuestions: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem("lgs-kocum-state");
    return saved ? JSON.parse(saved) : defaultState;
  });
  const [hasNewExamResult, setHasNewExamResult] = useState(false);

  useEffect(() => {
    localStorage.setItem("lgs-kocum-state", JSON.stringify(state));
  }, [state]);

  const setProfile = (profile: UserProfile | null) => setState((s) => ({ ...s, profile }));
  const upgradeToPremium = () => setState((s) => ({ ...s, profile: s.profile ? { ...s.profile, isPremium: true } : null }));
  const addMockExam = (exam: MockExam) => setState((s) => ({ ...s, mockExams: [...s.mockExams, exam] }));
  const addMistake = (mistake: Mistake) => setState((s) => ({ ...s, mistakes: [...s.mistakes, mistake] }));
  const toggleMistakeResolved = (id: string) =>
    setState((s) => ({
      ...s,
      mistakes: s.mistakes.map((m) => (m.id === id ? { ...m, isResolved: !m.isResolved } : m)),
    }));
  const addStudyTask = (task: StudyTask) => setState((s) => ({ ...s, studyPlan: [...s.studyPlan, task] }));
  const toggleTaskCompleted = (id: string) =>
    setState((s) => ({
      ...s,
      studyPlan: s.studyPlan.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)),
    }));

  const replaceStudyPlan = (tasks: StudyTask[]) => {
    setState((s) => ({ ...s, studyPlan: tasks }));
  };

  const addPastQuestion = (question: PastQuestion) => {
    setState((s) => ({ ...s, pastQuestions: [...(s.pastQuestions || []), question] }));
  };

  const setPendingExamPart = (pendingExamPart: AppState['pendingExamPart']) => {
    setState((s) => ({ ...s, pendingExamPart }));
  };

  const clearPendingExamPart = () => {
    setState((s) => ({ ...s, pendingExamPart: undefined }));
  };

  const generateStudyPlan = (profile: UserProfile) => {
    // Simple logic to generate a study plan based on weak subjects
    const newTasks: StudyTask[] = [];
    const today = new Date();
    
    profile.weakSubjects.forEach((subject, index) => {
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        if ((i + index) % 2 === 0) {
          newTasks.push({
            id: Math.random().toString(36).substring(7),
            date: date.toISOString().split("T")[0],
            subject,
            topic: "Eksik Konu Tekrarı",
            type: "Konu Çalışması",
            durationMinutes: 45,
            isCompleted: false,
          });
        } else {
          newTasks.push({
            id: Math.random().toString(36).substring(7),
            date: date.toISOString().split("T")[0],
            subject,
            topic: "Soru Çözümü",
            type: "Soru Çözümü",
            durationMinutes: 60,
            isCompleted: false,
          });
        }
      }
    });

    setState((s) => ({ ...s, studyPlan: newTasks }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setProfile,
        addMockExam,
        addMistake,
        toggleMistakeResolved,
        addStudyTask,
        toggleTaskCompleted,
        replaceStudyPlan,
        generateStudyPlan,
        addPastQuestion,
        upgradeToPremium,
        setPendingExamPart,
        clearPendingExamPart,
        hasNewExamResult,
        setHasNewExamResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
