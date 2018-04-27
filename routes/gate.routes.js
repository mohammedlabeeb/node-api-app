const express = require('express');
const router = express.Router();

const GatesController = require('./../controllers/GatesController');

const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');


router.post('/', passport.authenticate('jwt', {
    session: false
}), GatesController.create); // C
router.get('/', passport.authenticate('jwt', {
    session: false
}), GatesController.all); // R

router.get('/:gate_id', passport.authenticate('jwt', {
    session: false
}), custom.company, GatesController.get); // R
router.put('/:gate_id', passport.authenticate('jwt', {
    session: false
}), custom.company, GatesController.update); // U
router.delete('/:gate_id', passport.authenticate('jwt', {
    session: false
}), custom.company, GatesController.remove); // D

module.exports = router;