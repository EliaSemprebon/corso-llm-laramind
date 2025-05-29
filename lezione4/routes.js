const express = require('express');
const router = express.Router();

const travelAgentRoutes = require('./api/');

router.use('/travel-agents', travelAgentRoutes);

module.exports = router;
