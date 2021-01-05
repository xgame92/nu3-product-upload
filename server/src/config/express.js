const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const routes = require('../api/routes/v1');
const error = require('../api/middlewares/error');
const cookieSession = require('cookie-session')
const User = require('../api/models/user.model');
const APIError = require('../api/utils/APIError');
const httpStatus = require('http-status');
const {clientURL, githubCallbackURL, githubClientID,githubClientSecret} = require('./../config/vars');
const GitHubStrategy = require('passport-github2').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GitHubStrategy({
        clientID: githubClientID,
        clientSecret: githubClientSecret,
        callbackURL: githubCallbackURL
    },
    function (accessToken, refreshToken, user, done) {

        const userObject = {
            id: user.id,
            userName: user.username || "",
            name: user.displayName,
            services: {
                github: user.provider
            },
            picture: user._json.avatar_url,
        };

        User.updateOne({id: userObject.id}, userObject, {upsert: true, setDefaultsOnInsert: true}).exec();

        return done(null, userObject);
    }
));


/**
 * Express instance
 * @public
 */
const app = express();

app.use(cookieSession({
    name: 'github-auth-session',
    keys: ['key1', 'key2'],
    httpOnly: false,
    cookie: {maxAge: 60000},
    saveUninitialized: true,
    resave: true,
}))

app.use(passport.initialize());

app.use(passport.session());

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
const corsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback) => {
        return callback(null, true)
    }
}
app.use(cors(corsOptions));

// enable authentication
function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
        return next()
    }
    throw new APIError({
        message: 'UNAUTHORIZED',
        status: httpStatus.UNAUTHORIZED,
    })
}

// auth
app.use('/v1', ensureAuthenticated, routes);

app.get('/auth/github', passport.authenticate('github', {scope: ['user']}));

app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/auth/error'}),
    function (req, res) {
        res.redirect('/auth/success');
    });

app.get('/auth/success', (req, res) => {
    res.redirect(`${clientURL}/upload`);
})

app.get('/auth/error', (req, res) => res.redirect(`${clientURL}`))

app.get("/isAuthenticated", ensureAuthenticated, (req, res) => {
    res.status(httpStatus.OK);
    res.send();
})

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
