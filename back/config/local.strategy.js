const passport = require('passport');
const { Strategy } = require('passport-local');


module.exports = function localStrategy() {
    passport.use(new Strategy(
        {
            usernameField: 'username',
            emailField: 'email',
            passwordField: 'password'
        }, ( username, email, password, done ) => {
            const user = {
                username, email, password
            };
            done(null, user);
        }
    ));
};

