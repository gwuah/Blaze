const customerRoutes = require('./Customer');

const express = require('express');
const router = new express.Router();

router.use('/customers', customerRoutes);


module.exports = router;