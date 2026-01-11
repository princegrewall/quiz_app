import { cn } from '@/lib/utils';
import { Check, Eye } from 'lucide-react';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentIndex: number;
  visitedQuestions: Set<number>;
  answeredQuestions: Record<number, string>;
  onNavigate: (index: number) => void;
}

export function QuestionNavigation({
  totalQuestions,
  currentIndex,
  visitedQuestions,
  answeredQuestions,
  onNavigate,
}: QuestionNavigationProps) {
  const getQuestionStatus = (index: number) => {
    const isAnswered = answeredQuestions[index] !== undefined;
    const isVisited = visitedQuestions.has(index);
    const isCurrent = index === currentIndex;

    return { isAnswered, isVisited, isCurrent };
  };

  return (
    <div className="glass-card rounded-xl p-4 animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Question Overview
      </h3>
      
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const { isAnswered, isVisited, isCurrent } = getQuestionStatus(index);
          
          return (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={cn(
                "question-dot relative",
                isCurrent && "question-dot-current",
                isAnswered 
                  ? "question-dot-attempted" 
                  : isVisited 
                    ? "question-dot-visited" 
                    : "question-dot-default"
              )}
            >
              {index + 1}
              {isAnswered && (
                <Check className="absolute -top-1 -right-1 w-3 h-3 text-success" />
              )}
              {!isAnswered && isVisited && (
                <Eye className="absolute -top-1 -right-1 w-3 h-3 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-secondary" />
          <span>Not visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-visited" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-attempted" />
          <span>Answered</span>
        </div>
      </div>
    </div>
  );
}
