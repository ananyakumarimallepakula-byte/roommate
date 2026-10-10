import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Building2, ArrowRight } from 'lucide-react';
import { accommodationApi } from '../../services/api';
import { PropertyCard } from '../../components/PropertyCard';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const SavedListingsPage = () => {
  const [savedListings, setSavedListings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async (pageNum = 0) => {
    try {
      setLoading(true);
      const res = await accommodationApi.getSavedListings({ page: pageNum, size: 9 });
      if (res.data) {
        setSavedListings(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(res.data.pageNumber || 0);
      }
    } catch {
      setSavedListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved(page);
  }, [page]);

  const handleUnsave = (id) => {
    setSavedListings((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Saved Properties</span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Favorite Accommodations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Accommodations you bookmarked for later review.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching your saved accommodations..." />
        ) : savedListings.length > 0 ? (
          <>
            <div className="grid grid-cols-3">
              {savedListings.map((acc) => (
                <PropertyCard
                  key={acc.id}
                  accommodation={acc}
                  onSaveToggle={(id, isSaved) => {
                    if (!isSaved) handleUnsave(id);
                  }}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </>
        ) : (
          <div className="empty-state">
            <Heart size={48} style={{ color: 'var(--text-sub)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Saved Listings</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              You haven't bookmarked any accommodations yet. Browse verified rooms and click the heart icon to save them here.
            </p>
            <Link to="/rooms" className="btn btn-primary">
              Discover Accommodations
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
