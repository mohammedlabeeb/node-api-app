const express = require('express');
const router = express.Router();

const UserController = require('./../controllers/UserController');

const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');


router.post('/login', UserController.login);
router.post('/register', UserController.create);
//router.post('/forget/password', UserController.get);
//router.post('/reset/password', UserController.update);

module.exports = router;