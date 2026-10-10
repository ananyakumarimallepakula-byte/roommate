import React from 'react';

export const TermsPage = () => {
  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>Last updated: October 2026</p>

        <div className="card" style={{ padding: '2.5rem', lineHeight: 1.8, color: 'var(--text-main)', fontSize: '0.95rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. Platform Nature</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            ROOMMATE operates as an informational matchmaking and accommodation directory platform. 
            A compatible roommate match or sent enquiry does not constitute a legally binding rental lease. Rental agreements are negotiated directly between students and property owners.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. User Code of Conduct</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Users must provide authentic academic and personal information. Impersonation, harassment, discrimination, or publishing misleading property photos violates our terms and results in immediate suspension.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. Accommodation Listings</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Owners must hold appropriate rights or authority to list properties. All listings are subject to administrative review and may be removed if found in violation.
          </p>
        </div>
      </div>
    </div>
  );
};
