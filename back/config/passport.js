const passport = require('passport');
require('../config/local.strategy');

module.exports = function passportConfig() {
    app.use(passport.initialize());
    app.use(passport.session())

    // stores user in session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // retrieves user from session
    passport.deserializeUser((userId, done) => {
        //find user by id
        done(null, user);
    });

  
}