import { useState, useEffect } from 'react';
import axios from 'axios';
import './PublicSite.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function PublicSite() {
  const [products, setProducts] = useState([]);
  const [creations, setCreations] = useState([]);
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, creationsRes, tutorialsRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/creations`),
        axios.get(`${API_URL}/tutorials`)
      ]);
      setProducts(productsRes.data);
      setCreations(creationsRes.data);
      setTutorials(tutorialsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="public-site">
      {/* Header */}
      <header className="header">
        <div className="logo-circle">
          <img src="/logo.png" alt="Resin by Dounia Logo" />
        </div>
        <h1>RESIN by DOUNIA</h1>
        <p>رزين | Artist</p>
        <p className="tagline">🏆 I'm not the only one, but the best ⭐</p>
        <p>🌹 Morocco المغرب</p>
        <p>📦 shipping MA</p>
        
        <div className="stats">
          <div className="stat">
            <div className="stat-number">754</div>
            <div className="stat-label">posts</div>
          </div>
          <div className="stat">
            <div className="stat-number">29.1K</div>
            <div className="stat-label">followers</div>
          </div>
          <div className="stat">
            <div className="stat-number">210</div>
            <div className="stat-label">following</div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <ul>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#catalog">Catalog</a></li>
          <li><a href="#tutorials">Tutorials</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <div className="container">
        {/* Gallery - Creations */}
        <section id="gallery">
          <h2>Our Creations</h2>
          <div className="gallery">
            {creations.map((creation) => (
              <div key={creation._id} className="gallery-item">
                {creation.images[0] && (
                  <img src={`${API_URL}${creation.images[0]}`} alt={creation.name} />
                )}
                <div className="gallery-item-info">
                  <h3>{creation.name}</h3>
                  <p>{creation.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Catalog - Products with Prices */}
        <section id="catalog">
          <h2>Product Catalog</h2>
          <div className="catalog">
            {products.map((product) => (
              <div key={product._id} className="product">
                {product.images[0] && (
                  <img src={`${API_URL}${product.images[0]}`} alt={product.name} />
                )}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="price">{product.price} MAD</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tutorials */}
        <section id="tutorials">
          <h2>Resin Tutorials</h2>
          <div className="tutorials">
            {tutorials.map((tutorial) => (
              <div key={tutorial._id} className="tutorial">
                <video controls>
                  <source src={`${API_URL}${tutorial.videoUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <h3>{tutorial.title}</h3>
                <p>{tutorial.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <h2>Get in Touch</h2>
          <div className="contact">
            <p>Follow us on social media and reach out for orders or inquiries</p>
            
            <div className="social-links">
              <a href="https://www.instagram.com/resinbydounia/" target="_blank" rel="noopener noreferrer">
                <span>📷</span> Instagram @resinbydounia
              </a>
              <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                <span>📘</span> Facebook
              </a>
            </div>

            <div className="phone">📞 +212 XXX-XXXXXX</div>
          </div>
        </section>
      </div>

     <footer className="footer">
      <p>&copy; 2025 Resin by Dounia | رزين. All rights reserved.</p>
      <p>Handcrafted with love in Morocco 🇲🇦</p>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: '0.5' }}>
      <a href="/admin/login" style={{ color: 'white', textDecoration: 'none' }}>Admin</a>
      </p>
    </footer>
    </div>
  );
}

export default PublicSite;
