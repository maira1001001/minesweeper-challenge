/** @format */
const { Router } = require('express');

const controller = require('./controllers/controller');

const router = Router();

router.post('/new-game', controller.createNewGame);
router.post('/new-custom-game', controller.createNewCustomGame);
router.get('/last-game', controller.getLastGame);
router.put('/save-game', controller.saveLastGame);
router.get('/healthcheck', controller.healthcheck);

module.exports = router;
