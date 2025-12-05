import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

export default function FirewallUI({ gameState, score, health, onStart, onExit, onRestart }) {
  // Common styles
  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem', // p-8
    borderRadius: '1rem', // rounded-2xl
    maxWidth: '28rem', // max-w-md
    textAlign: 'center',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
    borderWidth: '4px',
    borderStyle: 'solid',
  };

  const buttonBaseStyle = {
    padding: '0.75rem 1.5rem', // px-6 py-3
    borderRadius: '0.75rem', // rounded-xl
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  };

  return (
    <>
      {/* HUD: Score & Health */}
      {gameState === 'playing' && (
        <>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto', // Adjust width to content
            padding: '1rem',
            display: 'flex',
            justifyContent: 'center', // Center content horizontally
            alignItems: 'flex-start',
            pointerEvents: 'none',
            zIndex: 10,
            gap: '1.5rem', // Add some space between score and health
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              padding: '0.75rem 1rem', // Smaller padding
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: '2px solid #6366f1',
            }}>
              <div style={{ fontSize: '0.625rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>Security Score</div> {/* Even smaller font for label */}
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#4f46e5' }}>{score} / 1000</div> {/* Reduced score font size */}
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              padding: '0.75rem 1rem', // Smaller padding
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: '2px solid #6366f1',
            }}>
               <div style={{ fontSize: '0.625rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', textAlign: 'right' }}>Server Integrity</div> {/* Even smaller font for label */}
               <div style={{ display: 'flex', gap: '0.125rem', marginTop: '0.125rem' }}> {/* Smaller gap */}
                 {[...Array(5)].map((_, i) => (
                   <div 
                     key={i} 
                     style={{
                       width: '1.25rem', // Reduced width
                       height: '0.5rem', // Reduced height
                       borderRadius: '9999px',
                       transition: 'background-color 300ms',
                       backgroundColor: (health / 20) > i ? '#22c55e' : '#d1d5db',
                     }}
                   />
                 ))}
               </div>
               <div style={{ textAlign: 'right', marginTop: '0.125rem', fontWeight: 'bold', color: '#374151', fontSize: '0.75rem' }}>{health}%</div> {/* Reduced health percentage font size */}
            </div>
          </div>

          {/* Exit Button during gameplay */}
          <button 
            onClick={onExit}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            Exit
          </button>
        </>
      )}

      {/* Start Screen */}
      {gameState === 'start' && (
        <div style={{
          ...overlayStyle,
          backgroundColor: 'rgba(15, 23, 42, 0.8)', // bg-slate-900/80
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            ...cardStyle,
            borderColor: '#6366f1', // border-indigo-500
          }}>
            <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>🛡️</div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>Firewall Defense</h1>
            <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
              Protect the server! Click on the <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Red Malware</span> to destroy them. 
              Let the <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Green Safe Files</span> reach the center.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={onExit}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: '#64748b',
                  color: 'white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#475569'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
              >
                Exit
              </button>
              <button 
                onClick={onStart}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: '#4f46e5', // bg-indigo-600
                  color: 'white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
              >
                Start Defense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div style={{
          ...overlayStyle,
          backgroundColor: 'rgba(127, 29, 29, 0.8)', // bg-red-900/80
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            ...cardStyle,
            borderColor: '#ef4444', // border-red-500
          }}>
            <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>💀</div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>System Breached!</h1>
            <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
              The server was overwhelmed by malware.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={onExit}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: '#64748b',
                  color: 'white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#475569'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
              >
                Exit
              </button>
              <button 
                onClick={onRestart}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: '#dc2626', // bg-red-600
                  color: 'white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {gameState === 'win' && (
        <div style={{
          ...overlayStyle,
          backgroundColor: 'rgba(20, 83, 45, 0.8)', // bg-green-900/80
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            ...cardStyle,
            borderColor: '#22c55e', // border-green-500
          }}>
            <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>🏆</div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>System Secured!</h1>
            <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
              You successfully filtered the network traffic.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
               <button 
                onClick={onExit}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: '#16a34a', // bg-green-600
                  color: 'white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
              >
                Return to Campus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}