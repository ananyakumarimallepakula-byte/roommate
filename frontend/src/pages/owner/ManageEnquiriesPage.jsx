import React, { useState, useEffect } from 'react';
import { MessageSquare, Reply, CheckCircle2, User } from 'lucide-react';
import { enquiryApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ManageEnquiriesPage = () => {
  const { showSuccess, showError } = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Response modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchEnquiries = async (pageNum = 0) => {
    try {
      setLoading(true);
      const res = await enquiryApi.getOwnerEnquiries({
        status: statusFilter || undefined,
        page: pageNum,
        size: 10
      });
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
  }, [page, statusFilter]);

  const handleOpenReplyModal = (enq) => {
    setSelectedEnquiry(enq);
    setResponseText(enq.response || `Hello ${enq.student?.fullName}, yes this accommodation is currently available for move-in. Would you like to schedule an in-person or virtual viewing?`);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    try {
      setSubmittingReply(true);
      await enquiryApi.respondEnquiry(selectedEnquiry.id, {
        response: responseText.trim()
      });
      showSuccess('Response sent to student!');
      setSelectedEnquiry(null);
      fetchEnquiries(page);
    } catch (err) {
      showError(err.message || 'Failed to send response');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '940px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Tenant Leads</span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Student Inquiries</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Direct questions from prospective student tenants regarding your properties.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="form-select"
              style={{ width: 'auto', padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
            >
              <option value="">All Inquiries</option>
              <option value="PENDING">Pending Only</option>
              <option value="RESPONDED">Responded</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching enquiries..." />
        ) : enquiries.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {enquiries.map((enq) => (
              <div key={enq.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{enq.student?.fullName}</h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Inquired about: <strong>{enq.accommodation?.title}</strong>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge status={enq.status} />
                    <Button
                      variant={enq.status === 'PENDING' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleOpenReplyModal(enq)}
                    >
                      <Reply size={14} /> {enq.status === 'PENDING' ? 'Reply to Student' : 'Edit Reply'}
                    </Button>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-muted)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: enq.response ? '1rem' : '0' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Student Inquiry:
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    "{enq.message}"
                  </p>
                </div>

                {enq.response && (
                  <div style={{ background: '#F0FDFA', border: '1px solid #CCFBF1', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Your Submitted Response:
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#115E59', lineHeight: 1.5 }}>
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
            <MessageSquare size={48} style={{ color: 'var(--text-sub)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Inquiries Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              There are no student inquiries matching the selected criteria.
            </p>
          </div>
        )}

      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        title={`Respond to ${selectedEnquiry?.student?.fullName}`}
      >
        <form onSubmit={handleReplySubmit}>
          <div style={{ background: 'var(--bg-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Property:</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedEnquiry?.accommodation?.title}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Student asked: "{selectedEnquiry?.message}"
            </p>
          </div>

          <Input
            as="textarea"
            label="Your Response to the Student"
            rows={5}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Provide clear move-in details, house rules, viewing times..."
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" onClick={() => setSelectedEnquiry(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submittingReply}>
              Send Response
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
