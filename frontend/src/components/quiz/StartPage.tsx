import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Clock, Target, ChevronRight } from 'lucide-react';

interface StartPageProps {
  onStart: (email: string) => void;
  isLoading: boolean;
}

export function StartPage({ onStart, isLoading }: StartPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    onStart(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 mb-6 glow">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-gradient">QuizMaster</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Test your knowledge across various categories
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="grid gap-4 mb-8">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">15 Questions</p>
                <p className="text-muted-foreground">From various categories</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">30 Minutes</p>
                <p className="text-muted-foreground">Auto-submit when time's up</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Enter your email to begin
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-secondary border-border focus:border-primary"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm text-destructive">{error}</p>
              )}
            </div>
            
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-base font-semibold glow-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Loading Questions...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Start Quiz
                  <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Questions sourced from Open Trivia Database
        </p>
      </div>
    </div>
  );
}
