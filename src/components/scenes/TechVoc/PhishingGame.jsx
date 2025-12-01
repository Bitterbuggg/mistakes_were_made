import React, { useState } from 'react';
import { motion } from 'framer-motion';

const questions = [
  {
    id: 1,
    text: "You receive an email from 'Netflix Support' asking you to update your payment details via a link. The sender address is `support@netflix-updates.com`. Is this phishing?",
    options: ["Yes, it's phishing", "No, it's legitimate"],
    correctIndex: 0,
    explanation: "Legitimate companies usually send emails from their official domain (e.g., netflix.com). Subdomains or variations like 'netflix-updates.com' are common indicators of phishing."
  },
  {
    id: 2,
    text: "A colleague sends you a shared Google Doc link from their work email. It looks legitimate and you were expecting it. Is this phishing?",
    options: ["Yes, it's phishing", "No, it's legitimate"],
    correctIndex: 1,
    explanation: "If the sender is known, the address is correct, and the context matches your expectations, it is likely safe. Always verify out-of-band if unsure."
  },
  {
    id: 3,
    text: "You get a text message saying you won a raffle you never entered, with a link to claim the prize. Is this phishing?",
    options: ["Yes, it's phishing", "No, it's legitimate"],
    correctIndex: 0,
    explanation: "If it sounds too good to be true, it usually is. Unsolicited prize claims are a classic phishing tactic."
  },
  {
    id: 4,
    text: "Your bank calls you and asks for your password to verify your identity. Is this phishing?",
    options: ["Yes, it's phishing", "No, it's legitimate"],
    correctIndex: 0,
    explanation: "Banks and legitimate support teams will NEVER ask for your password or PIN over the phone or email."
  },
  {
    id: 5,
    text: "You receive an email with a generic greeting 'Dear Customer' claiming your account is locked. Is this phishing?",
    options: ["Yes, it's phishing", "No, it's legitimate"],
    correctIndex: 0,
    explanation: "Generic greetings and urgency are common signs of phishing. Legitimate organizations usually use your name."
  }
];

export default function PhishingGame({ onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, message: string }

  const handleAnswer = (index) => {
    const isCorrect = index === questions[currentQuestion].correctIndex;
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ isCorrect: true, message: "Correct! " + questions[currentQuestion].explanation });
    } else {
      setFeedback({ isCorrect: false, message: "Incorrect. " + questions[currentQuestion].explanation });
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">Spot the Phish!</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Body */}
        <div className="p-8">
          {!showResult ? (
            <>
              <div className="mb-6 flex justify-between text-sm font-medium text-gray-500">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
                {questions[currentQuestion].text}
              </h3>

              {!feedback ? (
                <div className="grid gap-4">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-700"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-4 rounded-xl ${feedback.isCorrect ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                    <p className="font-bold mb-1">{feedback.isCorrect ? '✅ Correct!' : '❌ Wrong!'}</p>
                    <p>{feedback.message}</p>
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">
                {score === questions.length ? '🏆' : score >= 3 ? '👍' : '📚'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
              <p className="text-xl text-gray-600 mb-8">
                You scored <span className="font-bold text-blue-600">{score}</span> out of {questions.length}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors"
                >
                  Exit Game
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
