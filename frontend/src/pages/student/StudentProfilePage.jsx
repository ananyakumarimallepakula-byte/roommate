import React, { useState, useEffect } from 'react';
import { profileApi, userApi, uploadApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { User, Upload, CheckCircle } from 'lucide-react';

export const StudentProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [profile, setProfile] = useState({
    college: '',
    course: '',
    studyYear: '',
    age: '',
    gender: 'PREFER_NOT_TO_SAY',
    bio: ''
  });

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileApi.getStudentProfile();
        if (res.data) {
          setProfile({
            college: res.data.college || '',
            course: res.data.course || '',
            studyYear: res.data.studyYear || '',
            age: res.data.age || '',
            gender: res.data.gender || 'PREFER_NOT_TO_SAY',
            bio: res.data.bio || ''
          });
        }
        if (user) {
          setFullName(user.fullName || '');
          setPhone(user.phone || '');
          setAvatarUrl(user.avatarUrl || '');
        }
      } catch (err) {
        showError('Could not load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, showError]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const res = await uploadApi.uploadAvatar(file);
      const url = res.data?.url;
      if (url) {
        setAvatarUrl(url);
        await userApi.updateMe({ fullName, phone, avatarUrl: url });
        refreshUser();
        showSuccess('Profile photo uploaded successfully!');
      }
    } catch (err) {
      showError(err.message || 'Avatar upload failed');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // 1. Update basic user details
      await userApi.updateMe({
        fullName: fullName.trim(),
        phone: phone.trim(),
        avatarUrl
      });

      // 2. Update student academic profile
      await profileApi.updateStudentProfile({
        ...profile,
        age: profile.age ? parseInt(profile.age, 10) : null
      });

      refreshUser();
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile details..." />;
  }

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=4F46E5&color=fff`;

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Account Details</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Student Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Keep your university and personal information up to date for potential roommates.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          
          {/* Avatar Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
            <img
              src={avatarUrl || defaultAvatar}
              alt={fullName}
              style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }}
              onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
            />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Profile Avatar</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                PNG, JPG or WebP up to 10MB
              </p>
              <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                <Upload size={14} /> {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Basic Information</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                placeholder="e.g. 21"
              />
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="form-select"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '1.25rem' }}>Academic Details</h3>

            <Input
              label="College / University"
              value={profile.college}
              onChange={(e) => setProfile({ ...profile, college: e.target.value })}
              placeholder="e.g. IIT Delhi, University of Delhi, DTU"
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              <Input
                label="Course / Degree"
                value={profile.course}
                onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                placeholder="e.g. B.Tech Computer Science"
                required
              />
              <div className="form-group">
                <label className="form-label">Study Year</label>
                <select
                  value={profile.studyYear}
                  onChange={(e) => setProfile({ ...profile, studyYear: e.target.value })}
                  className="form-select"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD Scholar">PhD Scholar</option>
                </select>
              </div>
            </div>

            <Input
              as="textarea"
              label="Bio &amp; About Me"
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell prospective flatmates about your daily routine, academic goals, and hobbies..."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button type="submit" variant="primary" loading={saving}>
                Save Changes
              </Button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
