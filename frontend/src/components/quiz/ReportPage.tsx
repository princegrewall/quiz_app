import { Button } from '@/components/ui/button';
import { QuizResult } from '@/types/quiz';
import { Check, X, RotateCcw, Trophy, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportPageProps {
  results: QuizResult[];
  score: { correct: number; total: number };
  userEmail: string;
  onRetry: () => void;
}

export function ReportPage({ results, score, userEmail, onRetry }: ReportPageProps) {
  const percentage = Math.round((score.correct / score.total) * 100);

  const getScoreMessage = () => {
    if (percentage >= 80) return { text: "Excellent!", color: "text-success" };
    if (percentage >= 60) return { text: "Good job!", color: "text-primary" };
    if (percentage >= 40) return { text: "Not bad!", color: "text-warning" };
    return { text: "Keep practicing!", color: "text-destructive" };
  };

  const { text: scoreMessage, color: scoreColor } = getScoreMessage();

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-display font-bold text-gradient">Quiz Results</h1>
          <p className="text-muted-foreground mt-1">{userEmail}</p>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-secondary flex items-center justify-center glow">
                <div className="text-center">
                  <Trophy className={cn("w-8 h-8 mx-auto mb-2", scoreColor)} />
                  <p className="text-4xl font-display font-bold">{percentage}%</p>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h2 className={cn("text-3xl font-display font-bold mb-2", scoreColor)}>
                {scoreMessage}
              </h2>
              <p className="text-xl text-muted-foreground mb-4">
                You got <span className="text-foreground font-semibold">{score.correct}</span> out of{' '}
                <span className="text-foreground font-semibold">{score.total}</span> questions correct
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-success">
                  <Check className="w-5 h-5" />
                  <span>{score.correct} Correct</span>
                </div>
                <div className="flex items-center gap-2 text-destructive">
                  <X className="w-5 h-5" />
                  <span>{score.total - score.correct} Incorrect</span>
                </div>
              </div>
            </div>

            <Button onClick={onRetry} size="lg" className="gap-2 glow-sm">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h3 className="text-xl font-display font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Detailed Review
          </h3>

          {results.map((result, index) => (
            <div
              key={result.question.id}
              className={cn(
                "glass-card rounded-xl p-6 animate-fade-in",
                result.isCorrect ? "border-l-4 border-l-success" : "border-l-4 border-l-destructive"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                    result.isCorrect ? "bg-success/20" : "bg-destructive/20"
                  )}
                >
                  {result.isCorrect ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <X className="w-5 h-5 text-destructive" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Question {index + 1}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                      {result.question.category}
                    </span>
                  </div>

                  <h4 className="text-lg font-medium mb-4">
                    {result.question.question}
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Your Answer</p>
                      <p className={cn(
                        "font-medium",
                        result.userAnswer 
                          ? result.isCorrect 
                            ? "text-success" 
                            : "text-destructive"
                          : "text-muted-foreground italic"
                      )}>
                        {result.userAnswer || "Not answered"}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-xs text-muted-foreground mb-1">Correct Answer</p>
                      <p className="font-medium text-success">
                        {result.question.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
