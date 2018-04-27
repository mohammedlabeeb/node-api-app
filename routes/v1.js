const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const companyRoutes = require('./company.routes');
const gatesRoutes = require('./gate.routes');
const deviceRoutes = require('./device.routes');
const publicRoutes = require('./public.routes');
const HomeController = require('./../controllers/HomeController');

const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({
    status: "success",
    message: "SoilGate API server",
    data: {
      "version_number": "v1.0.0"
    }
  })
});

router.get('/dash', passport.authenticate('jwt', {
  session: false
}), HomeController.Dashboard)

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/gates', gatesRoutes);
router.use('/devices', deviceRoutes);

router.use('/public', publicRoutes);

//********* API DOCUMENTATION **********
router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;