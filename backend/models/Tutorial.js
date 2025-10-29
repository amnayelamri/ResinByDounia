const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tutorial', tutorialSchema);