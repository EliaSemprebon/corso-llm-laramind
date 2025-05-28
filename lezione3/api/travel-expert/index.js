const express = require('express');

const chroma = require('../../libs/chroma.js');
const { travelExpert } = require('./message.js');
const { trainTravelExpert, trainTravelKeywords } = require('./train.js');

const router = express.Router();

router.post('/travel', async (req, res) => {
  try {
    const result = await travelExpert(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/train', async (req, res) => {
  try {
    // Train travel expert content
    const expertResult = await trainTravelExpert();
    if (!expertResult.success) {
      return res.json({ success: false });
    }
    // If successful, train keywords
    const keywordsResult = await trainTravelKeywords();
    if (!keywordsResult.success) {
      return res.json({ success: false });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const result = await chroma.delete({ project: 'travel-expert' });
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
    const results = await chroma.read([query], {
      $and: [
        { project: 'travel-expert' },
        { trainingType: 'keyword' }
      ]
    });
    if (!results) {
      return res.status(500).json({ error: 'Search failed' });
    }
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
