import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Timer } from './Timer';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigation } from './QuestionNavigation';
import { Question } from '@/types/quiz';
import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface QuizPageProps {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<number, string>;
  visitedQuestions: Set<number>;
  timeRemaining: number;
  isLoading: boolean;
  error: string | null;
  onGoToQuestion: (index: number) => void;
  onSelectAnswer: (questionId: number, answer: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onStartTimer: () => void;
}

export function QuizPage({
  questions,
  currentQuestionIndex,
  userAnswers,
  visitedQuestions,
  timeRemaining,
  isLoading,
  error,
  onGoToQuestion,
  onSelectAnswer,
  onNext,
  onPrev,
  onSubmit,
  onStartTimer,
}: QuizPageProps) {
  useEffect(() => {
    if (questions.length > 0 && !isLoading) {
      onStartTimer();
    }
  }, [questions.length, isLoading, onStartTimer]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="text-lg text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display font-bold text-gradient">QuizMaster</h1>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {answeredCount} of {questions.length} answered
            </span>
          </div>
          <Timer timeRemaining={timeRemaining} />
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={userAnswers[currentQuestion.id]}
              onSelectAnswer={(answer) => onSelectAnswer(currentQuestion.id, answer)}
            />

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={onPrev}
                disabled={isFirstQuestion}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {!isLastQuestion ? (
                  <Button onClick={onNext} className="gap-2">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="gap-2 glow-sm">
                        <Send className="w-4 h-4" />
                        Submit Quiz
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You have answered {answeredCount} out of {questions.length} questions.
                          {answeredCount < questions.length && (
                            <span className="block mt-2 text-warning">
                              {questions.length - answeredCount} question(s) are unanswered.
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Review Answers</AlertDialogCancel>
                        <AlertDialogAction onClick={onSubmit}>
                          Submit Quiz
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigation */}
          <div className="order-first lg:order-last">
            <div className="lg:sticky lg:top-24">
              <QuestionNavigation
                totalQuestions={questions.length}
                currentIndex={currentQuestionIndex}
                visitedQuestions={visitedQuestions}
                answeredQuestions={userAnswers}
                onNavigate={onGoToQuestion}
              />

              <div className="mt-4 lg:hidden">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Send className="w-4 h-4" />
                      Submit Quiz
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You have answered {answeredCount} out of {questions.length} questions.
                        {answeredCount < questions.length && (
                          <span className="block mt-2 text-warning">
                            {questions.length - answeredCount} question(s) are unanswered.
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Review Answers</AlertDialogCancel>
                      <AlertDialogAction onClick={onSubmit}>
                        Submit Quiz
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
