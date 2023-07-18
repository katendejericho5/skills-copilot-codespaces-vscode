// Create web server

// Import module
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import model
const Comment = require('../models/Comment');

// Import middleware
const auth = require('../middleware/auth');

// @route   GET api/comments
// @desc    Get all comments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({
      date: -1,
    });
    res.json(comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/comments
// @desc    Add new comment
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Valid email is required').isEmail(),
      check('comment', 'Comment is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If error, send bad request
      return res.status(400).json({ errors: errors.array() });
    }

    // If no error, destructure body
    const { name, email, comment } = req.body;

    try {
      // Create new comment
      const newComment = new Comment({
        name,
        email,
        comment,
      });

      // Save new comment
      const comment = await newComment.save();

      // Send comment
      res.json(comment);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// Export module
module.exports = router;
