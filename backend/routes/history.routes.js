const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/history.controller');

router.get('/:id/history', ctrl.getHistory);

module.exports = router;
