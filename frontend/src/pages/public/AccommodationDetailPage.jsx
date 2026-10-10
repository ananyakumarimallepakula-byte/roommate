import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Shield, Heart, Flag, Send, Bed, Check, ArrowLeft, Phone, Building } from 'lucide-react';
import { accommodationApi, enquiryApi, reportApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AccommodationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Enquiry modal
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  // Report modal
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Misleading information or price');
  const [reportDesc, setReportDesc] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await accommodationApi.getById(id);
        if (res.data) setAccommodation(res.data);
      } catch (err) {
        showError(err.message || 'Failed to load accommodation details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, showError]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      showInfo('Please log in to save listings.');
      return;
    }
    if (role !== 'STUDENT') {
      showInfo('Only students can save listings.');
      return;
    }
    try {
      const res = await accommodationApi.toggleSave(accommodation.id);
      const isNowSaved = res.data?.isSaved;
      setAccommodation((prev) => ({ ...prev, isSaved: isNowSaved }));
      showSuccess(isNowSaved ? 'Saved to favorites' : 'Removed from favorites');
    } catch (err) {
      showError(err.message || 'Could not update favorites');
    }
  };

  const handleSendEnquiry = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showInfo('Please log in as a student to contact property owners.');
      navigate('/login');
      return;
    }
    if (role !== 'STUDENT') {
      showError('Only students can send property enquiries.');
      return;
    }

    try {
      setSubmittingEnquiry(true);
      await enquiryApi.createEnquiry({
        accommodationId: accommodation.id,
        message: enquiryMessage.trim()
      });
      showSuccess('Your enquiry has been sent to the owner!');
      setEnquiryOpen(false);
      setEnquiryMessage('');
    } catch (err) {
      showError(err.message || 'Failed to submit enquiry');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showInfo('Please log in to report listings.');
      return;
    }

    try {
      setSubmittingReport(true);
      await reportApi.createReport({
        targetType: 'ACCOMMODATION',
        targetId: accommodation.id,
        reason: reportReason,
        description: reportDesc
      });
      showSuccess('Report submitted for administrative review. Thank you for keeping our community safe.');
      setReportOpen(false);
      setReportDesc('');
    } catch (err) {
      showError(err.message || 'Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading property details..." />;
  }

  if (!accommodation) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Accommodation not found</h2>
        <Link to="/rooms" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Browse All Rooms</Link>
      </div>
    );
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&fit=crop';
  const images = (accommodation.images && accommodation.images.length > 0)
    ? accommodation.images.map((i) => i.imageUrl)
    : [fallbackImage];

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        
        {/* Top Back Link & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
          >
            <ArrowLeft size={18} /> Back to Search
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSave}
            >
              <Heart
                size={16}
                fill={accommodation.isSaved ? '#EF4444' : 'none'}
                color={accommodation.isSaved ? '#EF4444' : 'currentColor'}
              />
              {accommodation.isSaved ? 'Saved' : 'Save'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setReportOpen(true)}
              style={{ color: 'var(--text-muted)' }}
            >
              <Flag size={15} /> Report
            </Button>
          </div>
        </div>

        {/* Gallery / Image Showcase */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            height: '460px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            backgroundColor: '#0F172A',
            marginBottom: '1rem',
            position: 'relative'
          }}>
            <img
              src={images[activeImageIndex]}
              alt={accommodation.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
            />
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '100px',
                    height: '70px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: activeImageIndex === idx ? '3px solid var(--primary)' : '1px solid var(--border)',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'flex-start' }} className="detail-layout">
          
          {/* Left: Property Overview & Content */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <Badge status={accommodation.roomType} variant="primary" />
              <Badge status={accommodation.furnishingStatus?.replace('_', ' ')} variant="neutral" />
              {accommodation.genderPreference && accommodation.genderPreference !== 'ANY' && (
                <Badge status={accommodation.genderPreference?.replace('_', ' ')} variant="warning" />
              )}
              <Badge status={accommodation.availabilityStatus} />
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
              {accommodation.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              <MapPin size={18} style={{ color: 'var(--primary)' }} />
              <span>{accommodation.address}, {accommodation.locality}, {accommodation.city}</span>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>About this Property</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {accommodation.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Available Amenities</h3>
              {accommodation.amenities && accommodation.amenities.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {accommodation.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-muted)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}
                    >
                      <Check size={16} style={{ color: 'var(--success)' }} />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Standard amenities included.</p>
              )}
            </div>

            {/* House Rules */}
            {accommodation.houseRules && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>House Rules &amp; Guidelines</h3>
                <div style={{ padding: '1.25rem', background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: 'var(--radius-md)', color: '#92400E', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {accommodation.houseRules}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking / Price Card */}
          <div className="card" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
            
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monthly Rent</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                ₹{Number(accommodation.rent).toLocaleString()}
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}> / month</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Security Deposit: ₹{Number(accommodation.securityDeposit).toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Available From:</span>
                <span style={{ fontWeight: 600 }}>{accommodation.availableFrom}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Room Style:</span>
                <span style={{ fontWeight: 600 }}>{accommodation.roomType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Furnishing:</span>
                <span style={{ fontWeight: 600 }}>{accommodation.furnishingStatus?.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Owner card preview */}
            <div style={{ padding: '1rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                Property Provider
              </p>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {accommodation.owner?.fullName || 'Verified Owner'}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Property Partner</p>
            </div>

            <Button
              variant="primary"
              style={{ width: '100%', marginBottom: '0.75rem' }}
              onClick={() => setEnquiryOpen(true)}
            >
              <Send size={16} /> Contact Owner / Enquiry
            </Button>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
              <Shield size={12} style={{ display: 'inline', color: 'var(--success)' }} /> Protected communication. 
              Enquiries are directly routed to the owner.
            </p>
          </div>

        </div>

      </div>

      {/* Enquiry Modal */}
      <Modal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} title={`Contact Owner: ${accommodation.title}`}>
        <form onSubmit={handleSendEnquiry}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Send a direct message regarding your move-in dates, schedule, or questions.
          </p>
          <Input
            as="textarea"
            label="Your Message"
            rows={5}
            value={enquiryMessage}
            onChange={(e) => setEnquiryMessage(e.target.value)}
            placeholder="Hi, I am interested in this room for the upcoming semester. Is it available for immediate move-in?..."
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="outline" onClick={() => setEnquiryOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submittingEnquiry}>Send Enquiry</Button>
          </div>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={reportOpen} onClose={() => setReportOpen(false)} title="Report this Accommodation">
        <form onSubmit={handleSendReport}>
          <div className="form-group">
            <label className="form-label">Reason for reporting</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="form-select"
            >
              <option value="Misleading information or price">Misleading information or price</option>
              <option value="Fake photos or non-existent property">Fake photos or non-existent property</option>
              <option value="Inappropriate owner behavior">Inappropriate owner behavior</option>
              <option value="Discriminatory policies">Discriminatory policies</option>
              <option value="Other concern">Other concern</option>
            </select>
          </div>

          <Input
            as="textarea"
            label="Additional Details (Optional)"
            rows={4}
            value={reportDesc}
            onChange={(e) => setReportDesc(e.target.value)}
            placeholder="Please provide any relevant context for the moderation team..."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="outline" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger" loading={submittingReport}>Submit Report</Button>
          </div>
        </form>
      </Modal>

      <style>{`
        @media (max-width: 860px) {
          .detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
