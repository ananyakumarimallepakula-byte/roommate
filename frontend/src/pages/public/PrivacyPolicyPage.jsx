import React from 'react';

export const PrivacyPolicyPage = () => {
  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>Last updated: October 2026</p>

        <div className="card" style={{ padding: '2.5rem', lineHeight: 1.8, color: 'var(--text-main)', fontSize: '0.95rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. Information We Collect</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            We collect personal information that you provide when registering (name, email, phone number, university, and preferences). 
            We strictly protect sensitive personal data and do not publicly expose private phone numbers or exact residential coordinates without user consent.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. How We Use Your Preferences</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Roommate preferences (sleep schedule, study habits, budget, cleanliness) are used solely to run our deterministic matching engine to calculate compatibility percentages.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. Data Security</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            All user credentials are encrypted using industry-standard BCrypt hashing. Network communication uses stateless JWT tokens and HTTPS in production.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>4. Contact Us</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            For privacy inquiries or data requests, contact our privacy officer at privacy@roommate.com.
          </p>
        </div>
      </div>
    </div>
  );
};
