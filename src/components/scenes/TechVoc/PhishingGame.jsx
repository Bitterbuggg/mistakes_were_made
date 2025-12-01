import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useMemo, memo } from 'react';

const phishingQuestions = [
  {
    id: 1,
    title: "Netflix Email",
    text: "You receive an email from 'Netflix Support' asking you to update your payment details via a link. The sender address is support@netflix-updates.com. What do you do?",
    choices: [
      { text: "Verify the sender's domain", feedback: "Smart! Always check if the email comes from the official domain (netflix.com). This is likely phishing." },
      { text: "Click the link to update payment", feedback: "Dangerous! Never click suspicious links. Always go directly to the official website." },
      { text: "Reply with credit card details", feedback: "Never do this! Legitimate companies never ask for sensitive information via email." },
    ],
  },
  {
    id: 2,
    title: "Google Doc Link",
    text: "A colleague sends you a shared Google Doc link from their work email. It looks legitimate and you were expecting it. Is this safe?",
    choices: [
      { text: "Open it, since you were expecting it", feedback: "Correct! When the sender is known, the address is correct, and context matches expectations, it's likely safe." },
      { text: "Ignore it completely", feedback: "Too cautious. It's okay to open expected documents from known contacts after basic verification." },
      { text: "Forward to IT security first", feedback: "Unnecessary if you were expecting it from a known colleague. Trust but verify the basics." },
    ],
  },
  {
    id: 3,
    title: "Raffle Prize",
    text: "You get a text message saying you won a raffle you never entered, with a link to claim your prize. What's your response?",
    choices: [
      { text: "Delete immediately - it's a scam", feedback: "Excellent! If it sounds too good to be true, it usually is. Unsolicited prizes are classic phishing." },
      { text: "Click to see what it is", feedback: "Risky! Clicking unknown links can install malware or steal your information." },
      { text: "Share with friends", feedback: "Bad idea - you'd be spreading the scam to others. Report and delete instead." },
    ],
  },
  {
    id: 4,
    title: "Bank Phone Call",
    text: "Your bank calls and asks for your password to 'verify your identity.' What do you do?",
    choices: [
      { text: "Hang up and call the official number", feedback: "Perfect! Banks NEVER ask for passwords. Always verify by calling the official number yourself." },
      { text: "Provide your password", feedback: "Never! This is a major red flag. Legitimate banks never ask for passwords or PINs." },
      { text: "Give them your account number only", feedback: "Still dangerous! Don't share any sensitive information over an incoming call. Verify first." },
    ],
  },
  {
    id: 5,
    title: "Account Locked Warning",
    text: "You receive an email with 'Dear Customer' claiming your account is locked. Click here to verify immediately!",
    choices: [
      { text: "Go directly to the website instead", feedback: "Great! Generic greetings and urgency are phishing signs. Always use official channels." },
      { text: "Click the verification link", feedback: "Risky! Phishing emails use urgency to make you act without thinking. Verify through official means." },
      { text: "Reply asking what account", feedback: "Don't engage! This confirms your email is active. Check official websites instead." },
    ],
  },
];

const ChoiceButton = memo(({ choice, onChoice }) => (
  <motion.button
    onClick={() => onChoice(choice)}
    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-blue-100 transition text-left border border-blue-700/50 shadow-lg"
    whileTap={{ scale: 0.98 }}
  >
    {choice.text}
  </motion.button>
));

ChoiceButton.displayName = 'ChoiceButton';

export default function PhishingGame({ onQuizComplete, onExitQuiz }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const question = useMemo(() => phishingQuestions[index], [index]);

  const handleChoice = useCallback((choice) => {
    setFeedback(choice.feedback);
  }, []);

  const handleNext = useCallback(() => {
    setFeedback(null);
    if (index < phishingQuestions.length - 1) {
      setIndex(prev => prev + 1);
      if (onQuizComplete) onQuizComplete();
    } else {
      setIsCompleted(true);
      if (onQuizComplete) onQuizComplete();
    }
  }, [index, onQuizComplete]);

  const handleExit = useCallback(() => {
    if (onExitQuiz) onExitQuiz();
  }, [onExitQuiz]);

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col justify-center items-center p-6 bg-black/70 z-[9999]" style={{ pointerEvents: 'auto' }}>
      
      {/* Completion Screen */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            key="completion-screen"
            className="w-full h-full flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-blue-950 rounded-3xl shadow-2xl p-8 max-w-lg text-center border-2 border-blue-800"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-7xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-blue-100 mb-3">Well Done!</h2>
              <p className="text-blue-200 text-lg mb-4">
                You've completed the phishing awareness quiz!
              </p>
              <div className="bg-blue-950/50 rounded-2xl p-4 mb-6 border border-blue-800/50">
                <p className="text-blue-300 font-semibold mb-2">🎣 Skills Learned:</p>
                <ul className="text-left text-sm text-blue-200 space-y-1">
                  <li>✓ Email phishing detection</li>
                  <li>✓ URL verification techniques</li>
                  <li>✓ Social engineering awareness</li>
                  <li>✓ Password security best practices</li>
                  <li>✓ Safe communication protocols</li>
                </ul>
              </div>
              <motion.button
                onClick={handleExit}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-800 to-blue-900 text-blue-100 rounded-full font-semibold shadow-lg hover:shadow-xl transition border border-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Exploring
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Display */}
      <AnimatePresence mode="wait">
        {!feedback && !isCompleted && (
          <motion.div
            key={`question-${index}`}
            className="bg-gradient-to-br from-gray-900 to-blue-950 backdrop-blur-md rounded-3xl shadow-2xl p-6 max-w-2xl w-full border-2 border-blue-800/50"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 180, damping: 15 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="text-4xl">🎣</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-100">{question.title}</h3>
                <p className="text-sm text-blue-300">Question {index + 1} of {phishingQuestions.length}</p>
              </div>
            </div>
            
            <p className="text-blue-200 mb-6 leading-relaxed">{question.text}</p>
            
            <div className="space-y-3">
              {question.choices.map((choice, i) => (
                <ChoiceButton key={i} choice={choice} onChoice={handleChoice} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedback && !isCompleted && (
          <motion.div
            key="feedback"
            className="bg-gradient-to-br from-gray-900 to-blue-950 backdrop-blur-md rounded-3xl shadow-2xl p-6 max-w-2xl w-full border-2 border-blue-800/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="text-6xl mb-3"
              >
                {feedback.includes('Smart') || feedback.includes('Excellent') || feedback.includes('Perfect') || feedback.includes('Great') || feedback.includes('Correct') ? '✅' : '⚠️'}
              </motion.div>
              <p className="text-blue-100 text-lg leading-relaxed">{feedback}</p>
            </div>
            
            <motion.button
              onClick={handleNext}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-800 to-blue-900 text-blue-100 rounded-full font-semibold shadow-lg hover:shadow-xl transition border border-blue-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {index < phishingQuestions.length - 1 ? 'Next Question' : 'Complete'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
