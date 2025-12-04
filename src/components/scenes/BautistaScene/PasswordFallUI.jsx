import React from 'react';

export default function PasswordFallUI({ gameState, score, lives, onStart, onExit, onRestart }) {
  if (gameState === 'start') {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.title}>Password Fall</h1>
          <p style={styles.text}>
            Secure passwords are falling! Catch the <strong>STRONG</strong> ones.
            <br />
            Let the <strong>WEAK</strong> ones fall and be destroyed.
          </p>
          <p style={styles.instruction}>Click to Catch</p>
          <button onClick={onStart} style={styles.button}>Start Game</button>
          <button onClick={onExit} style={{...styles.button, backgroundColor: '#ef4444', marginTop: '10px'}}>Exit</button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={{...styles.title, color: '#ef4444'}}>Security Breach!</h1>
          <p style={styles.text}>Final Score: {score}</p>
          <button onClick={onRestart} style={styles.button}>Try Again</button>
          <button onClick={onExit} style={{...styles.button, backgroundColor: '#6b7280', marginTop: '10px'}}>Leave</button>
        </div>
      </div>
    );
  }

  if (gameState === 'win') {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={{...styles.title, color: '#10b981'}}>System Secure!</h1>
          <p style={styles.text}>Great job filtering the passwords.</p>
          <p style={styles.text}>Score: {score}</p>
          <button onClick={onExit} style={styles.button}>Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.hud}>
      <div style={styles.scoreBox}>Score: {score}</div>
      <div style={styles.livesBox}>Lives: {'❤️'.repeat(lives)}</div>
      <button onClick={onExit} style={styles.exitButton}>Exit</button>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
  card: {
    backgroundColor: '#1f2937',
    padding: '2rem',
    borderRadius: '1rem',
    textAlign: 'center',
    color: 'white',
    maxWidth: '400px',
    border: '1px solid #374151',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#60a5fa',
  },
  text: {
    marginBottom: '1.5rem',
    color: '#d1d5db',
    lineHeight: '1.5',
  },
  instruction: {
    color: '#fbbf24',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    width: '100%',
  },
  hud: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: 'none', // Let clicks pass through to canvas
  },
  scoreBox: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  livesBox: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '1.2rem',
  },
  exitButton: {
    pointerEvents: 'auto',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
};
