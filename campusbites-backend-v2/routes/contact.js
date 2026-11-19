
const express = require('express');
const router = express.Router();

// Temporary route to verify that the contact API loads
router.get('/', (req, res) => {
  res.json({
    message: 'Contact API is working'
  });
});

module.exports = router;
