import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { notificationApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Pagination } from '../../components/Pagination';
import {
  Bell,
  CheckCheck,
  Check,
  UserCheck,
  Home,
  MessageSquare,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export const NotificationsPage = () => {
  const { showSuccess, showError } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications({ page, size: 12 });
      if (res.data) {
        setNotifications(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      }
      const countRes = await notificationApi.getUnreadCount();
      if (countRes.data) {
        setUnreadCount(countRes.data.unreadCount || 0);
      }
    } catch (err) {
      showError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [page, showError]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      showError(err.message || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      showSuccess('All notifications marked as read');
    } catch (err) {
      showError(err.message || 'Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ROOMMATE_REQUEST':
        return <UserCheck size={20} color="var(--primary-600)" />;
      case 'ENQUIRY':
        return <Home size={20} color="#0d9488" />;
      case 'MESSAGE':
        return <MessageSquare size={20} color="#8b5cf6" />;
      case 'MODERATION':
        return <CheckCheck size={20} color="#16a34a" />;
      default:
        return <Bell size={20} color="var(--primary-600)" />;
    }
  };

  const getActionLink = (item) => {
    if (item.referenceType === 'ACCOMMODATION' && item.referenceId) {
      return `/accommodations/${item.referenceId}`;
    }
    if (item.referenceType === 'REQUEST') {
      return '/requests/received';
    }
    if (item.referenceType === 'ENQUIRY') {
      return '/student/enquiries';
    }
    if (item.referenceType === 'CONVERSATION') {
      return '/messages';
    }
    return null;
  };

  return (
    <div className="page-container" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              Notifications
              {unreadCount > 0 && (
                <Badge variant="primary" style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>
                  {unreadCount} New
                </Badge>
              )}
            </h1>
            <p className="text-secondary">
              Stay up to date with roommate requests, property owner replies, and account updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="btn btn-secondary"
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <CheckCheck size={16} /> Mark all as read
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '350px' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card text-center" style={{ padding: '3.5rem 1rem' }}>
          <Bell size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No notifications yet</h3>
          <p className="text-secondary">When you receive requests, responses, or messages, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {notifications.map((n) => {
            const link = getActionLink(n);
            return (
              <div
                key={n.id}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  background: n.isRead ? 'var(--bg-primary)' : 'var(--primary-50)',
                  borderLeft: n.isRead ? '4px solid transparent' : '4px solid var(--primary-600)',
                  transition: 'background 0.2s ease'
                }}
              >
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: n.isRead ? 'var(--bg-secondary)' : '#ffffff',
                    boxShadow: 'var(--shadow-sm)',
                    flexShrink: 0
                  }}
                >
                  {getNotificationIcon(n.type)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: n.isRead ? 600 : 700, margin: 0, color: 'var(--text-primary)' }}>
                      {n.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <Clock size={12} />
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <p style={{ margin: '0.35rem 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {n.content}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {link && (
                      <Link
                        to={link}
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--primary-600)',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                    )}

                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: 0
                        }}
                      >
                        <Check size={14} /> Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};
