const express = require('express');
const multer = require('multer');
const path = require('path');
const Tutorial = require('../models/Tutorial');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/tutorials/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ createdAt: -1 });
    res.json(tutorials);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description } = req.body;
    const videoUrl = req.files.video ? `/uploads/tutorials/${req.files.video[0].filename}` : '';
    const thumbnail = req.files.thumbnail ? `/uploads/tutorials/${req.files.thumbnail[0].filename}` : '';
    
    const tutorial = new Tutorial({ title, description, videoUrl, thumbnail });
    await tutorial.save();
    
    res.status(201).json(tutorial);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };
    
    if (req.files.video) {
      updateData.videoUrl = `/uploads/tutorials/${req.files.video[0].filename}`;
    }
    if (req.files.thumbnail) {
      updateData.thumbnail = `/uploads/tutorials/${req.files.thumbnail[0].filename}`;
    }
    
    const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(tutorial);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Tutorial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tutorial deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;