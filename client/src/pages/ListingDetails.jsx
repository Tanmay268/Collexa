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

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const data = await api.get(`/listings/${id}`);
      setListing(data.listing);
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
        <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
          Go back home
        </button>
      </div>
    );
  }

  const images = listing.images?.map(img => `${import.meta.env.VITE_API_URL}/api/uploads/${img}`
  ) || [];

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

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:px-4 lg:py-6">
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
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${currentImage === idx ? 'border-blue-600' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="px-4 py-6 space-y-6">
            {/* Title & Badges */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {listing.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                  {listing.listingType === 'sell' ? 'For Sale' : 'For Rent'}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                  {listing.category}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${listing.condition === 'New' ? 'bg-green-100 text-green-700' :
                    listing.condition === 'Like New' ? 'bg-blue-100 text-blue-700' :
                      listing.condition === 'Good' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-orange-100 text-orange-700'
                  }`}>
                  {listing.condition}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 sm:p-6">
              <p className="text-sm text-blue-600 font-medium mb-1">Price</p>
              <div className="flex items-baseline">
                <span className="text-4xl sm:text-5xl font-bold text-blue-600">
                  ₹{listing.price?.toLocaleString('en-IN')}
                </span>
                {listing.listingType === 'rent' && listing.rentDuration && (
                  <span className="text-lg text-gray-600 ml-2">
                    /{listing.rentDuration.replace('per ', '')}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h2>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {listing.seller?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-bold text-gray-900">{listing.seller?.name}</p>
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
                <a
                  href={`mailto:${listing.seller?.email}`}
                  className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Send Email</span>
                </a>

                {listing.seller?.phone && (
                  <a
                    href={`tel:${listing.seller.phone}`}
                    className="flex items-center justify-center space-x-2 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Seller</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}