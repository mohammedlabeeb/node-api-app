const express = require('express');
const router = express.Router();

const CompanyController = require('./../controllers/CompanyController');

const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');


router.post('/', passport.authenticate('jwt', {
    session: false
}), CompanyController.create); // C
router.get('/', passport.authenticate('jwt', {
    session: false
}), CompanyController.getAll); // R

router.get('/:company_id', passport.authenticate('jwt', {
    session: false
}), custom.company, CompanyController.get); // R
router.put('/:company_id', passport.authenticate('jwt', {
    session: false
}), custom.company, CompanyController.update); // U
router.delete('/:company_id', passport.authenticate('jwt', {
    session: false
}), custom.company, CompanyController.remove); // D

module.exports = router;