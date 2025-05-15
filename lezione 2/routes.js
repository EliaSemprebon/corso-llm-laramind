const express = require('express');
const router = express.Router();

// Import routes for each API
const semanticLensRoutes = require('./api/semantic-lens');
const geoRoutes = require('./api/geo');
const helpFlowRoutes = require('./api/help-flow');

// Use the routes
router.use('/semantic-lens', semanticLensRoutes);
router.use('/geo', geoRoutes);
router.use('/help-flow', helpFlowRoutes);

module.exports = router;
