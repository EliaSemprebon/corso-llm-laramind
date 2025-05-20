const express = require('express');
const router = express.Router();

const travelExpertRoutes = require('./api/travel-expert');
const faqFinderRoutes = require('./api/faq-finder');

router.use('/travel-expert', travelExpertRoutes);
router.use('/faq-finder', faqFinderRoutes);

module.exports = router;
