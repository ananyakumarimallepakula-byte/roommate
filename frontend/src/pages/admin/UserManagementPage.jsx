import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Pagination } from '../../components/Pagination';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { Search, ShieldAlert, ShieldCheck, UserX, UserCheck, Filter, Users } from 'lucide-react';

export const UserManagementPage = () => {
  const { showSuccess, showError } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Status Action Dialog
  const [selectedUser, setSelectedUser] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10,
        query: searchQuery.trim() || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined
      };
      const res = await adminApi.searchUsers(params);
      if (res.data) {
        setUsers(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      showError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, roleFilter, statusFilter, showError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const openStatusChange = (user, status) => {
    setSelectedUser(user);
    setNewStatus(status);
    setDialogOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser || !newStatus) return;
    try {
      setUpdating(true);
      await adminApi.updateUserStatus(selectedUser.id, { status: newStatus });
      showSuccess(`User ${selectedUser.fullName} marked as ${newStatus}`);
      setDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Failed to update user status');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'OWNER': return 'warning';
      case 'STUDENT': return 'primary';
      default: return 'neutral';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'SUSPENDED': return 'danger';
      case 'PENDING': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">User Directory & Access Control</h1>
        <p className="text-secondary">
          Monitor user accounts, verify roles, and suspend/reactivate access across the platform ({totalElements} total).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label className="input-label" htmlFor="user-search">Search Name or Email</label>
            <div style={{ position: 'relative' }}>
              <Input
                id="user-search"
                placeholder="Search user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="role-filter">Filter by Role</label>
            <select
              id="role-filter"
              className="input-field"
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
            >
              <option value="">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <label className="input-label" htmlFor="status-filter">Filter by Status</label>
            <select
              id="status-filter"
              className="input-field"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Search size={16} /> Filter
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setSearchQuery(''); setRoleFilter(''); setStatusFilter(''); setPage(0); }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '350px' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 1rem' }}>
          <Users size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
          <h3>No users found</h3>
          <p className="text-secondary">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Contact</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Joined Date</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl.startsWith('http') ? u.avatarUrl : `http://localhost:8080${u.avatarUrl}`}
                            alt={u.fullName}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: 'var(--primary-100)',
                              color: 'var(--primary-600)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: '0.9rem'
                            }}
                          >
                            {u.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.fullName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID #{u.id}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                      <div>{u.email}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{u.phone || '—'}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <Badge variant={getRoleBadgeVariant(u.role)}>
                        {u.role}
                      </Badge>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <Badge variant={getStatusBadgeVariant(u.status)}>
                        {u.status}
                      </Badge>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {u.role === 'ADMIN' ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Protected</span>
                      ) : u.status === 'ACTIVE' ? (
                        <button
                          className="btn btn-secondary"
                          style={{ color: 'var(--danger-600, #dc2626)', borderColor: 'var(--danger-300, #fca5a5)', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => openStatusChange(u, 'SUSPENDED')}
                        >
                          <UserX size={14} style={{ marginRight: '4px' }} /> Suspend
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          style={{ color: 'var(--success-600, #16a34a)', borderColor: 'var(--success-300, #86efac)', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => openStatusChange(u, 'ACTIVE')}
                        >
                          <UserCheck size={14} style={{ marginRight: '4px' }} /> Reactivate
                        </button>
                      )}
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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialogOpen}
        title={newStatus === 'SUSPENDED' ? 'Suspend User Account' : 'Reactivate User Account'}
        message={
          newStatus === 'SUSPENDED'
            ? `Are you sure you want to suspend "${selectedUser?.fullName}" (${selectedUser?.email})? The user will immediately be barred from logging in.`
            : `Are you sure you want to reactivate "${selectedUser?.fullName}" (${selectedUser?.email})? Access to their account will be restored.`
        }
        confirmText={newStatus === 'SUSPENDED' ? 'Suspend Account' : 'Reactivate Account'}
        confirmVariant={newStatus === 'SUSPENDED' ? 'danger' : 'primary'}
        loading={updating}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => { setDialogOpen(false); setSelectedUser(null); }}
      />
    </div>
  );
};
