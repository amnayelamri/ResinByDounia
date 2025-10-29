// TutorialForm.jsx
import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function TutorialForm({ item, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || ''
  });
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    
    if (video) data.append('video', video);
    if (thumbnail) data.append('thumbnail', thumbnail);

    try {
      if (item) {
        await axios.put(`${API_URL}/tutorials/${item._id}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${API_URL}/tutorials`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving tutorial:', error);
      alert('Error saving tutorial');
    }
  };

  return (
    <div className="form-container">
      <h3>{item ? 'Edit Tutorial' : 'Add New Tutorial'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tutorial Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            required={!item}
          />
          <small>Upload MP4 video file</small>
        </div>

        <div className="form-group">
          <label>Thumbnail (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {item ? 'Update Tutorial' : 'Add Tutorial'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TutorialForm;
