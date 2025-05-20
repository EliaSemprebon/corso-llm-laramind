const express = require('express');
const router = express.Router();

// Empty controller for now - will be implemented step by step
async function travelExpert(req, res) {
  try {
   
  } catch (error) {
    console.error('Travel Exper Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Route for travel exper
router.post('/travel', travelExpert);

module.exports = router;
