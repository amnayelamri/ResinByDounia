const express = require('express');
const multer = require('multer');
const path = require('path');
const Creation = require('../models/Creation');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/creations/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const creations = await Creation.find().sort({ createdAt: -1 });
    res.json(creations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description } = req.body;
    const images = req.files.map(file => `/uploads/creations/${file.filename}`);
    
    const creation = new Creation({ name, description, images });
    await creation.save();
    
    res.status(201).json(creation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateData = { name, description };
    
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/creations/${file.filename}`);
    }
    
    const creation = await Creation.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(creation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Creation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Creation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
