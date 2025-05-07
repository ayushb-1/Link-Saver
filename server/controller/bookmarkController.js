// const asyncHandler = require('express-async-handler');
const axios = require('axios');
const cheerio = require('cheerio');
const Bookmark = require('../model/BookMark');

// Helper function to extract metadata from URL
const extractMetadata = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    // Extract title
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || url;
    
    // Extract favicon
    let favicon = $('link[rel="icon"]').attr('href') || 
                  $('link[rel="shortcut icon"]').attr('href') || 
                  $('link[rel="apple-touch-icon"]').attr('href');
    
    // If favicon is a relative path, convert to absolute
    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url);
      favicon = `${urlObj.origin}${favicon.startsWith('/') ? '' : '/'}${favicon}`;
    }
    
    // Default favicon if none found
    if (!favicon) {
      const urlObj = new URL(url);
      favicon = `${urlObj.origin}/favicon.ico`;
    }
    
    return { title, favicon };
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return { title: url, favicon: '/favicon.ico' };
  }
};

// Helper function to generate summary using Jina AI
const generateSummary = async (url) => {
  try {
    const response = await axios.get(`https://r.jina.ai/${url}`);
    console.log("response", response)
    return response.data || 'No summary available.';
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Unable to generate summary at this time.';
  }
};



const createBookmark = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400);
    throw new Error('Please provide a URL');
  }

  // Check if bookmark already exists for this user
  const existingBookmark = await Bookmark.findOne({ user: req.user._id, url });
  
  if (existingBookmark) {
    res.status(400);
    throw new Error('This URL is already bookmarked');
  }

  // Extract metadata
  const { title, favicon } = await extractMetadata(url);
  
  // Generate summary
  const summary = await generateSummary(url);

  const bookmark = await Bookmark.create({
    user: req.user._id,
    url,
    title,
    favicon,
    summary,
  });

  if (bookmark) {
    res.status(201).json(bookmark);
  } else {
    res.status(400);
    throw new Error('Invalid bookmark data');
  }
};


const getBookmarks = async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(bookmarks);
};


const deleteBookmark = async (req, res) => {
  const bookmark = await Bookmark.findById(req.params.id);

  if (!bookmark) {
    res.status(404);
    throw new Error('Bookmark not found');
  }

  // Check if user owns the bookmark
  if (bookmark.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this bookmark');
  }

  await bookmark.deleteOne();
  res.json({ message: 'Bookmark removed' });
};

module.exports = { getBookmarks, createBookmark, deleteBookmark };