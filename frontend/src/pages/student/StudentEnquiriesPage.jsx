import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ExternalLink, Building2 } from 'lucide-react';
import { enquiryApi } from '../../services/api';
import { Badge } from '../../components/Badge';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const StudentEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async (pageNum = 0) => {
    try {
      setLoading(true);
      const res = await enquiryApi.getStudentEnquiries({ page: pageNum, size: 10 });
      if (res.data) {
        setEnquiries(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(res.data.pageNumber || 0);
      }
    } catch {
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries(page);
  }, [page]);

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Property Enquiries</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Property Inquiries</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Status of inquiries sent directly to accommodation owners and providers.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your enquiries..." />
        ) : enquiries.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {enquiries.map((enq) => (
              <div key={enq.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                      {enq.accommodation?.title}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {enq.accommodation?.locality}, {enq.accommodation?.city} • Rent: ₹{Number(enq.accommodation?.rent).toLocaleString()}/mo
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge status={enq.status} />
                    <Link to={`/rooms/${enq.accommodation?.id}`} className="btn btn-outline btn-sm">
                      <ExternalLink size={14} /> View Property
                    </Link>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-muted)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: enq.response ? '1rem' : '0' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Your Question:
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    "{enq.message}"
                  </p>
                </div>

                {enq.response && (
                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Owner Response:
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#065F46', lineHeight: 1.5 }}>
                      "{enq.response}"
                    </p>
                  </div>
                )}
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
            <MessageCircle size={48} style={{ color: 'var(--text-sub)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Inquiries Sent</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              When you find a room you like, click "Contact Owner" to ask about availability and move-in terms.
            </p>
            <Link to="/rooms" className="btn btn-primary">
              Search Accommodations
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
