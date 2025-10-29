import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductForm from './ProductForm';
import CreationForm from './CreationForm';
import TutorialForm from './TutorialForm';
import './admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Dashboard({ setIsAuthenticated }) {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [creations, setCreations] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [productsRes, creationsRes, tutorialsRes] = await Promise.all([
        axios.get(`${API_URL}/products`, config),
        axios.get(`${API_URL}/creations`, config),
        axios.get(`${API_URL}/tutorials`, config)
      ]);
      
      setProducts(productsRes.data);
      setCreations(creationsRes.data);
      setTutorials(tutorialsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting item');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Resin by Dounia - Admin Dashboard</h1>
        <div className="header-actions">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            View Website
          </a>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => { setActiveTab('products'); setEditingItem(null); }}
        >
          Products ({products.length})
        </button>
        <button 
          className={activeTab === 'creations' ? 'active' : ''}
          onClick={() => { setActiveTab('creations'); setEditingItem(null); }}
        >
          Creations ({creations.length})
        </button>
        <button 
          className={activeTab === 'tutorials' ? 'active' : ''}
          onClick={() => { setActiveTab('tutorials'); setEditingItem(null); }}
        >
          Tutorials ({tutorials.length})
        </button>
      </div>

      <div className="dashboard-content">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="section-header">
              <h2>Products (with prices)</h2>
              {!editingItem && (
                <button onClick={() => setEditingItem('new')} className="btn-primary">
                  + Add New Product
                </button>
              )}
            </div>

            {editingItem && (
              <ProductForm 
                item={editingItem === 'new' ? null : editingItem}
                onSuccess={() => { fetchData(); setEditingItem(null); }}
                onCancel={() => setEditingItem(null)}
              />
            )}

            <div className="items-grid">
              {products.map((product) => (
                <div key={product._id} className="item-card">
                  {product.images[0] && (
                    <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} />
                  )}
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="price">{product.price} MAD</div>
                  <div className="item-actions">
                    <button onClick={() => setEditingItem(product)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete('products', product._id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creations Tab */}
        {activeTab === 'creations' && (
          <div>
            <div className="section-header">
              <h2>Creations (no prices)</h2>
              {!editingItem && (
                <button onClick={() => setEditingItem('new')} className="btn-primary">
                  + Add New Creation
                </button>
              )}
            </div>

            {editingItem && (
              <CreationForm 
                item={editingItem === 'new' ? null : editingItem}
                onSuccess={() => { fetchData(); setEditingItem(null); }}
                onCancel={() => setEditingItem(null)}
              />
            )}

            <div className="items-grid">
              {creations.map((creation) => (
                <div key={creation._id} className="item-card">
                  {creation.images[0] && (
                    <img src={`http://localhost:5000${creation.images[0]}`} alt={creation.name} />
                  )}
                  <h3>{creation.name}</h3>
                  <p>{creation.description}</p>
                  <div className="item-actions">
                    <button onClick={() => setEditingItem(creation)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete('creations', creation._id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tutorials Tab */}
        {activeTab === 'tutorials' && (
          <div>
            <div className="section-header">
              <h2>Tutorials</h2>
              {!editingItem && (
                <button onClick={() => setEditingItem('new')} className="btn-primary">
                  + Add New Tutorial
                </button>
              )}
            </div>

            {editingItem && (
              <TutorialForm 
                item={editingItem === 'new' ? null : editingItem}
                onSuccess={() => { fetchData(); setEditingItem(null); }}
                onCancel={() => setEditingItem(null)}
              />
            )}

            <div className="items-grid">
              {tutorials.map((tutorial) => (
                <div key={tutorial._id} className="item-card">
                  <video controls>
                    <source src={`http://localhost:5000${tutorial.videoUrl}`} type="video/mp4" />
                  </video>
                  <h3>{tutorial.title}</h3>
                  <p>{tutorial.description}</p>
                  <div className="item-actions">
                    <button onClick={() => setEditingItem(tutorial)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete('tutorials', tutorial._id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
