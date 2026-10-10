import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, Building2, SlidersHorizontal } from 'lucide-react';
import { accommodationApi } from '../../services/api';
import { PropertyCard } from '../../components/PropertyCard';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AccommodationSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [accommodations, setAccommodations] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  // Filter state
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || '');
  const [furnishingStatus, setFurnishingStatus] = useState(searchParams.get('furnishingStatus') || '');
  const [genderPreference, setGenderPreference] = useState(searchParams.get('genderPreference') || '');
  const [selectedAmenityIds, setSelectedAmenityIds] = useState([]);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(0);

  // Load master amenities & cities
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [amenitiesRes, citiesRes] = await Promise.all([
          accommodationApi.getAmenities(),
          accommodationApi.getCities()
        ]);
        if (amenitiesRes.data) setAmenitiesList(amenitiesRes.data);
        if (citiesRes.data) setCitiesList(citiesRes.data);
      } catch {
        // silent
      }
    };
    loadMasterData();
  }, []);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        query: query.trim() || undefined,
        city: city.trim() || undefined,
        locality: locality.trim() || undefined,
        minRent: minRent ? Number(minRent) : undefined,
        maxRent: maxRent ? Number(maxRent) : undefined,
        roomType: roomType || undefined,
        furnishingStatus: furnishingStatus || undefined,
        genderPreference: genderPreference || undefined,
        amenityIds: selectedAmenityIds.length > 0 ? selectedAmenityIds.join(',') : undefined,
        sortBy,
        page,
        size: 9
      };

      const res = await accommodationApi.search(params);
      if (res.data) {
        setAccommodations(res.data.content || []);
        setTotalElements(res.data.totalElements || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch {
      setAccommodations([]);
    } finally {
      setLoading(false);
    }
  }, [query, city, locality, minRent, maxRent, roomType, furnishingStatus, genderPreference, selectedAmenityIds, sortBy, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleApplyFilter = (e) => {
    if (e) e.preventDefault();
    setPage(0);
    fetchListings();
  };

  const handleResetFilters = () => {
    setQuery('');
    setCity('');
    setLocality('');
    setMinRent('');
    setMaxRent('');
    setRoomType('');
    setFurnishingStatus('');
    setGenderPreference('');
    setSelectedAmenityIds([]);
    setSortBy('newest');
    setPage(0);
    setSearchParams({});
  };

  const handleAmenityToggle = (id) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((aId) => aId !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Explore Verified Accommodations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Search student accommodations, PGs, shared apartments, and verified rentals.
          </p>
        </div>

        {/* Layout: Sidebar Filter & Listings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'flex-start' }} className="search-layout">
          
          {/* FILTER SIDEBAR */}
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={18} /> Filters
              </h3>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>

            <form onSubmit={handleApplyFilter}>
              
              {/* Search keyword */}
              <Input
                label="Search Keyword"
                placeholder="e.g. Metro, Balcony"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              {/* City Selection */}
              <div className="form-group">
                <label className="form-label">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Cities</option>
                  {citiesList.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                  <option value="New Delhi">New Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              {/* Locality */}
              <Input
                label="Locality / Landmark"
                placeholder="e.g. Hauz Khas, North Campus"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
              />

              {/* Price Range */}
              <div className="form-group">
                <label className="form-label">Budget Range (₹/month)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minRent}
                    onChange={(e) => setMinRent(e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Room Type */}
              <div className="form-group">
                <label className="form-label">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="form-select"
                >
                  <option value="">Any Room Type</option>
                  <option value="PRIVATE">Private Room</option>
                  <option value="SHARED">Shared Room</option>
                  <option value="PG">Paying Guest (PG)</option>
                  <option value="HOSTEL">Hostel</option>
                  <option value="APARTMENT">Apartment</option>
                </select>
              </div>

              {/* Furnishing Status */}
              <div className="form-group">
                <label className="form-label">Furnishing</label>
                <select
                  value={furnishingStatus}
                  onChange={(e) => setFurnishingStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="">Any Status</option>
                  <option value="FULLY_FURNISHED">Fully Furnished</option>
                  <option value="SEMI_FURNISHED">Semi Furnished</option>
                  <option value="UNFURNISHED">Unfurnished</option>
                </select>
              </div>

              {/* Gender Preference */}
              <div className="form-group">
                <label className="form-label">Gender Preference</label>
                <select
                  value={genderPreference}
                  onChange={(e) => setGenderPreference(e.target.value)}
                  className="form-select"
                >
                  <option value="">Any</option>
                  <option value="MALE_ONLY">Boys Only</option>
                  <option value="FEMALE_ONLY">Girls Only</option>
                </select>
              </div>

              {/* Amenities checkboxes */}
              {amenitiesList.length > 0 && (
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Amenities</label>
                  <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingRight: '0.25rem' }}>
                    {amenitiesList.map((amenity) => (
                      <label key={amenity.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedAmenityIds.includes(amenity.id)}
                          onChange={() => handleAmenityToggle(amenity.id)}
                        />
                        <span>{amenity.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" variant="primary" style={{ width: '100%' }}>
                Apply Filters
              </Button>

            </form>
          </div>

          {/* LISTINGS RESULTS */}
          <div>
            
            {/* Top Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
                Showing <strong style={{ color: 'var(--text-main)' }}>{accommodations.length}</strong> of{' '}
                <strong style={{ color: 'var(--text-main)' }}>{totalElements}</strong> available properties
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <LoadingSpinner text="Searching student listings..." />
            ) : accommodations.length > 0 ? (
              <>
                <div className="grid grid-cols-3">
                  {accommodations.map((item) => (
                    <PropertyCard key={item.id} accommodation={item} />
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
                <Building2 size={48} style={{ color: 'var(--text-sub)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Accommodations Found</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  No active properties match your current search criteria. Try broadening your budget or clearing filters.
                </p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .search-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
