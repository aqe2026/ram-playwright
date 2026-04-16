import { useState, useEffect } from 'react';

// ---------------------------------------------------------
// Quiz — Interactive knowledge check engine
// Provides instant feedback and score tracking
// ---------------------------------------------------------

export type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

interface QuizProps {
  module: string;
  questions: Array<Question>;
  onComplete?: (score: number) => void;
}

export default function Quiz({ module, questions, onComplete }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    
    const correct = selected === currentQuestion.correctAnswer;
    const newScore = score + (correct ? 1 : 0);
    if (correct) setScore(newScore);
    setIsAnswered(true);

    // Persist completion and score if it's the last question
    if (currentIdx === questions.length - 1) {
      const storedScores = JSON.parse(localStorage.getItem('quiz_scores') || '{}');
      storedScores[module] = newScore;
      localStorage.setItem('quiz_scores', JSON.stringify(storedScores));
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onComplete?.(score + (selected === currentQuestion.correctAnswer ? 1 : 0));
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelected(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    return (
      <div className="card p-8 text-center animate-scale-in" data-testid={`quiz-result-${module}`}>
        <div className="mb-4">
          <span className="text-6xl">
            {percentage === 100 ? '🏆' : percentage >= 70 ? '🌟' : '📚'}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-surface-800 mb-2">Quiz Complete!</h3>
        <p className="text-surface-600 mb-6">
          You scored <span className="font-bold text-primary-600">{finalScore} / {questions.length}</span> ({percentage}%)
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleReset} className="btn-secondary">Try Again</button>
          {percentage >= 70 && (
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <span className="badge-green">Module Mastered!</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6" data-testid={`quiz-${module}`}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
          Knowledge Check: {module}
        </span>
        <span className="text-xs font-medium text-surface-400">
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      <h3 className="text-lg font-bold text-surface-800 mb-6 leading-relaxed">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => {
          let stateClass = "border-surface-200 hover:border-primary-300 hover:bg-surface-50";
          if (selected === idx) {
            stateClass = "border-primary-500 bg-primary-50 ring-1 ring-primary-500";
          }
          if (isAnswered) {
            if (idx === currentQuestion.correctAnswer) {
              stateClass = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500";
            } else if (selected === idx) {
              stateClass = "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500 opacity-80";
            } else {
              stateClass = "border-surface-200 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium text-sm flex items-center justify-between ${stateClass}`}
              data-testid={`quiz-option-${idx}`}
            >
              <span>{option}</span>
              {isAnswered && idx === currentQuestion.correctAnswer && (
                <span className="text-emerald-600">✓</span>
              )}
              {isAnswered && selected === idx && idx !== currentQuestion.correctAnswer && (
                <span className="text-red-500">✕</span>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mb-8 p-4 bg-primary-50/50 rounded-xl border border-primary-100 animate-fade-in text-sm text-surface-700 italic">
          <p><strong>💡 Insight:</strong> {currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="btn-primary"
            data-testid="quiz-submit"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-primary"
            data-testid="quiz-next"
          >
            {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}
