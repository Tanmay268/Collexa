import { useState, useEffect } from 'react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  const categories = ['Books', 'Cycles', 'Electronics', 'Instruments', 'Sports Equipment', 'Lab Equipment', 'Others'];

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;

      const data = await api.get('/listings', { params });

      // FIX: Your backend returns { success: true, listings: [...] }
      setListings(data.listings || []); // Already correct!
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-10 py-12 px-4 rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 relative z-10">
          Student Marketplace
        </h1>
        <p className="text-xl font-medium text-brand-50 max-w-2xl mx-auto relative z-10">
          Buy, sell, and rent items within the VIT community
        </p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for items, categories, or keywords..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full px-5 py-4 text-lg bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md focus:shadow-md focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="listingType"
                    value=""
                    checked={filters.listingType === ''}
                    onChange={(e) => handleFilterChange('listingType', e.target.value)}
                    className="mr-2"
                  />
                  All
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="listingType"
                    value="sell"
                    checked={filters.listingType === 'sell'}
                    onChange={(e) => handleFilterChange('listingType', e.target.value)}
                    className="mr-2"
                  />
                  For Sale
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="listingType"
                    value="rent"
                    checked={filters.listingType === 'rent'}
                    onChange={(e) => handleFilterChange('listingType', e.target.value)}
                    className="mr-2"
                  />
                  For Rent
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No listings found</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm font-medium text-gray-500">
                {listings.length} listing{listings.length !== 1 ? 's' : ''} found
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
