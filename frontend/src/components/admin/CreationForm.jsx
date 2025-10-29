import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function CreationForm({ item, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || ''
  });
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem('token');
    
    if (!formData.name || !formData.description) {
      alert('Please fill all fields');
      setLoading(false);
      return;
    }

    if (!item && (!images || images.length === 0)) {
      alert('Please select at least one image');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }
    }

    try {
      if (item) {
        await axios.put(`${API_URL}/creations/${item._id}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Creation updated successfully!');
      } else {
        await axios.post(`${API_URL}/creations`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Creation added successfully!');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving creation:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to save creation'}`);
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
      <h3>{item ? 'Edit Creation' : 'Add New Creation'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Creation Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., Sujet Dragée"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows="4"
            placeholder="Describe your creation..."
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
            {loading ? 'Saving...' : (item ? 'Update Creation' : 'Add Creation')}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreationForm;