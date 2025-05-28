const express = require('express');

const { faqFinder } = require('./message.js');
const chroma = require('../../libs/chroma.js');
const { trainFaqFinder } = require('./train.js');

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

router.delete('/delete', async (req, res) => {
  try {
    const result = await chroma.delete({ project: 'faq-finder' });
    if (!result) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const results = await chroma.read([query], { project: 'faq-finder' });
    if (!results) {
      return res.status(500).json({ error: 'Search failed' });
    }
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
