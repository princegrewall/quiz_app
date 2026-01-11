export interface RawQuestion {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<number, string>;
  visitedQuestions: Set<number>;
  isLoading: boolean;
  error: string | null;
  isSubmitted: boolean;
  timeRemaining: number;
  userEmail: string;
}

export interface QuizResult {
  question: Question;
  userAnswer: string | null;
  isCorrect: boolean;
}
