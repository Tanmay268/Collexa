import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  useEffect(() => {
    fetchMyListings();
  }, [filter]);

  const fetchMyListings = async () => {
    try {
      let url = '/listings/my-listings';
      if (filter && filter !== 'all') {
        url += `?status=${filter}`;
      }
      const data = await api.get(url);

      // FIX: Check what your backend returns
      console.log('My Listings Response:', data);

      setListings(data.listings || []); // Already correct!
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      fetchMyListings();
    } catch (error) {
      alert('Failed to delete listing');
    }
  };

  const handleReactivate = async (id) => {
    try {
      await api.post(`/listings/${id}/reactivate`);
      fetchMyListings();
    } catch (error) {
      alert('Failed to reactivate listing');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-brand-600 text-white' : 'bg-gray-200'}`}>All ({listings.length})</button>
        <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-brand-600 text-white' : 'bg-gray-200'}`}>Active</button>
        <button onClick={() => setFilter('expired')} className={`px-4 py-2 rounded ${filter === 'expired' ? 'bg-brand-600 text-white' : 'bg-gray-200'}`}>Expired</button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4 text-lg">No listings found</p>
          <Link to="/create-listing" className="text-brand-600 font-semibold hover:underline">Create your first listing</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map(listing => (
            <div key={listing._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow">
              <img
                src={getImageUrl(listing.images?.[0])}
                alt={listing.title}
                className="w-full sm:w-36 h-48 sm:h-auto object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mr-2">{listing.title}</h3>
                    <span className="text-brand-600 font-extrabold whitespace-nowrap">₹{listing.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">{listing.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{listing.category}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{listing.status.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 font-medium">Views: {listing.viewCount} • Posted: {new Date(listing.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                  <Link to={`/listing/${listing._id}`} className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-3 rounded-lg text-sm transition-colors">View</Link>
                  {listing.status === 'active' && (
                    <button onClick={() => handleDelete(listing._id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-3 rounded-lg text-sm transition-colors">Delete</button>
                  )}
                  {listing.status === 'expired' && (
                    <button onClick={() => handleReactivate(listing._id)} className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-2 px-3 rounded-lg text-sm transition-colors">Activate</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
