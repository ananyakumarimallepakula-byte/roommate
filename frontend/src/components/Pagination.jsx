import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage = 0, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="btn btn-outline btn-sm"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} /> Previous
      </button>

      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', margin: '0 0.5rem' }}>
        Page {currentPage + 1} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage >= totalPages - 1}
        className="btn btn-outline btn-sm"
        aria-label="Next page"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};
