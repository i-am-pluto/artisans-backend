const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connectDB = require("./db");
const User = require("../Models/user/User");
const { validPassword } = require("../Services/UserService");

passport.use(
    new LocalStrategy(async(username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false);
            }
            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) return done(null, user);
            else {
                return done(null, false);
            }
        } catch (error) {
            console.log(error);
            return;
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(userId, done) => {
    try {
        const user = await User.findById(userId);
        done(null, user);
    } catch (error) {
        done(error);
    }
});