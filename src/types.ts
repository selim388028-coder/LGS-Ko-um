export type Subject = "Türkçe" | "Matematik" | "Fen Bilimleri" | "T.C. İnkılap Tarihi ve Atatürkçülük" | "Din Kültürü ve Ahlak Bilgisi" | "Yabancı Dil";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  targetHighSchool?: string;
  targetScore?: number;
  currentLevel?: "Başlangıç" | "Orta" | "İleri";
  weakSubjects?: Subject[];
  dailyGoal?: number;
  isPremium?: boolean;
  premiumExpiry?: string;
  planName?: string;
  isEmailVerified?: boolean;
  role?: 'admin' | 'user';
  verificationCode?: string;
  verificationCodeExpires?: string;
  createdAt: string;
}

export interface MockExam {
  id: string;
  date: string;
  name: string;
  scores: Record<Subject, { correct: number; incorrect: number; blank: number; net: number }>;
  totalNet: number;
  totalScore: number;
  wrongQuestions?: { 
    id: number;
    subject: Subject; 
    questionNumber: number; 
    text: string; 
    options: Record<string, string>; 
    correctAnswer: string; 
    userAnswer: string 
  }[];
}

export interface Mistake {
  id: string;
  date: string;
  subject: Subject;
  topic: string;
  questionImage?: string;
  notes: string;
  isResolved: boolean;
}

export interface StudyTask {
  id: string;
  date: string;
  subject: Subject;
  topic: string;
  type: "Konu Çalışması" | "Soru Çözümü" | "Deneme";
  durationMinutes: number;
  isCompleted: boolean;
}

export interface PastQuestion {
  id: string;
  year: number;
  subject: Subject;
  imageUrl: string;
  correctAnswer: string;
  topic: string;
}

export interface AppState {
  profile: UserProfile | null;
  mockExams: MockExam[];
  mistakes: Mistake[];
  studyPlan: StudyTask[];
  pastQuestions: PastQuestion[];
  pendingExamPart?: { 
    type: 'sozel' | 'sayisal'; 
    answers: Record<number, string>;
    date: string;
  };
}
