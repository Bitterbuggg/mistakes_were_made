import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { scenarios } from './scenarios';

export default function TechVocUI({ 
  currentScenario, 
  onScenarioComplete,
  showExitPrompt,
  onConfirmExit,
  onCancelExit,
  onExitRequest
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const scenario = currentScenario ? scenarios[currentScenario] : null;

  const handleAnswerSelect = (answerId) => {
    if (showResult) return; // Prevent changing answer after submission
    setSelectedAnswer(answerId);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !scenario) return;

    const correct = selectedAnswer === scenario.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleContinue = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    onScenarioComplete();
  };

  return (
    <>
      {/* Exit Button */}
      <Motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 z-50"
        onClick={onExitRequest}
        style={{
          backgroundColor: '#ef4444',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '14px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Exit Building
      </Motion.button>

      {/* Exit Confirmation Modal */}
      {showExitPrompt && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <Motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              backgroundColor: '#ffffff',
              padding: '32px',
              borderRadius: '16px',
              maxWidth: '400px',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1a202c' }}>
              Exit TechVoc Building?
            </h2>
            <p style={{ fontSize: '16px', color: '#4a5568', marginBottom: '24px' }}>
              Are you sure you want to leave? Your progress will be saved.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={onConfirmExit}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Yes, Exit
              </button>
              <button
                onClick={onCancelExit}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#1a202c',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </Motion.div>
        </Motion.div>
      )}

      {/* Phishing Quiz Modal */}
      {scenario && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(200, 125, 12, 0.3)',
            zIndex: 9998
          }}
        >
          <Motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            style={{
              backgroundColor: '#FFFFFF',
              padding: '32px',
              borderRadius: '20px',
              maxWidth: '650px',
              width: '90%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(200, 125, 12, 0.4)',
              border: '2px solid #F9BD4B',
              position: 'relative'
            }}
          >
            {!showResult ? (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#C87D0C', marginBottom: '8px' }}>
                    {scenario.title}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#C87D0C', marginBottom: '0' }}>
                    {scenario.description}
                  </p>
                </div>

                {/* Email Content Display */}
                <div 
                  style={{
                    backgroundColor: '#FFE0A4',
                    border: '2px solid #F9BD4B',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                    <strong style={{ color: '#C87D0C' }}>From:</strong> {scenario.emailFrom}
                  </div>
                  <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                    <strong style={{ color: '#C87D0C' }}>Subject:</strong> {scenario.emailSubject}
                  </div>
                  <div style={{ marginTop: '10px', color: '#000000', lineHeight: '1.5', fontSize: '14px' }}>
                    {scenario.emailBody}
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#C87D0C', marginBottom: '12px' }}>
                  {scenario.question}
                </h3>

                {/* Answer Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {scenario.answers.map((answer) => (
                    <button
                      key={answer.id}
                      onClick={() => handleAnswerSelect(answer.id)}
                      style={{
                        backgroundColor: selectedAnswer === answer.id ? '#F9BD4B' : '#FFE0A4',
                        color: selectedAnswer === answer.id ? '#FFFFFF' : '#000000',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: selectedAnswer === answer.id ? '2px solid #C87D0C' : '2px solid #F9BD4B',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: selectedAnswer === answer.id ? 'bold' : 'normal',
                        fontSize: '14px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {answer.text}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  style={{
                    backgroundColor: selectedAnswer ? '#C87D0C' : '#cbd5e0',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                    fontSize: '15px',
                    width: '100%'
                  }}
                >
                  Submit Answer
                </button>
              </>
            ) : (
              <>
                {/* Result Display */}
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div 
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px'
                    }}
                  >
                    {isCorrect ? '✅' : '❌'}
                  </div>
                  <h2 
                    style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      color: isCorrect ? '#10b981' : '#ef4444',
                      marginBottom: '12px'
                    }}
                  >
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#C87D0C', marginBottom: '20px', lineHeight: '1.5' }}>
                    {scenario.explanation}
                  </p>
                  <button
                    onClick={handleContinue}
                    style={{
                      backgroundColor: '#C87D0C',
                      color: '#ffffff',
                      padding: '12px 32px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '15px'
                    }}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </Motion.div>
        </Motion.div>
      )}
    </>
  );
}
