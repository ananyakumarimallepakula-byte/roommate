import React from 'react';

export const Badge = ({ status, variant, children, className = '' }) => {
  let badgeVariant = variant || 'neutral';

  if (!variant && status) {
    const s = String(status).toUpperCase();
    if (['APPROVED', 'AVAILABLE', 'ACTIVE', 'ACCEPTED', 'RESOLVED', 'EXCELLENT'].includes(s)) {
      badgeVariant = 'success';
    } else if (['PENDING', 'GREAT', 'GOOD'].includes(s)) {
      badgeVariant = 'warning';
    } else if (['REJECTED', 'SUSPENDED', 'CANCELLED', 'DISMISSED'].includes(s)) {
      badgeVariant = 'danger';
    } else if (['OCCUPIED', 'UNAVAILABLE', 'RESPONDED', 'STUDENT', 'OWNER', 'ADMIN'].includes(s)) {
      badgeVariant = 'primary';
    }
  }

  return (
    <span className={`badge badge-${badgeVariant} ${className}`}>
      {children || status}
    </span>
  );
};
