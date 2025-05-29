const express = require('express');
const { faqFinder } = require('./message.js');

const router = express.Router();

router.post('/message', async (req, res) => {
  try {
    const result = await faqFinder(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
