import React from 'react';
import { Shield, Users, Sparkles, Building2, Award } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>About Platform</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Empowering Student Living &amp; Harmonious Co-Living
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            ROOMMATE was developed to solve the twin challenges facing higher-education students: finding verified, safe accommodation and matching with compatible roommates.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Moving to a new university city is exciting, but securing dependable housing often turns into a fragmented, stressful ordeal plagued by misleading broker listings, opaque pricing, and incompatible flatmates. 
            ROOMMATE bridges this gap through a unified platform where property providers are vetted, listings are moderated, and students find flatmates based on transparent, data-driven lifestyle compatibility.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>The Roommate Compatibility Engine</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Rather than relying on arbitrary swiping or unscientific quizzes, our platform implements a 6-factor weighted algorithm evaluating budget window overlaps, campus location proximity, sleep circadian rhythms, study noise preferences, dietary boundaries, and shared interests.
          </p>
        </div>

        <div className="grid grid-cols-3">
          <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <Shield size={32} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Verified Housing</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Strict administrative moderation ensures zero fake listings or unverified properties.</p>
          </div>
          <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <Sparkles size={32} style={{ color: 'var(--secondary)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Weighted Matching</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>0-100% transparent score breakdowns explaining exact lifestyle alignments.</p>
          </div>
          <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <Users size={32} style={{ color: '#F59E0B', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Safe Communication</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Integrated messaging keeps your contact details protected until you decide to share them.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
