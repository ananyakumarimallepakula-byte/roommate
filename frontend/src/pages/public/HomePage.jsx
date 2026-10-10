import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, Shield, CheckCircle, ArrowRight, MapPin, DollarSign, Sparkles, Building2 } from 'lucide-react';
import { accommodationApi } from '../../services/api';
import { PropertyCard } from '../../components/PropertyCard';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const HomePage = () => {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);

  // Search state
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, citiesRes] = await Promise.all([
          accommodationApi.getFeatured(),
          accommodationApi.getCities()
        ]);
        if (featuredRes.data) setFeaturedListings(featuredRes.data);
        if (citiesRes.data) setCities(citiesRes.data);
      } catch {
        // Fallback or empty
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.append('city', searchCity);
    if (searchType) params.append('roomType', searchType);
    if (maxBudget) params.append('maxRent', maxBudget);
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero-gradient" style={{ padding: '5rem 0 6rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.15)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              backdropFilter: 'blur(8px)'
            }}>
              <Sparkles size={16} style={{ color: '#FCD34D' }} /> The Smart Student Living Network
            </span>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em'
            }}>
              Find Your Space. <br />
              <span style={{ background: 'linear-gradient(to right, #818CF8, #2DD4BF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Find Your People.
              </span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#E0E7FF', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
              Connect with verified accommodations near top campuses and find compatible roommates using our preference-weighted matching algorithm.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <div className="glass-card" style={{ maxWidth: '940px', margin: '0 auto', padding: '1.75rem' }}>
            <form onSubmit={handleHeroSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
              
              {/* City or Locality */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#E0E7FF', marginBottom: '0.375rem' }}>
                  City or University
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder="e.g. New Delhi, Hauz Khas"
                    className="form-input"
                    style={{ background: 'rgba(255, 255, 255, 0.9)', color: '#0F172A', border: 'none' }}
                  />
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#E0E7FF', marginBottom: '0.375rem' }}>
                  Room Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="form-select"
                  style={{ background: 'rgba(255, 255, 255, 0.9)', color: '#0F172A', border: 'none' }}
                >
                  <option value="">Any Room Type</option>
                  <option value="PRIVATE">Private Room</option>
                  <option value="SHARED">Shared Flat</option>
                  <option value="PG">Student PG</option>
                  <option value="APARTMENT">Apartment</option>
                </select>
              </div>

              {/* Max Budget */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#E0E7FF', marginBottom: '0.375rem' }}>
                  Max Monthly Budget (₹)
                </label>
                <input
                  type="number"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  placeholder="e.g. 15000"
                  className="form-input"
                  style={{ background: 'rgba(255, 255, 255, 0.9)', color: '#0F172A', border: 'none' }}
                />
              </div>

              {/* Submit Search Button */}
              <div>
                <Button type="submit" variant="primary" style={{ width: '100%', height: '44px', background: '#0D9488' }}>
                  <Search size={18} /> Search Rooms
                </Button>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* 2. FEATURED LISTINGS SECTION */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Verified Spaces</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured Accommodations</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Hand-picked, student-friendly verified listings with modern amenities.
              </p>
            </div>
            <Link to="/rooms" className="btn btn-outline">
              View All Listings <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching featured properties..." />
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-3">
              {featuredListings.map((acc) => (
                <PropertyCard key={acc.id} accommodation={acc} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Building2 size={40} style={{ color: 'var(--text-sub)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>No featured accommodations available right now.</p>
              <Link to="/rooms" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Browse All Listings</Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-muted)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Simplicity First</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>How ROOMMATE Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Finding the right place to live and the right people to live with in 3 transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-3">
            
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Build Your Profile</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Set your budget, sleep habits, cleanliness standards, dietary rules, and study preferences.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--secondary-light)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Match With Roommates</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Our weighted 6-factor compatibility algorithm ranks compatible candidates with full score transparency.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--accent-light)',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Connect &amp; Move In</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Directly chat with compatible flatmates and send enquiries to verified accommodation providers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ROOMMATE MATCHING ALGORITHM EXPLANATION */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Intelligent Matching</span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1.25rem' }}>
                Scientific compatibility, not guesswork.
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Living with incompatible roommates is one of the highest stress factors for university students. 
                Our platform uses a multi-factor weighted algorithm to calculate a 0-100% normalized score with complete explanation.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                  <span><strong>Budget Range:</strong> 25% weight with overlap analysis</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                  <span><strong>Location &amp; Locality:</strong> 20% weight</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                  <span><strong>Lifestyle (Smoking, Pets, Cleanliness):</strong> 20% weight</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                  <span><strong>Study &amp; Sleep Schedules:</strong> 20% weight</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                  <span><strong>Room Type &amp; Move-In Dates:</strong> 10% weight</span>
                </div>
              </div>

              <Link to="/register" className="btn btn-primary btn-lg">
                Find Compatible Flatmates <ArrowRight size={18} />
              </Link>
            </div>

            {/* Visual breakdown preview card */}
            <div className="card" style={{ padding: '2rem', background: '#FFFFFF', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Aarav &amp; Rohit</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>IIT Delhi &amp; DTU</p>
                </div>
                <div className="compat-circle compat-circle-excellent" style={{ width: '60px', height: '60px', fontSize: '1.1rem' }}>
                  94%
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Budget Compatibility (25%)</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>100% Match</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Location Match: Hauz Khas (20%)</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>100% Match</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Lifestyle &amp; Cleanliness (20%)</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>95% Match</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Night Owl &amp; Silent Study (20%)</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>90% Match</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SAFETY & GUIDANCE */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-muted)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Peace of Mind</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Safety &amp; Community Guidelines</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              We take safety seriously. All listings undergo strict moderation and user profiles are verified.
            </p>
          </div>

          <div className="grid grid-cols-3">
            <div className="card" style={{ padding: '1.75rem' }}>
              <Shield size={28} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Admin Moderated Listings</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Every accommodation listing is reviewed by administrators before going live. Suspicious listings are rejected immediately.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <Users size={28} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Student-to-Student Connection</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Direct communication through our secure messaging without having to share personal contact info until you feel ready.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <CheckCircle size={28} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>One-Click Reporting</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Encounter misleading photos or inappropriate behavior? Submit a report instantly for immediate administrative audit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SAMPLE STUDENT TESTIMONIALS */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span className="badge badge-neutral" style={{ marginBottom: '0.5rem' }}>Sample Student Feedback</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>What Students Say</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Demonstration feedback illustrating platform user experiences.
            </p>
          </div>

          <div className="grid grid-cols-3">
            <div className="card" style={{ padding: '1.75rem' }}>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                "Found my flatmate Rohit through the compatibility score. Both of us code late at night and need complete silence during study hours. It's been a dream setup!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  A
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Aarav Patel</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>IIT Delhi • Computer Science</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                "As an accommodation owner near North Campus, ROOMMATE makes managing listings and filtering serious student enquiries effortless. Truly well built."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  R
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Rajesh Verma</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Owner • Skyline Urban Living</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                "The transparency in knowing why a potential roommate matched with me — from cleanliness standards to sleep schedule — gave my parents and me complete confidence."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-light)', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  P
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Priya Singh</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Delhi University • Economics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)', color: '#FFF', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFF', marginBottom: '1rem' }}>
            Ready to find your ideal student home?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#E0E7FF', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join hundreds of students finding verified housing and compatible flatmates today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ background: '#0D9488' }}>
              Create Free Account
            </Link>
            <Link to="/rooms" className="btn btn-outline btn-lg" style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.4)' }}>
              Explore Accommodations
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
