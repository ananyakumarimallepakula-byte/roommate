import React, { useState, useEffect } from 'react';
import { profileApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Sliders, Sparkles, MapPin, DollarSign, Heart, Moon, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EditPreferencesPage = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState({
    preferredCity: '',
    preferredLocality: '',
    minBudget: '',
    maxBudget: '',
    roomType: 'PRIVATE',
    targetMoveInDate: '',
    sleepSchedule: 'FLEXIBLE',
    studyHabit: 'MODERATE',
    cleanlinessLevel: 'MODERATE',
    smokingPreference: 'NON_SMOKER',
    petPreference: 'NO_PREFERENCE',
    foodPreference: 'ANY',
    interests: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await profileApi.getPreferences();
        if (res.data) {
          setPrefs({
            preferredCity: res.data.preferredCity || '',
            preferredLocality: res.data.preferredLocality || '',
            minBudget: res.data.minBudget || '',
            maxBudget: res.data.maxBudget || '',
            roomType: res.data.roomType || 'PRIVATE',
            targetMoveInDate: res.data.targetMoveInDate || '',
            sleepSchedule: res.data.sleepSchedule || 'FLEXIBLE',
            studyHabit: res.data.studyHabit || 'MODERATE',
            cleanlinessLevel: res.data.cleanlinessLevel || 'MODERATE',
            smokingPreference: res.data.smokingPreference || 'NON_SMOKER',
            petPreference: res.data.petPreference || 'NO_PREFERENCE',
            foodPreference: res.data.foodPreference || 'ANY',
            interests: res.data.interests || ''
          });
        }
      } catch (err) {
        showError('Could not load preferences');
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, [showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await profileApi.updatePreferences({
        ...prefs,
        minBudget: prefs.minBudget ? parseFloat(prefs.minBudget) : null,
        maxBudget: prefs.maxBudget ? parseFloat(prefs.maxBudget) : null
      });
      showSuccess('Roommate preferences saved! Matching engine updated.');
      navigate('/student/matches');
    } catch (err) {
      showError(err.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading preferences..." />;
  }

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Match Factors</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Roommate &amp; Living Preferences</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            These parameters feed into our 6-factor weighted algorithm to calculate compatibility scores with prospective flatmates.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            
            {/* 1. Location & Budget */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} style={{ color: 'var(--primary)' }} /> Location &amp; Budget Range (25% + 20% weight)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Target City"
                name="preferredCity"
                value={prefs.preferredCity}
                onChange={handleChange}
                placeholder="e.g. New Delhi"
                required
              />
              <Input
                label="Target Locality / Area"
                name="preferredLocality"
                value={prefs.preferredLocality}
                onChange={handleChange}
                placeholder="e.g. Hauz Khas, North Campus"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Minimum Budget (₹)"
                type="number"
                name="minBudget"
                value={prefs.minBudget}
                onChange={handleChange}
                placeholder="e.g. 8000"
                required
              />
              <Input
                label="Maximum Budget (₹)"
                type="number"
                name="maxBudget"
                value={prefs.maxBudget}
                onChange={handleChange}
                placeholder="e.g. 15000"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Desired Room Type</label>
                <select
                  name="roomType"
                  value={prefs.roomType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="PRIVATE">Private Room</option>
                  <option value="SHARED">Shared Room</option>
                  <option value="PG">Student PG</option>
                  <option value="HOSTEL">Hostel</option>
                  <option value="ANY">Any / Flexible</option>
                </select>
              </div>

              <Input
                label="Target Move-In Date"
                type="date"
                name="targetMoveInDate"
                value={prefs.targetMoveInDate}
                onChange={handleChange}
              />
            </div>

            {/* 2. Habits & Schedules */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <Moon size={18} style={{ color: 'var(--primary)' }} /> Study &amp; Sleep Habits (20% weight)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Sleep Schedule</label>
                <select
                  name="sleepSchedule"
                  value={prefs.sleepSchedule}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="EARLY_BIRD">Early Bird (Sleeps before 11 PM)</option>
                  <option value="NIGHT_OWL">Night Owl (Sleeps late after 1 AM)</option>
                  <option value="FLEXIBLE">Flexible / Varies</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Study Environment</label>
                <select
                  name="studyHabit"
                  value={prefs.studyHabit}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="SILENT_STUDY">Pin-drop Silence Required</option>
                  <option value="GROUP_STUDY">Enjoys Group Study / Discussions</option>
                  <option value="MUSIC">Studies with Background Music</option>
                  <option value="MODERATE">Moderate / Easy-going</option>
                </select>
              </div>
            </div>

            {/* 3. Lifestyle & Boundaries */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <Heart size={18} style={{ color: 'var(--primary)' }} /> Lifestyle &amp; Cleanliness (20% weight)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Cleanliness Standards</label>
                <select
                  name="cleanlinessLevel"
                  value={prefs.cleanlinessLevel}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="VERY_CLEAN">Strictly Clean &amp; Organized Daily</option>
                  <option value="MODERATE">Moderate Cleanliness</option>
                  <option value="RELAXED">Relaxed / Laid Back</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Smoking Policy</label>
                <select
                  name="smokingPreference"
                  value={prefs.smokingPreference}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="NON_SMOKER">Strict Non-Smoker</option>
                  <option value="OUTSIDE_ONLY">Balcony / Outside Only</option>
                  <option value="SMOKER">Smoker</option>
                  <option value="NO_PREFERENCE">No Preference</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Pet Preference</label>
                <select
                  name="petPreference"
                  value={prefs.petPreference}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="NO_PETS">No Pets Allowed</option>
                  <option value="PET_FRIENDLY">Pet Friendly</option>
                  <option value="HAS_PETS">I Have a Pet</option>
                  <option value="NO_PREFERENCE">No Preference</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Food / Dietary Preference</label>
                <select
                  name="foodPreference"
                  value={prefs.foodPreference}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="ANY">Any / No Dietary Restriction</option>
                  <option value="VEGETARIAN">Vegetarian Only</option>
                  <option value="NON_VEGETARIAN">Non-Vegetarian Friendly</option>
                  <option value="VEGAN">Vegan</option>
                </select>
              </div>
            </div>

            {/* 4. Interests & Hobbies */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <Sparkles size={18} style={{ color: 'var(--primary)' }} /> Shared Hobbies &amp; Interests (5% weight)
            </h3>

            <Input
              label="Interests (Comma-separated)"
              name="interests"
              value={prefs.interests}
              onChange={handleChange}
              placeholder="e.g. Coding, Gaming, Reading, Gym, Music, Cooking, Yoga"
              hint="Common interests boost connection scores and provide conversation starters."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Button type="button" variant="outline" onClick={() => navigate('/student/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Preferences &amp; View Matches
              </Button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
