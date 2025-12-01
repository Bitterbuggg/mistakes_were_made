// TechVoc-specific phishing quiz scenarios
export const scenarios = {
  'phishing-email-1': {
    title: 'Suspicious Email Detected',
    description: 'You received this email. Determine if it is a phishing attempt.',
    emailFrom: 'security@qcu-alert.com',
    emailSubject: 'URGENT: Verify Your Account Now!',
    emailBody: `Dear Student,

Your QCU account has been flagged for suspicious activity. To prevent suspension, you must verify your identity immediately by clicking the link below:

http://qcu-verify-account.suspicious-link.com/login

Failure to verify within 24 hours will result in permanent account deletion.

QCU IT Security Team`,
    question: 'Is this email legitimate or a phishing attempt?',
    answers: [
      { id: 'a', text: 'Legitimate - It is from the security team' },
      { id: 'b', text: 'Phishing - The sender domain and urgency are suspicious' },
      { id: 'c', text: 'Legitimate - It has official-looking formatting' },
      { id: 'd', text: 'Unsure - I should click the link to check' }
    ],
    correctAnswer: 'b',
    explanation: 'This is a phishing email! Red flags include: suspicious domain (qcu-alert.com instead of official QCU domain), urgent threats, external link requesting credentials, and poor grammar. Never click suspicious links or provide credentials via email.'
  },

  'phishing-email-2': {
    title: 'Prize Notification',
    description: 'You received this email about winning a prize. Is it safe?',
    emailFrom: 'no-reply@qcu-lottery.xyz',
    emailSubject: 'Congratulations! You Won ₱50,000!',
    emailBody: `Dear Lucky Winner,

Congratulations! Your email has been randomly selected in the QCU Anniversary Raffle Draw. You have won ₱50,000!

To claim your prize, please provide the following information:
- Full Name
- Student ID Number
- Bank Account Details
- Password for verification

Send details to: claims@qcu-lottery.xyz

Prize expires in 48 hours!`,
    question: 'Should you respond to this email?',
    answers: [
      { id: 'a', text: 'Yes - I might have won something' },
      { id: 'b', text: 'No - This is clearly a phishing scam' },
      { id: 'c', text: 'Yes - But verify with QCU first' },
      { id: 'd', text: 'Maybe - The prize amount seems legitimate' }
    ],
    correctAnswer: 'b',
    explanation: 'This is a phishing scam! Warning signs: unsolicited prize notification, requests for sensitive information (passwords, bank details), suspicious domain (.xyz), artificial urgency (48-hour expiry). Legitimate organizations NEVER ask for passwords via email.'
  },

  'phishing-email-3': {
    title: 'IT Support Request',
    description: 'An email claims to be from IT support. Analyze it carefully.',
    emailFrom: 'itsupport@qcu.edu.ph',
    emailSubject: 'System Maintenance - Password Reset Required',
    emailBody: `Dear QCU Community Member,

We are performing system maintenance this weekend. All users must reset their passwords to ensure system security.

Please click here to reset your password: http://bit.ly/qcu-reset

This is mandatory for all students and staff. Accounts that don't comply will be temporarily suspended.

Thank you for your cooperation.
QCU IT Department`,
    question: 'What should you do with this email?',
    answers: [
      { id: 'a', text: 'Click the link immediately to avoid suspension' },
      { id: 'b', text: 'Suspicious - Verify with IT department directly first' },
      { id: 'c', text: 'Trust it - The email domain looks official' },
      { id: 'd', text: 'Forward it to all classmates' }
    ],
    correctAnswer: 'b',
    explanation: 'While the domain looks official, this email has red flags: uses a URL shortener (bit.ly) instead of official QCU domain, threatens account suspension, and forces immediate action. Always verify password reset requests by contacting IT directly through official channels, never through email links.'
  }
};
