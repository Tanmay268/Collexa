import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Books',
    condition: 'Good',
    price: '',
    listingType: 'sell',
    rentDuration: 'per month',
  });
  const [images, setImages] = useState([]);

  const categories = ['Books', 'Cycles', 'Electronics', 'Instruments', 'Sports Equipment', 'Lab Equipment', 'Others'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setImages(files);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'rentDuration' && formData.listingType === 'sell') return;
      data.append(key, formData[key]);
    });
    images.forEach(image => data.append('images', image));

    try {
      await api.post('/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/my-listings');
    } catch (err) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., Engineering Mathematics Textbook" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea name="description" required value={formData.description} onChange={handleChange} rows="4" placeholder="Describe your item..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Condition *</label>
            <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
              {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select name="listingType" value={formData.listingType} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
              <option value="sell">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          {formData.listingType === 'rent' && (
            <div>
              <label className="block text-sm font-medium mb-1">Rent Duration *</label>
              <select name="rentDuration" value={formData.rentDuration} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="per day">Per Day</option>
                <option value="per week">Per Week</option>
                <option value="per month">Per Month</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (₹) *</label>
          <input type="number" name="price" required value={formData.price} onChange={handleChange} min="0" max="100000" placeholder="Enter price" className="w-full px-4 py-2 border rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Images * (Max 5, each under 5MB)</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageChange} className="w-full px-4 py-2 border rounded-lg" />
          {images.length > 0 && <p className="text-sm text-gray-600 mt-2">{images.length} image(s) selected</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 font-medium">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}
