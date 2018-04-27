const express = require('express');
const router = express.Router();

const DeviceLogController = require('./../controllers/DeviceLogController');

const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');


router.post('/logdata/', DeviceLogController.create); // C
router.get('/logdata/', DeviceLogController.create); // R

module.exports = router;