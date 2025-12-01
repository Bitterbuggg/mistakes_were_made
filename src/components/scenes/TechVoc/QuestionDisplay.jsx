import React from 'react';

export default function QuestionDisplay({ question, currentQuestionIndex, totalQuestions, score, onAnswer }) {
  return (
    <>
      <div className="mb-6 flex justify-between text-sm font-medium text-gray-500">
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        <span className="text-blue-600 font-bold">Score: {score}</span>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
        {question.text}
      </h3>

      <div className="grid gap-4">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(idx)}
            className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-700 hover:shadow-md active:scale-[0.98]"
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
}