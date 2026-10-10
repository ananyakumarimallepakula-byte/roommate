import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Pagination } from '../../components/Pagination';
import {
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  IndianRupee,
  Home,
  User,
  Phone,
  FileCheck,
  Building
} from 'lucide-react';

export const ListingModerationPage = () => {
  const { showSuccess, showError } = useToast();

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('PENDING');

  // Inspection & Action State
  const [selectedListing, setSelectedListing] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchAccommodations = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 9,
        status: statusFilter || undefined
      };
      const res = await adminApi.getAccommodations(params);
      if (res.data) {
        setAccommodations(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      showError(err.message || 'Failed to fetch accommodations');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, showError]);

  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  const handleApprove = async (id) => {
    try {
      setProcessing(true);
      await adminApi.moderateAccommodation(id, { status: 'APPROVED' });
      showSuccess('Accommodation approved and published');
      setInspectModalOpen(false);
      setSelectedListing(null);
      fetchAccommodations();
    } catch (err) {
      showError(err.message || 'Failed to approve accommodation');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      showError('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      await adminApi.moderateAccommodation(selectedListing.id, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim()
      });
      showSuccess('Accommodation rejected with reason provided');
      setRejectModalOpen(false);
      setInspectModalOpen(false);
      setRejectionReason('');
      setSelectedListing(null);
      fetchAccommodations();
    } catch (err) {
      showError(err.message || 'Failed to reject accommodation');
    } finally {
      setProcessing(false);
    }
  };

  const openInspectModal = (item) => {
    setSelectedListing(item);
    setInspectModalOpen(true);
  };

  const openRejectModal = (item) => {
    setSelectedListing(item);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const getModerationBadgeVariant = (status) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Accommodation Moderation</h1>
        <p className="text-secondary">
          Review, approve, or reject property listings to maintain quality and safety on the platform.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Pending Review', value: 'PENDING' },
          { label: 'Approved', value: 'APPROVED' },
          { label: 'Rejected', value: 'REJECTED' },
          { label: 'All Listings', value: '' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(0); }}
            className={`btn ${statusFilter === tab.value ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 1.25rem', fontSize: '0.9rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listing Cards Grid */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '350px' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : accommodations.length === 0 ? (
        <div className="card text-center" style={{ padding: '3.5rem 1rem' }}>
          <FileCheck size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
          <h3>No accommodations found</h3>
          <p className="text-secondary">
            {statusFilter === 'PENDING'
              ? 'Great! The pending moderation queue is completely clear.'
              : 'No accommodation listings match this status.'}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          {accommodations.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              {/* Image Preview */}
              <div style={{ height: '180px', position: 'relative', background: '#f1f5f9' }}>
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0].imageUrl.startsWith('http') ? item.images[0].imageUrl : `http://localhost:8080${item.images[0].imageUrl}`}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>
                    <Home size={40} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <Badge variant={getModerationBadgeVariant(item.moderationStatus)}>
                    {item.moderationStatus}
                  </Badge>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                    <MapPin size={14} />
                    <span>{item.city}, {item.locality || item.address}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--primary-600)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                    <IndianRupee size={16} />
                    <span>{Number(item.monthlyRent).toLocaleString('en-IN')}/mo</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>
                      • {item.propertyType?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Owner info */}
                  <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={13} /> Owner: {item.ownerName || 'Verified Partner'}
                    </div>
                    {item.ownerPhone && (
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Tel: {item.ownerPhone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem' }}
                    onClick={() => openInspectModal(item)}
                  >
                    <Eye size={15} /> Inspect
                  </button>

                  {item.moderationStatus !== 'APPROVED' && (
                    <button
                      className="btn btn-primary"
                      style={{ background: 'var(--success-600, #16a34a)', borderColor: 'var(--success-600, #16a34a)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}
                      onClick={() => handleApprove(item.id)}
                    >
                      <CheckCircle2 size={15} /> Approve
                    </button>
                  )}

                  {item.moderationStatus !== 'REJECTED' && (
                    <button
                      className="btn btn-secondary"
                      style={{ color: 'var(--danger-600, #dc2626)', borderColor: 'var(--danger-300, #fca5a5)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}
                      onClick={() => openRejectModal(item)}
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Inspect Modal */}
      {selectedListing && (
        <Modal
          isOpen={inspectModalOpen}
          onClose={() => setInspectModalOpen(false)}
          title={`Review Listing: ${selectedListing.title}`}
          maxWidth="680px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Image Gallery */}
            {selectedListing.images && selectedListing.images.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {selectedListing.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.imageUrl.startsWith('http') ? img.imageUrl : `http://localhost:8080${img.imageUrl}`}
                    alt="Property"
                    style={{ height: '140px', width: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                  />
                ))}
              </div>
            )}

            <div className="grid grid-2" style={{ gap: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Type:</span>
                <div style={{ fontWeight: 600 }}>{selectedListing.propertyType?.replace('_', ' ')}</div>
              </div>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Rent & Deposit:</span>
                <div style={{ fontWeight: 600 }}>₹{selectedListing.monthlyRent} / ₹{selectedListing.securityDeposit || 0} deposit</div>
              </div>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Address:</span>
                <div>{selectedListing.address}, {selectedListing.locality}, {selectedListing.city}</div>
              </div>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Owner:</span>
                <div>{selectedListing.ownerName} ({selectedListing.ownerPhone || 'No phone'})</div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem' }}>Description</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
                {selectedListing.description || 'No description provided.'}
              </p>
            </div>

            {selectedListing.amenityNames && selectedListing.amenityNames.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Amenities</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedListing.amenityNames.map((am, i) => (
                    <Badge key={i} variant="neutral">{am}</Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedListing.rejectionReason && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.85rem' }}>
                <strong>Prior Rejection Reason:</strong> {selectedListing.rejectionReason}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setInspectModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="danger"
                onClick={() => { setInspectModalOpen(false); openRejectModal(selectedListing); }}
              >
                Reject Listing
              </Button>
              <Button
                variant="primary"
                loading={processing}
                onClick={() => handleApprove(selectedListing.id)}
              >
                Approve & Publish
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Accommodation"
      >
        <form onSubmit={handleRejectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Please state why "{selectedListing?.title}" is being rejected. The owner will see this feedback.
          </p>

          <div>
            <label className="input-label" htmlFor="rejection-reason">Reason for Rejection *</label>
            <textarea
              id="rejection-reason"
              className="input-field"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Inaccurate location details, blurry photographs, or missing security deposit clarification."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={processing}>
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
