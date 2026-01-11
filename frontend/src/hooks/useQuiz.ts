import { useState, useCallback, useEffect, useRef } from 'react';
import { Question, RawQuestion, QuizState, QuizResult } from '@/types/quiz';

const QUIZ_DURATION = 30 * 60; // 30 minutes in seconds

function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function transformQuestions(rawQuestions: RawQuestion[]): Question[] {
  return rawQuestions.map((raw, index) => {
    const options = shuffleArray([
      raw.correct_answer,
      ...raw.incorrect_answers,
    ].map(decodeHTMLEntities));

    return {
      id: index,
      question: decodeHTMLEntities(raw.question),
      options,
      correctAnswer: decodeHTMLEntities(raw.correct_answer),
      category: decodeHTMLEntities(raw.category),
      difficulty: raw.difficulty,
    };
  });
}

export function useQuiz() {
  // load persisted quiz state from localStorage (if present)
  let initialPersist: any = null;
  if (typeof window !== 'undefined') {
    try {
      initialPersist = JSON.parse(localStorage.getItem('quiz_state') || 'null');
    } catch {}
  }

  const [state, setState] = useState<QuizState>({
    questions: initialPersist?.questions || [],
    currentQuestionIndex: initialPersist?.currentQuestionIndex || 0,
    userAnswers: initialPersist?.userAnswers || {},
    visitedQuestions: new Set(initialPersist?.visitedQuestions || [0]),
    isLoading: false,
    error: null,
    isSubmitted: initialPersist?.isSubmitted || false,
    timeRemaining: typeof initialPersist?.timeRemaining === 'number' ? initialPersist.timeRemaining : QUIZ_DURATION,
    userEmail: initialPersist?.userEmail || '',
  });

  const persistToStorage = (next: QuizState) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('quiz_state', JSON.stringify({
        questions: next.questions,
        currentQuestionIndex: next.currentQuestionIndex,
        userAnswers: next.userAnswers,
        visitedQuestions: Array.from(next.visitedQuestions),
        isSubmitted: next.isSubmitted,
        timeRemaining: next.timeRemaining,
        userEmail: next.userEmail,
      }));
    } catch {}
  };

  const setPersistState = (updater: ((p: QuizState) => QuizState) | QuizState) => {
    setState(prev => {
      const next = typeof updater === 'function' ? (updater as (p: QuizState) => QuizState)(prev) : (updater as QuizState);
      persistToStorage(next);
      return next;
    });
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const fetchQuestions = useCallback(async () => {
    setPersistState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`${API_BASE}/api/quiz?amount=15`);
      const data = await response.json();
      
      if (data.response_code !== 0) {
        throw new Error('Failed to fetch questions');
      }
      
      const questions = transformQuestions(data.results);
      setPersistState(prev => ({
        ...prev,
        questions,
        isLoading: false,
        visitedQuestions: new Set([0]),
      }));
    } catch (error) {
      setPersistState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load quiz questions. Please try again.',
      }));
    }
  }, []);

  const startQuiz = useCallback((email: string) => {
    setPersistState(prev => ({ ...prev, userEmail: email }));
    fetchQuestions();
  }, [fetchQuestions]);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setPersistState(prev => {
        if (prev.timeRemaining <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return { ...prev, timeRemaining: 0, isSubmitted: true };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setPersistState(prev => ({
      ...prev,
      currentQuestionIndex: index,
      visitedQuestions: new Set([...prev.visitedQuestions, index]),
    }));
  }, []);

  const selectAnswer = useCallback((questionId: number, answer: string) => {
    setPersistState(prev => {
      const nextAnswers = { ...prev.userAnswers, [questionId]: answer };
      return {
        ...prev,
        userAnswers: nextAnswers,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setPersistState(prev => {
      const nextIndex = Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1);
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        visitedQuestions: new Set([...prev.visitedQuestions, nextIndex]),
      };
    });
  }, []);

  const prevQuestion = useCallback(() => {
    setPersistState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
    }));
  }, []);

  const getResults = useCallback((): QuizResult[] => {
    return state.questions.map(question => ({
      question,
      userAnswer: state.userAnswers[question.id] || null,
      isCorrect: state.userAnswers[question.id] === question.correctAnswer,
    }));
  }, [state.questions, state.userAnswers]);

  const getScore = useCallback((): { correct: number; total: number } => {
    const results = getResults();
    const correct = results.filter(r => r.isCorrect).length;
    return { correct, total: results.length };
  }, [getResults]);

  const submitQuiz = useCallback(async () => {
    stopTimer();

    try {
      const results = getResults();
      const score = getScore().correct;
      const payload = {
        email: state.userEmail || undefined,
        score,
        answers: results.map(r => ({ question: r.question.question, answer: r.userAnswer, isCorrect: r.isCorrect })),
        meta: { timeTakenSec: QUIZ_DURATION - state.timeRemaining }
      };

      console.log('Submitting payload:', payload);

      const resp = await fetch(`${API_BASE}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const respBody = await resp.json().catch(() => null);
      if (!resp.ok) {
        console.error('Submission failed:', resp.status, respBody);
      } else {
        console.log('Submission response:', respBody);
      }
    } catch (err) {
      console.error('Error preparing/submitting quiz:', err);
    }

    setPersistState(prev => ({ ...prev, isSubmitted: true }));
  }, [stopTimer, getResults, getScore, state.userEmail, state.timeRemaining, API_BASE]);


  const resetQuiz = useCallback(() => {
    stopTimer();
    setPersistState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      visitedQuestions: new Set([0]),
      isLoading: false,
      error: null,
      isSubmitted: false,
      timeRemaining: QUIZ_DURATION,
      userEmail: '',
    });
  }, [stopTimer]);

  // If email exists on load and no questions fetched, fetch them automatically
  useEffect(() => {
    if (state.userEmail && state.questions.length === 0 && !state.isLoading) {
      fetchQuestions();
    }
  }, [state.userEmail]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startQuiz,
    startTimer,
    goToQuestion,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    getResults,
    getScore,
    resetQuiz,
  };
}
