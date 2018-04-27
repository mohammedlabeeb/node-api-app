const express = require('express');
const router = express.Router();

const UserController = require('./../controllers/UserController');

const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');

router.post('/', passport.authenticate('jwt', {
    session: false
}), UserController.create); // R
router.get('/', passport.authenticate('jwt', {
    session: false
}), UserController.get); // R
router.put('/', passport.authenticate('jwt', {
    session: false
}), UserController.update); // U
router.delete('/', passport.authenticate('jwt', {
    session: false
}), UserController.remove); // D

module.exports = router;