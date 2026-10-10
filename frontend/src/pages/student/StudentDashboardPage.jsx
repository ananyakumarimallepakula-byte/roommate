import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { profileApi, requestApi, accommodationApi } from '../../services/api';
import { Users, Heart, Send, Inbox, Building2, Sliders, ArrowRight, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profRes, prefRes, recRes, savedRes] = await Promise.all([
          profileApi.getStudentProfile(),
          profileApi.getPreferences(),
          requestApi.getReceived({ page: 0, size: 5 }),
          accommodationApi.getSavedListings({ page: 0, size: 1 })
        ]);
        if (profRes.data) setProfile(profRes.data);
        if (prefRes.data) setPreferences(prefRes.data);
        if (recRes.data) setReceivedRequests(recRes.data.content || []);
        if (savedRes.data) setSavedCount(savedRes.data.totalElements || 0);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading student dashboard..." />;
  }

  const isProfileComplete = profile?.isCompleted;

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Welcome Banner */}
        <div className="card" style={{ padding: '2rem 2.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 100%)', border: '1px solid #E0E7FF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Student Portal</span>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {user?.fullName}!</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {profile?.college || 'University Student'} • {profile?.course || ''}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/student/matches" className="btn btn-primary">
                <Sparkles size={16} /> View Roommate Matches
              </Link>
              <Link to="/rooms" className="btn btn-outline">
                <Building2 size={16} /> Browse Rooms
              </Link>
            </div>
          </div>

          {/* Profile Completion Callout */}
          {!isProfileComplete && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem 1.25rem',
              background: '#FEF3C7',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <strong style={{ color: '#92400E', fontSize: '0.9rem' }}>Complete your profile &amp; roommate preferences</strong>
                <p style={{ color: '#B45309', fontSize: '0.8125rem' }}>
                  Setting your sleep habits, study schedule, and college ensures accurate compatibility matching.
                </p>
              </div>
              <Link to="/student/preferences" className="btn btn-sm btn-primary" style={{ background: '#D97706', borderColor: '#D97706' }}>
                Set Preferences
              </Link>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
          
          <Link to="/student/matches" className="card card-interactive" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Roommate Matches</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} />
              </div>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Algorithm Ready</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Explore Matches &rarr;</span>
          </Link>

          <Link to="/student/saved" className="card card-interactive" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Saved Listings</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} />
              </div>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{savedCount}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Properties Bookmarked</span>
          </Link>

          <Link to="/student/requests/received" className="card card-interactive" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Incoming Requests</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Inbox size={18} />
              </div>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{receivedRequests.length}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}>Manage Connections &rarr;</span>
          </Link>

          <Link to="/student/preferences" className="card card-interactive" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Preferences</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sliders size={18} />
              </div>
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.4rem' }}>
              {preferences?.preferredCity ? preferences.preferredCity : 'Not set'}
            </p>
            <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600 }}>Edit Criteria &rarr;</span>
          </Link>

        </div>

        {/* Incoming Requests Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="dash-grid">
          
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Incoming Connection Requests</h3>
              <Link to="/student/requests/received" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
                View All
              </Link>
            </div>
            <div className="card-body">
              {receivedRequests.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {receivedRequests.map((req) => (
                    <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{req.sender?.fullName}</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          Status: <strong style={{ color: req.status === 'PENDING' ? '#D97706' : '#10B981' }}>{req.status}</strong>
                        </p>
                        {req.message && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                            "{req.message}"
                          </p>
                        )}
                      </div>
                      <Link to="/student/requests/received" className="btn btn-outline btn-sm">
                        Review
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No pending connection requests. When students match and want to connect, their requests appear here.
                </div>
              )}
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Student Hub</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/student/profile" className="btn btn-outline btn-sm" style={{ justifyContent: 'space-between' }}>
                <span>Edit Academic Profile</span> <ArrowRight size={14} />
              </Link>
              <Link to="/student/preferences" className="btn btn-outline btn-sm" style={{ justifyContent: 'space-between' }}>
                <span>Edit Living Preferences</span> <ArrowRight size={14} />
              </Link>
              <Link to="/student/matches" className="btn btn-outline btn-sm" style={{ justifyContent: 'space-between' }}>
                <span>View Roommate Matches</span> <ArrowRight size={14} />
              </Link>
              <Link to="/student/requests/sent" className="btn btn-outline btn-sm" style={{ justifyContent: 'space-between' }}>
                <span>Track Sent Requests</span> <ArrowRight size={14} />
              </Link>
              <Link to="/student/enquiries" className="btn btn-outline btn-sm" style={{ justifyContent: 'space-between' }}>
                <span>My Property Enquiries</span> <ArrowRight size={14} />
              </Link>
              <Link to="/messages" className="btn btn-outline btn-sm" style={{ justifyContent: 'space-between' }}>
                <span>Direct Messages</span> <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
