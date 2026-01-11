import { cn } from '@/lib/utils';
import { Question } from '@/types/quiz';
import { Badge } from '@/components/ui/badge';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | undefined;
  onSelectAnswer: (answer: string) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success/20 text-success border-success/30';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'hard':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm font-medium text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </span>
        <Badge variant="outline" className={cn("capitalize", getDifficultyColor(question.difficulty))}>
          {question.difficulty}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {question.category}
        </Badge>
      </div>

      <h2 className="text-xl md:text-2xl font-display font-semibold mb-8 leading-relaxed">
        {question.question}
      </h2>

      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(option)}
            className={cn(
              "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
              "hover:border-primary/50 hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              selectedAnswer === option
                ? "border-primary bg-primary/10 glow-sm"
                : "border-border bg-secondary/30"
            )}
          >
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold",
                  selectedAnswer === option
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-foreground">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
