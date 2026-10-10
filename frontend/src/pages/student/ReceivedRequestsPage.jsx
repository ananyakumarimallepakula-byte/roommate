import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Check, X, MessageSquare } from 'lucide-react';
import { requestApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ReceivedRequestsPage = () => {
  const { showSuccess, showError } = useToast();
  const [requests, setRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReceived = async (pageNum = 0) => {
    try {
      setLoading(true);
      const res = await requestApi.getReceived({ page: pageNum, size: 10 });
      if (res.data) {
        setRequests(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(res.data.pageNumber || 0);
      }
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceived(page);
  }, [page]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await requestApi.updateStatus(id, status);
      showSuccess(`Request ${status.toLowerCase()} successfully`);
      fetchReceived(page);
    } catch (err) {
      showError(err.message || 'Failed to update request');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Nav Tabs */}
        <div className="tab-nav">
          <Link to="/student/requests/sent" className="tab-btn">
            Sent Requests
          </Link>
          <Link to="/student/requests/received" className="tab-btn active">
            Received Requests
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Incoming Connection Requests</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Roommate invitations sent to you by other students.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading incoming requests..." />
        ) : requests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map((req) => (
              <div key={req.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <img
                    src={req.sender?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.sender?.fullName || 'Student')}&background=4F46E5&color=fff`}
                    alt={req.sender?.fullName}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{req.sender?.fullName}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Received on {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                    {req.message && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.5rem', background: 'var(--bg-muted)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        "{req.message}"
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Badge status={req.status} />

                  {req.status === 'PENDING' && (
                    <>
                      <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(req.id, 'REJECTED')}>
                        <X size={14} /> Decline
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}>
                        <Check size={14} /> Accept
                      </Button>
                    </>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <Link to="/messages" className="btn btn-outline btn-sm">
                      <MessageSquare size={14} /> Message Flatmate
                    </Link>
                  )}
                </div>
              </div>
            ))}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        ) : (
          <div className="empty-state">
            <Inbox size={48} style={{ color: 'var(--text-sub)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Received Requests</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You don't have any pending requests. Complete your preferences to get discovered by other students!
            </p>
            <Link to="/student/preferences" className="btn btn-primary">
              Update Living Preferences
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
