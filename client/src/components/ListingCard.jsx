import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  // Extract image URL - handle both Cloudinary objects and legacy strings
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

  const imageUrl = listing.images && listing.images.length > 0
    ? getImageUrl(listing.images[0])
    : '/placeholder.svg';

  return (
    <Link to={`/listing/${listing._id}`}>
      <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-3 right-3">
            <span className="bg-brand-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
              {listing.listingType === 'sell' ? 'For Sale' : 'For Rent'}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
              {listing.title}
            </h3>
            <span className="text-brand-600 font-extrabold text-lg whitespace-nowrap ml-2">
              ₹{listing.price}
              {listing.listingType === 'rent' && listing.rentDuration && (
                <span className="text-xs font-medium text-gray-500 block text-right -mt-1">/{listing.rentDuration.replace('per ', '')}</span>
              )}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {listing.description}
          </p>

          <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
            <span className="bg-gray-100/80 px-2.5 py-1 rounded-md border border-gray-200">
              {listing.category}
            </span>
            <span className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-1 ${listing.condition === 'New' ? 'bg-green-500' :
                listing.condition === 'Like New' ? 'bg-brand-500' :
                  listing.condition === 'Good' ? 'bg-yellow-500' : 'bg-orange-500'
                }`}></span>
              {listing.condition}
            </span>
          </div>

          {listing.seller && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center">
              <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {listing.seller.name?.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2.5 text-sm font-medium text-gray-700">{listing.seller.name}</span>
              {listing.seller.isVerified && (
                <svg className="w-4 h-4 ml-1 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
