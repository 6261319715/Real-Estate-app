import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getImageSrc } from '../utils/helpers';
import { LoadingSpinner, ErrorMessage } from '../components/ui';
import './PropertyDetails.css';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchProperty = useCallback(() => {
    setError(null);
    setLoading(true);
    api.get(`/property/${id}`)
      .then(({ data }) => setProperty(data))
      .catch((err) => setError(err.response?.status === 404 ? 'Property not found.' : 'Failed to load property.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  if (loading) {
    return (
      <div className="container min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner label="Loading property..." />
      </div>
    );
  }
  if (error || !property) {
    return (
      <div className="container py-12">
        <ErrorMessage
          message={error || 'Property not found.'}
          onRetry={fetchProperty}
        />
        <Link to="/" className="inline-block mt-4 text-sky-500 hover:underline">Back to listings</Link>
      </div>
    );
  }

  const isOwnProperty = user && property.sellerId?._id === user._id;
  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://placehold.co/800x500?text=No+image'];
  const mainSrc = getImageSrc(images[selectedImageIndex]) || images[selectedImageIndex];

  return (
    <div className="container max-w-4xl">
      <button
        type="button"
        className="btn btn-secondary back-btn mb-4 sm:mb-6"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <article className="property-detail">
        <div className="property-detail-gallery">
          <div className="property-detail-main-image">
            <img
              src={mainSrc}
              alt={`${property.title} – ${selectedImageIndex + 1}`}
            />
          </div>
          {images.length > 1 && (
            <div className="property-detail-thumbnails">
              {images.map((img, i) => {
                const src = getImageSrc(img) || img;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`property-detail-thumb ${i === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(i)}
                  >
                    <img src={src} alt={`${property.title} ${i + 1}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="property-detail-content">
          <span className="property-detail-type">{property.propertyType}</span>
          <h1>{property.title}</h1>
          <p className="property-detail-price">${property.price?.toLocaleString()}</p>
          <p className="property-detail-location">{property.location}</p>
          {images.length > 0 && (
            <div className="property-detail-meta">
              <span>{images.length} photo{images.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="property-detail-description">
            <h2>Description</h2>
            <p>{property.description}</p>
          </div>
          <div className="property-detail-seller">
            <h2>Seller</h2>
            <p><strong>{property.sellerId?.name}</strong></p>
            <p className="seller-email">{property.sellerId?.email}</p>
            {user && !isOwnProperty && (
              <Link to={`/property/${id}/contact`} className="btn btn-primary">
                Contact seller
              </Link>
            )}
            {!user && (
              <p className="login-prompt">Please <Link to="/login">log in</Link> to contact the seller.</p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
