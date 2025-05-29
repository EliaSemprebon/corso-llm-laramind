const express = require('express');
const { travelAgents } = require('./message.js');

const router = express.Router();

router.post('/message', async (req, res) => {
  try {
    const result = await travelAgents(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
