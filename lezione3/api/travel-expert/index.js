const express = require('express');

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
    const result = await trainTravelExpert();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/train/keywords', async (req, res) => {
  try {
    const result = await trainTravelKeywords();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
