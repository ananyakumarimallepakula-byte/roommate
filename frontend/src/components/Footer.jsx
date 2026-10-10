import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: '#0F172A', color: '#94A3B8', marginTop: 'auto', borderTop: '1px solid #1E293B' }}>
      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem' }}>
        <div className="grid grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#FFFFFF' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4F46E5, #0D9488)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Home size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>ROOMMATE</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              The comprehensive student accommodation and roommate compatibility platform. Verified properties, intelligent weighted matching, and secure communication.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#10B981' }}>
              <Shield size={16} /> Verified Platform &amp; Safe Housing
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem' }}>Discovery</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link to="/rooms" style={{ color: '#94A3B8' }} className="hover:text-white">Explore Accommodations</Link></li>
              <li><Link to="/rooms?type=PRIVATE" style={{ color: '#94A3B8' }}>Private Studio Rooms</Link></li>
              <li><Link to="/rooms?type=SHARED" style={{ color: '#94A3B8' }}>Shared Student Flats</Link></li>
              <li><Link to="/rooms?type=PG" style={{ color: '#94A3B8' }}>Verified Student PGs</Link></li>
            </ul>
          </div>

          {/* Platform & Community */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link to="/about" style={{ color: '#94A3B8' }}>About ROOMMATE</Link></li>
              <li><Link to="/contact" style={{ color: '#94A3B8' }}>Help &amp; Support</Link></li>
              <li><Link to="/privacy" style={{ color: '#94A3B8' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{ color: '#94A3B8' }}>Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem' }}>Contact &amp; Campus</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: '#4F46E5', flexShrink: 0 }} />
                <span>New Delhi, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: '#4F46E5', flexShrink: 0 }} />
                <span>support@roommate.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: '#4F46E5', flexShrink: 0 }} />
                <span>+91 (800) ROOMMATE</span>
              </div>
            </div>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid #1E293B',
          marginTop: '2.5rem',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8125rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} ROOMMATE Platform. Built with Spring Boot &amp; React.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/privacy" style={{ color: '#64748B' }}>Privacy</Link>
            <Link to="/terms" style={{ color: '#64748B' }}>Terms</Link>
            <Link to="/contact" style={{ color: '#64748B' }}>Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
