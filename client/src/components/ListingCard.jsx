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
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
              {listing.listingType === 'sell' ? 'For Sale' : 'For Rent'}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {listing.title}
            </h3>
            <span className="text-blue-600 font-bold text-lg whitespace-nowrap ml-2">
              ₹{listing.price}
              {listing.listingType === 'rent' && listing.rentDuration && (
                <span className="text-xs text-gray-500">/{listing.rentDuration.replace('per ', '')}</span>
              )}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {listing.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {listing.category}
            </span>
            <span className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-1 ${listing.condition === 'New' ? 'bg-green-500' :
                listing.condition === 'Like New' ? 'bg-blue-500' :
                  listing.condition === 'Good' ? 'bg-yellow-500' : 'bg-orange-500'
                }`}></span>
              {listing.condition}
            </span>
          </div>

          {listing.seller && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                {listing.seller.name?.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 text-sm text-gray-600">{listing.seller.name}</span>
              {listing.seller.isVerified && (
                <svg className="w-4 h-4 ml-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
