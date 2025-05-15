const express = require('express');
const router = express.Router();

router.post('/message', (req, res) => {
  // Endpoint for helpdesk assistance
  res.json({ success: true });
});

module.exports = router;
