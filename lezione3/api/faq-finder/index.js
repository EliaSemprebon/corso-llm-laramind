const express = require('express');
const { trainFaqFinder } = require('./train.js');
const { faqFinder } = require('./message.js');

const router = express.Router();

router.post('/faq', async (req, res) => {
  try {
    const result = await faqFinder(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/train', async (req, res) => {
  try {
    const result = await trainFaqFinder();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
