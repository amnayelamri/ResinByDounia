import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ProductForm({ item, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || ''
  });
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem('token');
    
    // Validation
    if (!formData.name || !formData.description || !formData.price) {
      alert('Please fill all fields');
      setLoading(false);
      return;
    }

    // Check if images are provided for new products
    if (!item && (!images || images.length === 0)) {
      alert('Please select at least one image');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    
    // Append all selected images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }
    }

    try {
      if (item) {
        // Update existing product
        await axios.put(`${API_URL}/products/${item._id}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Product updated successfully!');
      } else {
        // Create new product
        await axios.post(`${API_URL}/products`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Product added successfully!');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to save product'}`);
      } else {
        alert('Error: Could not connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 5) {
      alert('Maximum 5 images allowed');
      e.target.value = '';
      return;
    }
    setImages(files);
  };

  return (
    <div className="form-container">
      <h3>{item ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., Resin Serving Tray"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows="4"
            placeholder="Describe your product..."
          />
        </div>

        <div className="form-group">
          <label>Price (MAD) *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            min="0"
            step="0.01"
            placeholder="e.g., 250"
          />
        </div>

        <div className="form-group">
          <label>Images {!item && '*'} (up to 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            required={!item}
          />
          <small>Choose up to 5 images. JPG, PNG, or JPEG format.</small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (item ? 'Update Product' : 'Add Product')}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
