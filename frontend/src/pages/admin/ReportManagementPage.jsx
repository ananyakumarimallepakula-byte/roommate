import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Pagination } from '../../components/Pagination';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  User,
  Home,
  MessageSquare,
  Clock,
  CheckSquare
} from 'lucide-react';

export const ReportManagementPage = () => {
  const { showSuccess, showError } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('OPEN');

  // Resolution modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionAction, setResolutionAction] = useState('RESOLVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10,
        status: statusFilter || undefined
      };
      const res = await adminApi.getReports(params);
      if (res.data) {
        setReports(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      showError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, showError]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const openResolveModal = (report, action) => {
    setSelectedReport(report);
    setResolutionAction(action);
    setAdminNotes('');
    setResolveModalOpen(true);
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      setProcessing(true);
      await adminApi.resolveReport(selectedReport.id, {
        status: resolutionAction,
        adminNotes: adminNotes.trim() || undefined
      });
      showSuccess(`Report marked as ${resolutionAction}`);
      setResolveModalOpen(false);
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      showError(err.message || 'Failed to resolve report');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'OPEN': return 'danger';
      case 'RESOLVED': return 'success';
      case 'DISMISSED': return 'neutral';
      default: return 'warning';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Grievance & Report Center</h1>
        <p className="text-secondary">
          Investigate user grievances, potential scam reports, and rule violations.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Open Reports', value: 'OPEN' },
          { label: 'Resolved', value: 'RESOLVED' },
          { label: 'Dismissed', value: 'DISMISSED' },
          { label: 'All Reports', value: '' }
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

      {/* Reports List */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '350px' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : reports.length === 0 ? (
        <div className="card text-center" style={{ padding: '3.5rem 1rem' }}>
          <ShieldAlert size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
          <h3>No reports found</h3>
          <p className="text-secondary">
            {statusFilter === 'OPEN'
              ? 'Awesome! There are no unresolved user reports currently pending.'
              : 'No reports found for the selected filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          {reports.map((report) => (
            <div key={report.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      background: report.targetType === 'USER' ? 'var(--primary-100)' : '#fef3c7',
                      color: report.targetType === 'USER' ? 'var(--primary-600)' : '#d97706',
                      padding: '8px',
                      borderRadius: '8px'
                    }}
                  >
                    {report.targetType === 'USER' ? <User size={20} /> : <Home size={20} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
                      Report #{report.id}: {report.reason}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                      <Clock size={13} />
                      <span>{new Date(report.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>Target: {report.targetType} #{report.targetId}</span>
                    </div>
                  </div>
                </div>

                <Badge variant={getStatusBadgeVariant(report.status)}>
                  {report.status}
                </Badge>
              </div>

              {/* Description */}
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Reporter Details & Statement:
                </strong>
                <p style={{ margin: 0, color: 'var(--text-primary)' }}>
                  {report.description}
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Reported by: {report.reporter?.fullName} ({report.reporter?.email})
                </div>
              </div>

              {/* Admin Notes if resolved */}
              {report.adminNotes && (
                <div style={{ background: '#f8fafc', borderLeft: '3px solid var(--primary-500)', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}>
                  <strong>Admin Resolution Notes:</strong> {report.adminNotes}
                  {report.resolvedByAdmin && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Resolved by: {report.resolvedByAdmin.fullName}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {report.status === 'OPEN' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => openResolveModal(report, 'DISMISSED')}
                  >
                    <XCircle size={15} style={{ marginRight: '4px' }} /> Dismiss
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ background: 'var(--success-600, #16a34a)', borderColor: 'var(--success-600, #16a34a)', fontSize: '0.85rem' }}
                    onClick={() => openResolveModal(report, 'RESOLVED')}
                  >
                    <CheckCircle size={15} style={{ marginRight: '4px' }} /> Mark as Resolved
                  </button>
                </div>
              )}
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

      {/* Resolve / Dismiss Dialog */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title={resolutionAction === 'RESOLVED' ? 'Resolve Safety Report' : 'Dismiss Safety Report'}
      >
        <form onSubmit={handleResolveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {resolutionAction === 'RESOLVED'
              ? `Mark report #${selectedReport?.id} as resolved after taking necessary administrative action.`
              : `Dismiss report #${selectedReport?.id} if it is deemed non-actionable or invalid.`}
          </p>

          <div>
            <label className="input-label" htmlFor="resolution-notes">Administrative Notes & Action Taken</label>
            <textarea
              id="resolution-notes"
              className="input-field"
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Contacted property owner, verified security deposit dispute, warning issued."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setResolveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={resolutionAction === 'RESOLVED' ? 'primary' : 'secondary'}
              loading={processing}
            >
              Confirm {resolutionAction}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
