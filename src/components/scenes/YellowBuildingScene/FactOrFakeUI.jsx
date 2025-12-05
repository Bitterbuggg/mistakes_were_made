import React from 'react';

export default function FactOrFakeUI({ gameState, score, lives, onStart, onExit, onRestart }) {
  if (gameState === 'start') {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.title}>Fact or Fake?</h1>
          <p style={styles.text}>
            Run through the correct lane!
            <br />
            <strong>LEFT Lane (Real):</strong> True facts or safe links.
            <br />
            <strong>RIGHT Lane (Fake):</strong> Scams, lies, or malware.
          </p>
          <p style={styles.instruction}>Use &larr; Left / Right &rarr; Arrows</p>
          <button onClick={onStart} style={styles.button}>Start Running</button>
          <button onClick={onExit} style={{...styles.button, backgroundColor: '#ef4444', marginTop: '10px'}}>Exit</button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={{...styles.title, color: '#ef4444'}}>Game Over!</h1>
          <p style={styles.text}>You fell for too many scams.</p>
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
          <h1 style={{...styles.title, color: '#10b981'}}>Master Detective!</h1>
          <p style={styles.text}>You can spot a fake from a mile away.</p>
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
    color: '#fbbf24',
  },
  text: {
    marginBottom: '1.5rem',
    color: '#d1d5db',
    lineHeight: '1.5',
  },
  instruction: {
    color: '#3b82f6',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  button: {
    backgroundColor: '#fbbf24',
    color: 'black',
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
    alignItems: 'flex-start',
    pointerEvents: 'none',
    boxSizing: 'border-box',
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
    marginRight: 'auto',
    marginLeft: '1rem',
  },
  exitButton: {
    pointerEvents: 'auto',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
};
