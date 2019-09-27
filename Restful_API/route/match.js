const express = require('express');
const router = express.Router();
const matchController = require('../controller/match');

router.post('/', matchController.postMatch);
router.post('/end/:matchID', matchController.postEndTime);
router.post('/frags', matchController.postFrags);

module.exports = router;