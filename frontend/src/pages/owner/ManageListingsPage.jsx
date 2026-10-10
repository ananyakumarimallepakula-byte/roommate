import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Eye, AlertCircle, Building2 } from 'lucide-react';
import { accommodationApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ManageListingsPage = () => {
  const { showSuccess, showError } = useToast();
  const [listings, setListings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Delete dialog state
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchListings = async (pageNum = 0) => {
    try {
      setLoading(true);
      const res = await accommodationApi.getMyListings({ page: pageNum, size: 10 });
      if (res.data) {
        setListings(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(res.data.pageNumber || 0);
      }
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(page);
  }, [page]);

  const handleToggleAvailability = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
    try {
      await accommodationApi.updateAvailability(id, nextStatus);
      showSuccess(`Status changed to ${nextStatus}`);
      fetchListings(page);
    } catch (err) {
      showError(err.message || 'Failed to update availability');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await accommodationApi.delete(deleteId);
      showSuccess('Listing deleted successfully');
      setDeleteId(null);
      fetchListings(page);
    } catch (err) {
      showError(err.message || 'Failed to delete listing');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Listing Inventory</span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Manage Accommodations</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              View moderation status, edit property descriptions, and toggle tenant availability.
            </p>
          </div>

          <Link to="/owner/add-accommodation" className="btn btn-primary" style={{ background: '#0D9488' }}>
            <PlusCircle size={16} /> Add New Listing
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your listings..." />
        ) : listings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {listings.map((item) => (
              <div key={item.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
                  
                  {/* Info Column */}
                  <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minWidth: '280px' }}>
                    <img
                      src={(item.images && item.images.length > 0) ? item.images[0].imageUrl : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&fit=crop'}
                      alt={item.title}
                      style={{ width: '110px', height: '85px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                        <Badge status={item.moderationStatus} />
                        <Badge status={item.availabilityStatus} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {item.roomType}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {item.locality}, {item.city} • ₹{Number(item.rent).toLocaleString()}/mo
                      </p>

                      {/* Rejection Notice */}
                      {item.moderationStatus === 'REJECTED' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#DC2626', fontSize: '0.8125rem', background: '#FEF2F2', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
                          <AlertCircle size={14} />
                          <span>Rejection Reason: {item.rejectionReason || 'Please review guidelines and update.'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    
                    {item.moderationStatus === 'APPROVED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAvailability(item.id, item.availabilityStatus)}
                      >
                        Mark as {item.availabilityStatus === 'AVAILABLE' ? 'Occupied' : 'Available'}
                      </Button>
                    )}

                    <Link to={`/rooms/${item.id}`} className="btn btn-outline btn-sm" title="Preview Public Page">
                      <Eye size={14} /> View
                    </Link>

                    <Link to={`/owner/edit-accommodation/${item.id}`} className="btn btn-outline btn-sm">
                      <Edit3 size={14} /> Edit
                    </Link>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>

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
            <Building2 size={48} style={{ color: 'var(--text-sub)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Listings Added Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Add your student accommodations to start receiving direct enquiries.
            </p>
            <Link to="/owner/add-accommodation" className="btn btn-primary" style={{ background: '#0D9488' }}>
              Add Your First Listing
            </Link>
          </div>
        )}

      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Accommodation Listing"
        message="Are you sure you want to delete this property listing? All student enquiries and photos associated with it will be removed permanently."
        confirmText="Yes, Delete Listing"
        confirmVariant="danger"
        loading={deleteLoading}
      />

    </div>
  );
};
