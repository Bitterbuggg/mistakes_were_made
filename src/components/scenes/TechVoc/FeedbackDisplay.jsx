import React from 'react';

export default function FeedbackDisplay({ feedback, currentQuestionIndex, totalQuestions, nextQuestion }) {
  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-xl ${feedback.isCorrect ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-red-100 text-red-800 border-2 border-red-300'}`}>
        <p className="font-bold mb-2 text-lg">{feedback.isCorrect ? '✅ Correct!' : '❌ Wrong!'}</p>
        <p className="leading-relaxed">{feedback.message}</p>
      </div>
      <button
        onClick={nextQuestion}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors hover:shadow-lg active:scale-[0.98]"
      >
        {currentQuestionIndex < totalQuestions - 1 ? "Next Question →" : "See Results 🎯"}
      </button>
    </div>
  );
}