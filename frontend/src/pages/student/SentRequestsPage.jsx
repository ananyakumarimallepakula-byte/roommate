import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Clock, CheckCircle2, XCircle, Ban } from 'lucide-react';
import { requestApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const SentRequestsPage = () => {
  const { showSuccess, showError } = useToast();
  const [requests, setRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSent = async (pageNum = 0) => {
    try {
      setLoading(true);
      const res = await requestApi.getSent({ page: pageNum, size: 10 });
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
    fetchSent(page);
  }, [page]);

  const handleCancelRequest = async (id) => {
    try {
      await requestApi.updateStatus(id, 'CANCELLED');
      showSuccess('Connection request cancelled');
      fetchSent(page);
    } catch (err) {
      showError(err.message || 'Failed to cancel request');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Nav Tabs */}
        <div className="tab-nav">
          <Link to="/student/requests/sent" className="tab-btn active">
            Sent Requests
          </Link>
          <Link to="/student/requests/received" className="tab-btn">
            Received Requests
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Sent Connection Requests</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Roommate invitations you have initiated with other students.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading sent requests..." />
        ) : requests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map((req) => (
              <div key={req.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={req.receiver?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.receiver?.fullName || 'Student')}&background=4F46E5&color=fff`}
                    alt={req.receiver?.fullName}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{req.receiver?.fullName}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Sent on {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                    {req.message && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                        "{req.message}"
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Badge status={req.status} />

                  {req.status === 'PENDING' && (
                    <Button variant="outline" size="sm" onClick={() => handleCancelRequest(req.id)}>
                      <Ban size={14} /> Cancel Request
                    </Button>
                  )}
                  {req.status === 'ACCEPTED' && (
                    <Link to="/messages" className="btn btn-primary btn-sm">
                      Send Message
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
            <Send size={48} style={{ color: 'var(--text-sub)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Sent Requests</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You haven't sent any roommate connection requests yet.
            </p>
            <Link to="/student/matches" className="btn btn-primary">
              Find Compatible Roommates
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
