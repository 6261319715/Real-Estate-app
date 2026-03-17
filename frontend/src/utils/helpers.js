/**
 * Get user-friendly error message from API or network error
 */
export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err) return fallback;
  const msg = err.response?.data?.message;
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (err.message === 'Network Error') return 'Network error. Check your connection and try again.';
  if (err.response?.status === 404) return 'Not found.';
  if (err.response?.status >= 500) return 'Server error. Please try again later.';
  return fallback;
}

/**
 * Normalize image URL for display (handles relative /uploads paths)
 */
export function getImageSrc(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : `/${url}`;
}
