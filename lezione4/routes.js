const express = require('express');
const router = express.Router();

const faqFinderRoutes = require('./api/faq-finder');

router.use('/faq-finder', faqFinderRoutes);

module.exports = router;
