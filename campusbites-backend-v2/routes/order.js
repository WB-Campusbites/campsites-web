
const express = require('express');
const router = express.Router();

// Temporary route to verify that the order API loads
router.get('/', (req, res) => {
  res.json({
    message: 'Order API is working'
  });
});

module.exports = router;
