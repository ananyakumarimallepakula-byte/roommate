import React, { useState } from 'react';
import { UserCheck, CheckCircle, Clock, MapPin, Sparkles, Send, Info } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { Modal } from './Modal';

export const RoommateCard = ({ match, onSendRequest }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const student = match.student;
  const profile = match.profile;
  const prefs = match.preferences;
  const score = match.overallScore;

  const getMeterClass = (val) => {
    if (val >= 85) return 'compat-circle-excellent';
    if (val >= 70) return 'compat-circle-great';
    if (val >= 55) return 'compat-circle-good';
    return 'compat-circle-moderate';
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.fullName || 'Student')}&background=4F46E5&color=fff`;

  return (
    <>
      <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="card-body" style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header with avatar & compatibility score */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={student?.avatarUrl || defaultAvatar}
                alt={student?.fullName}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
              />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {student?.fullName}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {profile?.college || 'Student'} • {profile?.studyYear || ''}
                </p>
                {profile?.course && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{profile?.course}</p>
                )}
              </div>
            </div>

            {/* Match Circle */}
            <div className={`compat-circle ${getMeterClass(score)}`} title={`Overall match score: ${score}%`}>
              {score}%
            </div>
          </div>

          {/* Location & Budget Row */}
          <div style={{ background: 'var(--bg-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={13} style={{ color: 'var(--primary)' }} /> Target Locality:
              </span>
              <span style={{ fontWeight: 600 }}>{prefs?.preferredLocality || prefs?.preferredCity || 'Flexible'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Budget Range:</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                ₹{Number(prefs?.minBudget || 0).toLocaleString()} - ₹{Number(prefs?.maxBudget || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Matching Criteria Highlights */}
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
              Compatibility Factors
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {match.factors?.map((f, i) => (
                <span
                  key={i}
                  className={`badge ${f.matched ? 'badge-success' : 'badge-neutral'}`}
                  style={{ fontSize: '0.7rem' }}
                  title={f.description}
                >
                  {f.factorName}: {Math.round(f.score)}%
                </span>
              ))}
            </div>
          </div>

          {/* Bio Preview */}
          {profile?.bio && (
            <p style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              "{profile.bio}"
            </p>
          )}

          {/* Action Row */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setDetailsOpen(true)}
            >
              <Info size={14} /> View Factors
            </Button>

            {match.connectionStatus === 'ACCEPTED' ? (
              <span className="badge badge-success" style={{ padding: '0.5rem 0.75rem' }}>
                <CheckCircle size={14} /> Connected
              </span>
            ) : match.connectionStatus === 'PENDING' ? (
              <span className="badge badge-warning" style={{ padding: '0.5rem 0.75rem' }}>
                <Clock size={14} /> Request Sent
              </span>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => onSendRequest(student)}
              >
                <Send size={14} /> Connect
              </Button>
            )}
          </div>

        </div>
      </div>

      {/* Match Factor Details Modal */}
      <Modal isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} title={`Match Breakdown: ${student?.fullName}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)' }}>
          <div className={`compat-circle ${getMeterClass(score)}`}>
            {score}%
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {match.matchTier} Compatibility Match
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Calculated using weighted multi-factor compatibility evaluation.
            </p>
          </div>
        </div>

        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Detailed Dimension Scores
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {match.factors?.map((f, idx) => (
            <div key={idx} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {f.factorName} ({f.weightPercentage}%)
                </span>
                <span className={`badge ${f.score >= 70 ? 'badge-success' : f.score >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                  {Math.round(f.score)}% Score
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => setDetailsOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};
