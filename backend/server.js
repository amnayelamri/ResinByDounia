const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config();

const app = express();

// Middleware

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use('/uploads', express.static('/app/uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// User Model (for admin authentication)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

const User = mongoose.model('User', userSchema);

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Default admin user created');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

createDefaultAdmin();

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const creationRoutes = require('./routes/creations');
const tutorialRoutes = require('./routes/tutorials');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/creations', creationRoutes);
app.use('/api/tutorials', tutorialRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Resin by Dounia API is running! 🎨' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
