import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getImageSrc } from '../utils/helpers';
import { getErrorMessage } from '../utils/helpers';
import { LoadingSpinner, ErrorMessage } from '../components/ui';
import './ContactSeller.css';

export default function ContactSeller() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProperty = useCallback(() => {
    setFetchError(null);
    setLoading(true);
    api.get(`/property/${id}`)
      .then(({ data }) => setProperty(data))
      .catch(() => setFetchError('Property not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/contact', {
        propertyId: property._id,
        message,
        name,
        email,
        phone,
      });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to send message.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner label="Loading..." />
      </div>
    );
  }

  if (fetchError || !property) {
    return (
      <div className="container py-12">
        <ErrorMessage message={fetchError || 'Property not found.'} onRetry={fetchProperty} />
        <Link to="/" className="inline-block mt-4 text-sky-500 hover:underline">Back to listings</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="contact-login-required">
          <h1>Contact seller</h1>
          <p>Please log in to contact the seller.</p>
          <Link to="/login" className="btn btn-primary">Log in</Link>
          <Link to={`/property/${id}`} className="btn btn-secondary">Back to property</Link>
        </div>
      </div>
    );
  }

  const isOwnProperty = property.sellerId?._id === user._id;
  if (isOwnProperty) {
    return (
      <div className="container">
        <div className="contact-login-required">
          <h1>Contact seller</h1>
          <p>You cannot contact yourself for your own listing.</p>
          <Link to={`/property/${id}`} className="btn btn-primary">Back to property</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container">
        <div className="contact-success-card">
          <h1>Message sent</h1>
          <p className="success-msg">Your message was sent to the seller. They will get back to you soon.</p>
          <Link to={`/property/${id}`} className="btn btn-primary">Back to property</Link>
          <Link to="/" className="btn btn-secondary">Browse more listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to={`/property/${id}`} className="contact-back">← Back to property</Link>

      <div className="contact-page-card">
        <div className="contact-property-preview">
          <img
            src={getImageSrc(property.images?.[0]) || property.images?.[0] || 'https://placehold.co/600x300?text=Property'}
            alt={property.title}
          />
          <div>
            <h1>Contact seller</h1>
            <p className="contact-property-title">{property.title}</p>
            <p className="contact-property-location">{property.location}</p>
            <p className="contact-seller-name">Seller: {property.sellerId?.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone (optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="I'm interested in this property..."
              rows={5}
            />
          </div>
          {error && <ErrorMessage message={error} className="mt-2" />}
          <div className="contact-form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
