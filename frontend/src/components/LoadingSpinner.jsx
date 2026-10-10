import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const dim = size === 'sm' ? 24 : size === 'lg' ? 48 : 36;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      gap: '1rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        width: `${dim}px`,
        height: `${dim}px`,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite'
      }}></div>
      {text && <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{text}</p>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
