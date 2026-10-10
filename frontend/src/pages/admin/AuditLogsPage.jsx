import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Pagination } from '../../components/Pagination';
import { History, Shield, Clock, FileText } from 'lucide-react';

export const AuditLogsPage = () => {
  const { showError } = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAuditLogs({ page, size: 15 });
      if (res.data) {
        setLogs(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      showError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  }, [page, showError]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionBadge = (action) => {
    if (action.includes('APPROVE') || action.includes('RESOLVE')) {
      return <Badge variant="success">{action}</Badge>;
    }
    if (action.includes('REJECT') || action.includes('SUSPEND')) {
      return <Badge variant="danger">{action}</Badge>;
    }
    return <Badge variant="primary">{action}</Badge>;
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Security & Moderation Audit Trail</h1>
        <p className="text-secondary">
          Chronological, tamper-evident log of all administrative actions taken on the platform ({totalElements} events logged).
        </p>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '350px' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : logs.length === 0 ? (
        <div className="card text-center" style={{ padding: '3.5rem 1rem' }}>
          <History size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
          <h3>No audit logs available</h3>
          <p className="text-secondary">Actions taken by administrators will automatically be recorded here.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>Timestamp</th>
                  <th style={{ padding: '1rem' }}>Administrator</th>
                  <th style={{ padding: '1rem' }}>Action</th>
                  <th style={{ padding: '1rem' }}>Target Entity</th>
                  <th style={{ padding: '1rem' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={13} />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                      <div style={{ fontWeight: 600 }}>{log.admin?.fullName || 'System Admin'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.admin?.email}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {getActionBadge(log.action)}
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 500 }}>{log.entityType}</span>
                      <span style={{ color: 'var(--text-secondary)', marginLeft: '4px' }}>#{log.entityId}</span>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '350px' }}>
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '1rem' }}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
