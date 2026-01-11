import { useQuiz } from '@/hooks/useQuiz';
import { StartPage } from '@/components/quiz/StartPage';
import { QuizPage } from '@/components/quiz/QuizPage';
import { ReportPage } from '@/components/quiz/ReportPage';

const Index = () => {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    visitedQuestions,
    isLoading,
    error,
    isSubmitted,
    timeRemaining,
    userEmail,
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
  } = useQuiz();

  // Show start page if no email submitted
  if (!userEmail) {
    return <StartPage onStart={startQuiz} isLoading={isLoading} />;
  }

  // Show report page after submission
  if (isSubmitted) {
    return (
      <ReportPage
        results={getResults()}
        score={getScore()}
        userEmail={userEmail}
        onRetry={resetQuiz}
      />
    );
  }

  // Show quiz page
  return (
    <QuizPage
      questions={questions}
      currentQuestionIndex={currentQuestionIndex}
      userAnswers={userAnswers}
      visitedQuestions={visitedQuestions}
      timeRemaining={timeRemaining}
      isLoading={isLoading}
      error={error}
      onGoToQuestion={goToQuestion}
      onSelectAnswer={selectAnswer}
      onNext={nextQuestion}
      onPrev={prevQuestion}
      onSubmit={submitQuiz}
      onStartTimer={startTimer}
    />
  );
};

export default Index;
