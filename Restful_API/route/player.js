const express = require('express');
const router = express.Router();
const playerController = require('../controller/player');

router.get('/', playerController.getPlayer);
router.post('/', playerController.createPlayer);
router.post('/login', playerController.checkLogIn);
router.get('/setting/:playerID', playerController.getSettingOfPlayer);
router.post('/setting/:playerID', playerController.postSettingOfPlayer);
router.get('/verification', playerController.getVerify);

module.exports = router;