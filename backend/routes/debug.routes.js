const express = require('express');
const router = express.Router();
const debugController = require('../controllers/debug.controller');

router.get('/whoami', debugController.whoami);
router.get('/test-completed-orders', debugController.testCompletedOrders);

module.exports = router;
