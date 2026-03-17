import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ErrorMessage } from '../components/ui';
import { getErrorMessage } from '../utils/helpers';
import './AddProperty.css';

const PROPERTY_TYPES = ['house', 'flat', 'land'];

export default function AddProperty() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'house',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState('');
  const [showUpgradeLink, setShowUpgradeLink] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const urls = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [selectedFiles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const valid = files.filter((f) => allowed.includes(f.type));
    if (valid.length !== files.length) setError('Only JPEG, PNG, GIF and WebP images are allowed.');
    else setError('');
    setSelectedFiles((prev) => [...prev, ...valid].slice(0, 10));
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('location', form.location);
      data.append('propertyType', form.propertyType);
      selectedFiles.forEach((file) => data.append('images', file));

      const { data: result } = await api.post('/property/add', data, {
        headers: { 'Content-Type': undefined },
      });
      navigate(`/property/${result._id}`);
    } catch (err) {
      const isLimit = err.response?.data?.code === 'LISTING_LIMIT';
      setShowUpgradeLink(!!isLimit);
      setError(getErrorMessage(err, 'Failed to add property.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="add-property-card">
        <h1>Add property</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Spacious 3BR House"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Describe the property..."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Property type</label>
              <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="City, State or Address"
            />
          </div>
          <div className="form-group">
            <label>Images (up to 10, JPEG/PNG/GIF/WebP, max 5MB each)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              multiple
              onChange={handleFileChange}
              className="add-property-file-input"
            />
            {selectedFiles.length > 0 && (
              <div className="add-property-preview">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="add-property-preview-item">
                    <img src={previewUrls[i] || ''} alt={`Preview ${i + 1}`} />
                    <button type="button" className="add-property-remove-img" onClick={() => removeFile(i)} aria-label="Remove">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && (
              <>
                <ErrorMessage message={error} className="mt-2" />
                {showUpgradeLink && (
                  <Link to="/app/pricing" className="mt-2 inline-block text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline">
                    Upgrade plan →
                  </Link>
                )}
              </>
            )}
          <div className="add-property-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
