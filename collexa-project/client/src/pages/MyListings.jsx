import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyListings();
  }, [filter]);

  const fetchMyListings = async () => {
    try {
      const status = filter === 'all' ? '' : filter;
      const data = await api.get('/listings/my-listings', { params: { status } });
      setListings(data.listings || []);
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

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link to="/create-listing" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ Create New</Link>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All ({listings.length})</button>
        <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Active</button>
        <button onClick={() => setFilter('expired')} className={`px-4 py-2 rounded ${filter === 'expired' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Expired</button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No listings found</p>
          <Link to="/create-listing" className="text-blue-600 hover:underline">Create your first listing</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.map(listing => (
            <div key={listing._id} className="bg-white p-4 rounded-lg shadow flex gap-4">
              <img src={listing.images?.[0] ? `${import.meta.env.VITE_API_URL}/api/uploads/${listing.images[0]}`
 : 'https://via.placeholder.com/150'} alt={listing.title} className="w-32 h-32 object-cover rounded" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{listing.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-blue-600 font-bold">₹{listing.price}</span>
                      <span className="text-sm text-gray-500">{listing.category}</span>
                      <span className={`text-sm px-2 py-0.5 rounded ${listing.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{listing.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Views: {listing.viewCount} | Posted: {new Date(listing.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to={`/listing/${listing._id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                    {listing.status === 'active' && <button onClick={() => handleDelete(listing._id)} className="text-red-600 hover:underline text-sm">Delete</button>}
                    {listing.status === 'expired' && <button onClick={() => handleReactivate(listing._id)} className="text-green-600 hover:underline text-sm">Reactivate</button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
