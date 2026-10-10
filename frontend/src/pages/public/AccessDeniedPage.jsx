import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export const AccessDeniedPage = () => {
  return (
    <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1.5rem' }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'var(--danger-light)',
        color: 'var(--danger)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <ShieldAlert size={36} />
      </div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Denied (403)</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '440px', marginBottom: '2rem', lineHeight: 1.6 }}>
        You do not have the required role permissions to view this protected resource.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={18} /> Back to Safety
      </Link>
    </div>
  );
};
