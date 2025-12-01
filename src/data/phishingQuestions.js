const questions = [
  {
    id: 1,
    text: "You receive an email from 'Netflix Support' asking you to update your payment details via a link. The sender address is support@netflix-updates.com. Is this phishing?",
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

export default questions;
