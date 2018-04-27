const express = require('express');
const router = express.Router();

const DeviceController = require('./../controllers/DeviceController');

const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');


router.post('/', passport.authenticate('jwt', {
    session: false
}), DeviceController.create); // C
router.get('/', passport.authenticate('jwt', {
    session: false
}), DeviceController.all); // R

router.get('/:device_id', passport.authenticate('jwt', {
    session: false
}), custom.company, DeviceController.get); // R
router.put('/:device_id', passport.authenticate('jwt', {
    session: false
}), custom.company, DeviceController.update); // U
router.delete('/:device_id', passport.authenticate('jwt', {
    session: false
}), custom.company, DeviceController.remove); // D

module.exports = router;