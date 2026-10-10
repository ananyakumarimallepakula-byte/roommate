import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import {
  Users,
  Home,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Activity,
  ArrowRight,
  UserCheck,
  UserX,
  History
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { showError } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats();
        setStats(res.data);
      } catch (err) {
        showError(err.message || 'Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [showError]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Platform Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'var(--primary-600)',
      bg: 'var(--primary-50)'
    },
    {
      title: 'Registered Students',
      value: stats?.totalStudents || 0,
      icon: UserCheck,
      color: '#0284c7',
      bg: '#f0f9ff'
    },
    {
      title: 'Property Owners',
      value: stats?.totalOwners || 0,
      icon: Home,
      color: '#0d9488',
      bg: '#f0fdfa'
    },
    {
      title: 'Total Accommodations',
      value: stats?.totalAccommodations || 0,
      icon: FileCheck,
      color: '#8b5cf6',
      bg: '#f5f3ff'
    },
    {
      title: 'Pending Moderation',
      value: stats?.pendingAccommodations || 0,
      icon: AlertTriangle,
      color: '#d97706',
      bg: '#fffbeb',
      highlight: (stats?.pendingAccommodations || 0) > 0
    },
    {
      title: 'Approved Listings',
      value: stats?.approvedAccommodations || 0,
      icon: Activity,
      color: '#16a34a',
      bg: '#f0fdf4'
    },
    {
      title: 'Open Grievance Reports',
      value: stats?.totalPendingReports || 0,
      icon: ShieldAlert,
      color: '#dc2626',
      bg: '#fef2f2',
      highlight: (stats?.totalPendingReports || 0) > 0
    },
    {
      title: 'Suspended Accounts',
      value: stats?.suspendedUsers || 0,
      icon: UserX,
      color: '#64748b',
      bg: '#f8fafc'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Admin Command Center</h1>
            <p className="text-secondary">
              Platform health metrics, moderation queues, user enforcement, and security audit logs.
            </p>
          </div>
          <Badge variant="primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            System Role: Super Administrator
          </Badge>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                borderLeft: card.highlight ? `4px solid ${card.color}` : 'none'
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-md)',
                  background: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  flexShrink: 0
                }}
              >
                <Icon size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>
                  {card.title}
                </span>
                <span style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Administrative Portals */}
      <h2 style={{ fontSize: '1.35rem', fontWeight: 600, marginBottom: '1.25rem' }}>
        Administrative Workflows
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* User Management Tile */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ background: 'var(--primary-100)', color: 'var(--primary-600)', padding: '8px', borderRadius: '8px' }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>User Management</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Inspect student and property owner accounts. Filter by role, search by email/name, and manage account access status.
            </p>
          </div>
          <Link to="/admin/users" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              Manage Users <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Listing Moderation Tile */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: '#fef3c7', color: '#d97706', padding: '8px', borderRadius: '8px' }}>
                  <FileCheck size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>Listing Moderation</h3>
              </div>
              {stats?.pendingAccommodations > 0 && (
                <Badge variant="warning">{stats.pendingAccommodations} Pending</Badge>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Review owner property submissions. Inspect rent, amenities, and photos to approve or reject with feedback.
            </p>
          </div>
          <Link to="/admin/moderation" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              Review Listings <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Reports & Safety Tile */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px', borderRadius: '8px' }}>
                  <ShieldAlert size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>Reports & Safety</h3>
              </div>
              {stats?.totalPendingReports > 0 && (
                <Badge variant="danger">{stats.totalPendingReports} Open</Badge>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Investigate grievances submitted by users regarding fraud, harassment, fake listings, or policy violations.
            </p>
          </div>
          <Link to="/admin/reports" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              Resolve Reports <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Audit Logs Tile */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ background: '#f1f5f9', color: '#475569', padding: '8px', borderRadius: '8px' }}>
                <History size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>Audit Logs</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Immutable trail of all administrative decisions, including listing approvals, rejections, and user account actions.
            </p>
          </div>
          <Link to="/admin/audit-logs" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              View Audit Logs <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
