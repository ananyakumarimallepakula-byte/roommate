import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { accommodationApi, uploadApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Upload, X, ArrowLeft } from 'lucide-react';

export const EditAccommodationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accomRes, amenitiesRes] = await Promise.all([
          accommodationApi.getById(id),
          accommodationApi.getAmenities()
        ]);

        if (amenitiesRes.data) setAmenitiesList(amenitiesRes.data);

        if (accomRes.data) {
          const a = accomRes.data;
          setFormData({
            title: a.title || '',
            description: a.description || '',
            city: a.city || '',
            locality: a.locality || '',
            address: a.address || '',
            rent: a.rent || '',
            securityDeposit: a.securityDeposit || '',
            roomType: a.roomType || 'PRIVATE',
            furnishingStatus: a.furnishingStatus || 'FULLY_FURNISHED',
            genderPreference: a.genderPreference || 'ANY',
            availableFrom: a.availableFrom || '',
            houseRules: a.houseRules || ''
          });

          if (a.amenities) {
            setSelectedAmenityIds(a.amenities.map((am) => am.id));
          }
          if (a.images) {
            setImageUrls(a.images.map((img) => img.imageUrl));
          }
        }
      } catch (err) {
        showError('Could not load accommodation details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(amenityId) ? prev.filter((i) => i !== amenityId) : [...prev, amenityId]
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
        showSuccess('Photo uploaded!');
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
      setSaving(true);
      const payload = {
        ...formData,
        rent: parseFloat(formData.rent),
        securityDeposit: parseFloat(formData.securityDeposit),
        amenityIds: selectedAmenityIds,
        imageUrls: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&fit=crop']
      };

      await accommodationApi.update(id, payload);
      showSuccess('Accommodation updated successfully!');
      navigate('/owner/listings');
    } catch (err) {
      showError(err.message || 'Failed to update accommodation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading listing for edit..." />;
  }

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
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Edit Accommodation</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Update pricing, amenities, availability, or photos for this property.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            
            <Input
              label="Listing Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Input
              as="textarea"
              label="Full Description"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <Input
                label="Locality"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <Input
                label="Monthly Rent (₹)"
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                required
              />
              <Input
                label="Security Deposit (₹)"
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
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
              label="Available From"
              type="date"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleChange}
              required
            />

            {/* Photos */}
            <div style={{ margin: '1.5rem 0' }}>
              <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', marginBottom: '1rem' }}>
                <Upload size={14} /> {uploadingImage ? 'Uploading...' : 'Add Property Photo'}
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

            {/* Amenities */}
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Amenities</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
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
              label="House Rules"
              rows={3}
              name="houseRules"
              value={formData.houseRules}
              onChange={handleChange}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Button type="button" variant="outline" onClick={() => navigate('/owner/listings')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Updates
              </Button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
