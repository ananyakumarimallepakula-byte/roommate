import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { accommodationApi, enquiryApi } from '../../services/api';
import { PlusCircle, Building2, CheckCircle, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const [listRes, enqRes] = await Promise.all([
          accommodationApi.getMyListings({ page: 0, size: 5 }),
          enquiryApi.getOwnerEnquiries({ page: 0, size: 5 })
        ]);
        if (listRes.data) setListings(listRes.data.content || []);
        if (enqRes.data) setEnquiries(enqRes.data.content || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading owner dashboard..." />;
  }

  const totalCount = listings.length;
  const approvedCount = listings.filter((l) => l.moderationStatus === 'APPROVED').length;
  const pendingCount = listings.filter((l) => l.moderationStatus === 'PENDING').length;
  const pendingEnquiries = enquiries.filter((e) => e.status === 'PENDING').length;

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Banner */}
        <div className="card" style={{ padding: '2rem 2.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, #F0FDFA 0%, #FFFFFF 100%)', border: '1px solid #CCFBF1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Accommodation Provider</span>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {user?.fullName}!</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Manage your student properties, respond to student enquiries, and track listing statuses.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/owner/add-accommodation" className="btn btn-primary" style={{ background: '#0D9488' }}>
                <PlusCircle size={16} /> Add New Listing
              </Link>
              <Link to="/owner/listings" className="btn btn-outline">
                Manage Listings
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Total Properties</span>
              <Building2 size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800 }}>{totalCount}</p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Approved &amp; Live</span>
              <CheckCircle size={20} style={{ color: 'var(--success)' }} />
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{approvedCount}</p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>In Moderation</span>
              <Clock size={20} style={{ color: '#D97706' }} />
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>{pendingCount}</p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Pending Inquiries</span>
              <MessageSquare size={20} style={{ color: '#0D9488' }} />
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0D9488' }}>{pendingEnquiries}</p>
          </div>

        </div>

        {/* Content sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="owner-dash-grid">
          
          {/* Recent Enquiries */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Student Enquiries</h3>
              <Link to="/owner/enquiries" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
                View All
              </Link>
            </div>
            <div className="card-body">
              {enquiries.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {enquiries.map((enq) => (
                    <div key={enq.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{enq.student?.fullName}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            on {enq.accommodation?.title}
                          </span>
                        </div>
                        <span className={`badge ${enq.status === 'PENDING' ? 'badge-warning' : 'badge-success'}`}>
                          {enq.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                        "{enq.message}"
                      </p>
                      <Link to="/owner/enquiries" className="btn btn-outline btn-sm">
                        Reply to Student
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No incoming inquiries yet.
                </div>
              )}
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Owner Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/owner/add-accommodation" className="btn btn-primary" style={{ background: '#0D9488', justifyContent: 'space-between' }}>
                <span>Create New Listing</span> <PlusCircle size={16} />
              </Link>
              <Link to="/owner/listings" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                <span>Manage My Properties</span> <ArrowRight size={14} />
              </Link>
              <Link to="/owner/enquiries" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                <span>Respond to Inquiries</span> <ArrowRight size={14} />
              </Link>
              <Link to="/owner/profile" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                <span>Provider Company Profile</span> <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .owner-dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
