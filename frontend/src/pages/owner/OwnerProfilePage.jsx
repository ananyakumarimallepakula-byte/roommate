import React, { useState, useEffect } from 'react';
import { profileApi, userApi, uploadApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Building2, Upload, CheckCircle2, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const OwnerProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const res = await profileApi.getOwnerProfile();
        if (res.data) {
          setCompanyName(res.data.companyName || '');
          setAddress(res.data.address || '');
          setIsVerified(!!res.data.isVerified);
        }
        if (user) {
          setFullName(user.fullName || '');
          setPhone(user.phone || '');
          setAvatarUrl(user.avatarUrl || '');
        }
      } catch (err) {
        showError('Could not load owner profile');
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerProfile();
  }, [user, showError]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const res = await uploadApi.uploadAvatar(file);
      const url = res.data?.url;
      if (url) {
        setAvatarUrl(url);
        await userApi.updateMe({ fullName, phone, avatarUrl: url });
        refreshUser();
        showSuccess('Profile photo updated successfully');
      }
    } catch (err) {
      showError(err.message || 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Update basic user details
      await userApi.updateMe({ fullName, phone, avatarUrl });
      // Update owner specific profile
      await profileApi.updateOwnerProfile({ companyName, address });
      await refreshUser();
      showSuccess('Owner profile updated successfully');
    } catch (err) {
      showError(err.message || 'Failed to update owner profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Owner Profile</h1>
        <p className="text-secondary">
          Manage your personal details, property business information, and verification status.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '110px', height: '110px' }}>
          {avatarUrl ? (
            <img
              src={avatarUrl.startsWith('http') ? avatarUrl : `http://localhost:8080${avatarUrl}`}
              alt={fullName}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-500)' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'var(--primary-100)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 700
              }}
            >
              {fullName ? fullName.charAt(0).toUpperCase() : 'O'}
            </div>
          )}

          <label
            htmlFor="owner-avatar-input"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: 'var(--primary-600)',
              color: 'white',
              borderRadius: '50%',
              padding: '6px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Upload photo"
          >
            <Upload size={16} />
            <input
              id="owner-avatar-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
            />
          </label>
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{fullName || 'Property Owner'}</h2>
            {isVerified ? (
              <Badge variant="success">
                <ShieldCheck size={14} style={{ marginRight: '4px' }} /> Verified Owner
              </Badge>
            ) : (
              <Badge variant="warning">
                Pending Verification
              </Badge>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={15} /> {user?.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} /> {phone || 'No phone added'}
            </span>
            {companyName && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={15} /> {companyName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Personal & Contact Information
        </h3>

        <div className="grid grid-2" style={{ gap: '1.25rem' }}>
          <Input
            label="Full Name *"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Rajesh Verma"
            required
          />

          <Input
            label="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 98765 43210"
            required
          />
        </div>

        <Input
          label="Registered Email (Cannot be changed)"
          value={user?.email || ''}
          disabled
        />

        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginTop: '1rem' }}>
          Property / Business Details
        </h3>

        <Input
          label="Business or Agency / Property Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g. Royal Living PG & Hostels, or Rajesh Properties"
        />

        <div>
          <label className="input-label" htmlFor="business-address">Business / Office Address</label>
          <textarea
            id="business-address"
            className="input-field"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 42 MG Road, Sector 14, Near Metro Station, Delhi"
          />
        </div>

        {/* Verification explanation alert */}
        <div
          style={{
            background: isVerified ? 'var(--success-50, #f0fdf4)' : 'var(--primary-50, #eff6ff)',
            border: `1px solid ${isVerified ? 'var(--success-200, #bbf7d0)' : 'var(--primary-200, #bfdbfe)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}
        >
          {isVerified ? (
            <CheckCircle2 color="var(--success-600, #16a34a)" size={20} style={{ marginTop: '2px', flexShrink: 0 }} />
          ) : (
            <ShieldCheck color="var(--primary-600, #2563eb)" size={20} style={{ marginTop: '2px', flexShrink: 0 }} />
          )}
          <div style={{ fontSize: '0.9rem' }}>
            <strong>{isVerified ? 'Your account is verified' : 'Trust & Verification Status'}</strong>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
              {isVerified
                ? 'Your property listings display the verified badge to students, establishing high trust.'
                : 'Listing moderation and identity verification is managed by site administrators to ensure authentic accommodations for students.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Button type="submit" variant="primary" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
