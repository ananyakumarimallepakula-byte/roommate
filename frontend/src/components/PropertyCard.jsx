import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Check, ExternalLink } from 'lucide-react';
import { accommodationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge } from './Badge';

export const PropertyCard = ({ accommodation, onSaveToggle }) => {
  const { isAuthenticated, role } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [isSaved, setIsSaved] = useState(accommodation.isSaved || false);
  const [saving, setSaving] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&fit=crop';
  const primaryImage = (accommodation.images && accommodation.images.length > 0)
    ? accommodation.images[0].imageUrl
    : fallbackImage;

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showInfo('Please log in to save accommodation listings.');
      return;
    }

    if (role !== 'STUDENT') {
      showInfo('Only students can save accommodations to favorites.');
      return;
    }

    try {
      setSaving(true);
      const res = await accommodationApi.toggleSave(accommodation.id);
      const nowSaved = res.data?.isSaved;
      setIsSaved(nowSaved);
      showSuccess(nowSaved ? 'Listing saved to favorites' : 'Listing removed from favorites');
      if (onSaveToggle) onSaveToggle(accommodation.id, nowSaved);
    } catch (err) {
      showError(err.message || 'Could not update saved listing');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'INR'
    });
  };

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Property Photo */}
      <div style={{ position: 'relative', width: '100%', height: '210px', overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
        <img
          src={primaryImage}
          alt={accommodation.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
        />

        {/* Room Type Pill */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <Badge status={accommodation.roomType} variant="primary" />
        </div>

        {/* Save Heart Button */}
        <button
          onClick={handleToggleSave}
          disabled={saving}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.2s ease'
          }}
          title={isSaved ? "Remove from saved" : "Save listing"}
        >
          <Heart
            size={18}
            fill={isSaved ? '#EF4444' : 'none'}
            color={isSaved ? '#EF4444' : '#64748B'}
          />
        </button>

        {/* Price Tag Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          color: '#FFF',
          padding: '0.35rem 0.75rem',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.95rem'
        }}>
          {formatCurrency(accommodation.rent)}
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#CBD5E1' }}> / mo</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body" style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
          <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {accommodation.locality}, {accommodation.city}
          </span>
        </div>

        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          color: 'var(--text-main)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {accommodation.title}
        </h3>

        {/* Feature Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
          <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
            {accommodation.furnishingStatus?.replace('_', ' ')}
          </span>
          {accommodation.genderPreference && accommodation.genderPreference !== 'ANY' && (
            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
              {accommodation.genderPreference?.replace('_', ' ')}
            </span>
          )}
          {accommodation.availabilityStatus === 'AVAILABLE' && (
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              Available Now
            </span>
          )}
        </div>

        {/* Bottom Action */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Deposit: {formatCurrency(accommodation.securityDeposit)}
          </div>
          <Link to={`/rooms/${accommodation.id}`} className="btn btn-outline btn-sm">
            View Details <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
