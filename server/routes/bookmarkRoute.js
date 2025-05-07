const express = require('express');
const router = express.Router();
const {  getBookmarks, createBookmark, deleteBookmark } = require('../controller/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.get('/getbookmarks', protect, getBookmarks);
router.post('/createbookmark', protect, createBookmark);
router.delete('/deletebookmark/:id', protect, deleteBookmark);

// router.route('/:id')
//   .delete(protect, deleteBookmark);

module.exports = router;