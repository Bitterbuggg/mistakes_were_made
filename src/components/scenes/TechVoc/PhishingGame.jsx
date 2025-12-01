import React, { useState, useEffect } from 'react';
import questions from '../../../data/phishingQuestions';
import QuestionDisplay from './QuestionDisplay';
import FeedbackDisplay from './FeedbackDisplay';
import ResultDisplay from './ResultDisplay';

export default function PhishingGame({ onClose }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('PhishingGame mounted!');
    setTimeout(() => setIsVisible(true), 10);
    return () => console.log('PhishingGame unmounted');
  }, []);

  const handleAnswer = (index) => {
    const isCorrect = index === questions[currentQuestionIndex].correctIndex;
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ isCorrect: true, message: "Correct! " + questions[currentQuestionIndex].explanation });
    } else {
      setFeedback({ isCorrect: false, message: "Incorrect. " + questions[currentQuestionIndex].explanation });
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleReplay = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setFeedback(null);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-200"
      style={{ 
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transition-transform duration-200"
        style={{
          transform: isVisible ? 'scale(1)' : 'scale(0.9)'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">🎣 Spot the Phish!</h2>
          <button 
            onClick={handleClose} 
            className="text-white/80 hover:text-white text-3xl leading-none hover:scale-110 transition-transform"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {!showResult ? (
            !feedback ? (
              <QuestionDisplay 
                question={questions[currentQuestionIndex]}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                score={score}
                onAnswer={handleAnswer}
              />
            ) : (
              <FeedbackDisplay
                feedback={feedback}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                nextQuestion={nextQuestion}
              />
            )
          ) : (
            <ResultDisplay
              score={score}
              totalQuestions={questions.length}
              onReplay={handleReplay}
              onExit={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
