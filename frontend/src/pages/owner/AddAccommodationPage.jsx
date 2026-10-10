import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accommodationApi, uploadApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PlusCircle, Upload, Check, X, Building, ArrowLeft } from 'lucide-react';

export const AddAccommodationPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: 'New Delhi',
    locality: '',
    address: '',
    rent: '',
    securityDeposit: '',
    roomType: 'PRIVATE',
    furnishingStatus: 'FULLY_FURNISHED',
    genderPreference: 'ANY',
    availableFrom: '',
    houseRules: ''
  });

  const [amenitiesList, setAmenitiesList] = useState([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await accommodationApi.getAmenities();
        if (res.data) setAmenitiesList(res.data);
      } catch {
        // silent
      }
    };
    fetchAmenities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (id) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((aId) => aId !== id) : [...prev, id]
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadApi.uploadPropertyImage(file);
      const url = res.data?.url;
      if (url) {
        setImageUrls((prev) => [...prev, url]);
        showSuccess('Property photo uploaded successfully!');
      }
    } catch (err) {
      showError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        rent: parseFloat(formData.rent),
        securityDeposit: parseFloat(formData.securityDeposit),
        amenityIds: selectedAmenityIds,
        imageUrls: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&fit=crop']
      };

      await accommodationApi.create(payload);
      showSuccess('Property accommodation submitted! It is now pending administrator review.');
      navigate('/owner/listings');
    } catch (err) {
      showError(err.message || 'Failed to submit accommodation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>New Listing</span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Add Student Accommodation</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            List your student room, PG, flat, or apartment for moderation and student discovery.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Basic Property Info</h3>

            <Input
              label="Listing Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Spacious Single Room with AC near North Campus"
              required
            />

            <Input
              as="textarea"
              label="Full Description"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe room features, study space, ventilation, balcony, and neighborhood..."
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. New Delhi"
                required
              />
              <Input
                label="Locality / Landmark"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="e.g. Hauz Khas"
                required
              />
            </div>

            <Input
              label="Full Address (Street / Building)"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. A-32, Kaushalya Park, Hauz Khas"
              required
            />

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1.25rem' }}>Pricing &amp; Room Specifications</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Monthly Rent (₹)"
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                placeholder="e.g. 12000"
                required
              />
              <Input
                label="Security Deposit (₹)"
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                placeholder="e.g. 24000"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }} className="specs-grid">
              <div className="form-group">
                <label className="form-label">Room Type</label>
                <select name="roomType" value={formData.roomType} onChange={handleChange} className="form-select">
                  <option value="PRIVATE">Private Room</option>
                  <option value="SHARED">Shared Room</option>
                  <option value="PG">Student PG</option>
                  <option value="HOSTEL">Hostel</option>
                  <option value="APARTMENT">Apartment</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Furnishing</label>
                <select name="furnishingStatus" value={formData.furnishingStatus} onChange={handleChange} className="form-select">
                  <option value="FULLY_FURNISHED">Fully Furnished</option>
                  <option value="SEMI_FURNISHED">Semi Furnished</option>
                  <option value="UNFURNISHED">Unfurnished</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Gender Preference</label>
                <select name="genderPreference" value={formData.genderPreference} onChange={handleChange} className="form-select">
                  <option value="ANY">Any / Co-ed</option>
                  <option value="MALE_ONLY">Boys Only</option>
                  <option value="FEMALE_ONLY">Girls Only</option>
                </select>
              </div>
            </div>

            <Input
              label="Available Move-In Date"
              type="date"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleChange}
              required
            />

            {/* Photos Upload */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>Property Photos</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="btn btn-outline" style={{ cursor: 'pointer', display: 'inline-flex', marginBottom: '1rem' }}>
                <Upload size={16} /> {uploadingImage ? 'Uploading...' : 'Upload Property Photo'}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingImage}
                />
              </label>

              {imageUrls.length > 0 && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {imageUrls.map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={url} alt="upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(0,0,0,0.6)',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities Checkboxes */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>Included Amenities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
              {amenitiesList.map((amenity) => (
                <label key={amenity.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedAmenityIds.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                  />
                  <span>{amenity.name}</span>
                </label>
              ))}
            </div>

            <Input
              as="textarea"
              label="House Rules &amp; Policies"
              rows={3}
              name="houseRules"
              value={formData.houseRules}
              onChange={handleChange}
              placeholder="e.g. Quiet hours after 11 PM, visitor policies, electricity billing details..."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Button type="button" variant="outline" onClick={() => navigate('/owner/listings')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Submit Property for Review
              </Button>
            </div>

          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .specs-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
