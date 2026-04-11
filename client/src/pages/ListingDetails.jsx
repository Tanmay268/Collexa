import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showAccountReport, setShowAccountReport] = useState(false);
  const [accountReportReason, setAccountReportReason] = useState('Fake Account');
  const [accountReportDetails, setAccountReportDetails] = useState('');
  const [reportingAccount, setReportingAccount] = useState(false);
  const [reportFeedback, setReportFeedback] = useState({ type: '', message: '' });
  const [contactingSeller, setContactingSeller] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const data = await api.get(`/listings/${id}`); // Note: /listings (plural)

      // FIX: Check response structure
      console.log('API Response:', data);

      // Your backend returns { success: true, listing: {...} }
      setListing(data.listing); // Use data.listing, not data.data
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && currentImage < images.length - 1) {
      setCurrentImage(currentImage + 1);
    }

    if (distance < -minSwipeDistance && currentImage > 0) {
      setCurrentImage(currentImage - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 spinner"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Listing not found</p>
        <button onClick={() => navigate('/')} className="text-brand-600 hover:underline">
          Go back home
        </button>
      </div>
    );
  }

  // Extract image URLs - handle both Cloudinary objects and legacy strings
  const getImageUrl = (image) => {
    if (!image) return '/placeholder.svg';
    // If it's a Cloudinary object with url property
    if (typeof image === 'object' && image.url) return image.url;
    // If it's already a full URL string
    if (typeof image === 'string' && image.startsWith('http')) return image;
    // Legacy: relative path
    if (typeof image === 'string') return `${import.meta.env.VITE_API_URL || ''}/api/uploads/${image}`;
    return '/placeholder.svg';
  };

  const images = listing.images?.map(img => getImageUrl(img)) || [];

  const submitAccountReport = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    setReportingAccount(true);
    setReportFeedback({ type: '', message: '' });

    try {
      await api.post('/support/account-report', {
        reportedUserId: listing.seller?._id || listing.seller?.id,
        reason: accountReportReason,
        details: accountReportDetails,
      });
      setReportFeedback({ type: 'success', message: 'Account report sent to the support team.' });
      setAccountReportDetails('');
      setShowAccountReport(false);
    } catch (error) {
      setReportFeedback({ type: 'error', message: error.message || 'Failed to report account.' });
    } finally {
      setReportingAccount(false);
    }
  };

  const requestSellerContact = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    setContactingSeller(true);
    setReportFeedback({ type: '', message: '' });

    try {
      await api.post('/support/contact-request', {
        listingId: listing._id || listing.id,
      });
      setReportFeedback({ type: 'success', message: 'The seller has been notified with your email address.' });
    } catch (error) {
      setReportFeedback({ type: 'error', message: error.message || 'Failed to notify seller.' });
    } finally {
      setContactingSeller(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="px-4 pt-4 sm:pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:px-4 lg:py-5">
          {/* Image Gallery */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            {/* Main Image - Full width on mobile */}
            <div className="relative bg-gray-900 lg:rounded-2xl overflow-hidden">
              <div
                className="relative aspect-square sm:aspect-video lg:aspect-[4/3]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={images[currentImage] || '/placeholder.svg'}
                  alt={listing.title}
                  className="w-full h-full object-contain"
                />

                {/* Navigation Arrows - Desktop */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(Math.max(0, currentImage - 1))}
                      disabled={currentImage === 0}
                      className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImage(Math.min(images.length - 1, currentImage + 1))}
                      disabled={currentImage === images.length - 1}
                      className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Dot Indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={`h-2 rounded-full transition-all ${idx === currentImage ? 'w-8 bg-white' : 'w-2 bg-white/50'
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Strip - Desktop only */}
            {images.length > 1 && (
              <div className="hidden lg:grid grid-cols-5 gap-2 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${currentImage === idx ? 'border-brand-600' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="px-4 py-5 space-y-5">
            {/* Title & Badges */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {listing.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="bg-brand-600 text-white px-2.5 py-1 rounded-lg text-xs sm:text-sm font-semibold">
                  {listing.listingType === 'sell' ? 'For Sale' : 'For Rent'}
                </span>
                <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-semibold">
                  {listing.category}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-semibold ${listing.condition === 'New' ? 'bg-green-100 text-green-700' :
                  listing.condition === 'Like New' ? 'bg-blue-100 text-brand-700' :
                    listing.condition === 'Good' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                  }`}>
                  {listing.condition}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 sm:p-5">
              <p className="text-xs sm:text-sm text-brand-600 font-medium mb-1">Price</p>
              <div className="flex items-baseline">
                <span className="text-3xl sm:text-4xl font-bold text-brand-600">
                  ₹{listing.price?.toLocaleString('en-IN')}
                </span>
                {listing.listingType === 'rent' && listing.rentDuration && (
                  <span className="text-base text-gray-600 ml-2">
                    /{listing.rentDuration.replace('per ', '')}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Description</h2>
              <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line leading-6">
                {listing.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Seller Information</h2>
              <div className="flex items-center mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-brand-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {listing.seller?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm sm:text-base font-bold text-gray-900">{listing.seller?.name}</p>
                  {listing.seller?.phone && (
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-0.5">
                      Phone: +91 {listing.seller.phone}
                    </p>
                  )}
                  {listing.seller?.isVerified && (
                    <p className="text-xs text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Student
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {reportFeedback.message && (
                  <div
                    className={`rounded-xl border px-4 py-3 text-xs sm:text-sm ${
                      reportFeedback.type === 'success'
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {reportFeedback.message}
                  </div>
                )}
                <a
                  href={`mailto:${listing.seller?.email}`}
                  className="flex items-center justify-center space-x-2 w-full bg-brand-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Send Email</span>
                </a>

                {listing.seller?.phone && (
                  <a
                    href={`tel:${listing.seller.phone}`}
                    className="flex items-center justify-center space-x-2 w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Seller</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={requestSellerContact}
                  disabled={contactingSeller}
                  className="flex items-center justify-center space-x-2 w-full bg-amber-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors disabled:bg-amber-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                  </svg>
                  <span>{contactingSeller ? 'Sending request...' : 'Notify Seller'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAccountReport((prev) => !prev);
                    setReportFeedback({ type: '', message: '' });
                  }}
                  className="flex items-center justify-center space-x-2 w-full border-2 border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  <span>Report Account</span>
                </button>

                {showAccountReport && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-4 space-y-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-900">
                        Reason
                      </label>
                      <select
                        value={accountReportReason}
                        onChange={(e) => setAccountReportReason(e.target.value)}
                        className="w-full rounded-xl border-2 border-red-100 bg-white px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-red-400"
                        style={{ fontSize: '16px' }}
                      >
                        <option>Fake Account</option>
                        <option>Harassment</option>
                        <option>Spam</option>
                        <option>Fraud</option>
                        <option>Inappropriate Behaviour</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-900">
                        Details
                      </label>
                      <textarea
                        rows={4}
                        value={accountReportDetails}
                        onChange={(e) => setAccountReportDetails(e.target.value)}
                        placeholder="Tell us what happened."
                        className="w-full rounded-xl border-2 border-red-100 bg-white px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-red-400"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={reportingAccount}
                      onClick={submitAccountReport}
                      className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-red-300"
                    >
                      {reportingAccount ? 'Sending report...' : 'Submit Account Report'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
