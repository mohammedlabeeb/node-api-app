const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').User;

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;
    console.log("Before passport");
    passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
        let err, user;
        console.log("In passport", jwt_payload);
        [err, user] = await to(User.findById(jwt_payload.userID));

        if (err) return done(err, false);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }));
}