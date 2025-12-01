import React from 'react';

export default function ResultDisplay({ score, totalQuestions, onReplay, onExit }) {
  return (
    <div className="text-center py-8">
      <div className="text-7xl mb-6 animate-bounce">
        {score === totalQuestions ? '🏆' : score >= totalQuestions / 2 ? '👍' : '📚'}
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Quiz Complete!</h2>
      <p className="text-xl text-gray-600 mb-8">
        You scored <span className="font-bold text-blue-600 text-3xl">{score}</span> out of <span className="font-bold text-gray-700">{totalQuestions}</span>
      </p>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700">
          {score === totalQuestions && "Perfect! You're a phishing expert! 🎉"}
          {score >= totalQuestions / 2 && score < totalQuestions && "Great job! Keep learning about cybersecurity! 💪"}
          {score < totalQuestions / 2 && "Keep practicing! Cybersecurity is important! 📖"}
        </p>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={onReplay}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors hover:shadow-lg active:scale-[0.98]"
        >
          🔄 Play Again
        </button>
        <button
          onClick={onExit}
          className="px-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors hover:shadow-lg active:scale-[0.98]"
        >
          ✕ Exit Game
        </button>
      </div>
    </div>
  );
}