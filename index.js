// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const cors = require('cors');
const Url = require('./models/url');

const app = express();

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON bodies

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- API Routes ---

// @route   GET /:code
// @desc    Redirect to the original long URL
app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      // Found the URL, redirect the user
      console.log(`Redirecting to: ${url.originalUrl}`);
      return res.redirect(url.originalUrl);
    } else {
      // No URL found
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

// @route   POST /api/shorten
// @desc    Create a short URL
app.post('/api/shorten', async (req, res) => {
  const { longUrl } = req.body; // longUrl is the key in the JSON body
  const baseUrl = process.env.BASE_URL;

  // Basic validation for longUrl
  if (!longUrl) {
    return res.status(400).json('Please provide a URL');
  }

  // A simple URL validation check (can be improved with a regex library)
  if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
    return res.status(400).json('Invalid URL format');
  }

  try {
    // Check if the long URL already exists in the database
    let url = await Url.findOne({ originalUrl: longUrl });

    if (url) {
      // If it exists, return the existing short URL
      res.json(url);
    } else {
      // If it doesn't exist, create a new short URL
      const urlCode = shortid.generate();
      const shortUrl = `${baseUrl}/${urlCode}`;

      url = new Url({
        originalUrl: longUrl,
        shortUrl,
        urlCode,
      });

      await url.save();
      res.status(201).json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));