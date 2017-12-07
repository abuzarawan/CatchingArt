var restify = require('restify');

// Authentication
var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var sessions        = require("client-sessions");

var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.use(sessions({
    // cookie name dictates the key name added to the request object
    cookieName: 'session',
    // should be a large unguessable string
    secret: 'TkipIsTheBest',
    // how long the session will stay valid in ms
    duration: 5 * 86400 * 1000    // 5 days
}));

// Initialize passport
server.use(passport.initialize()); 
// Set up the passport session
server.use(passport.session());

// This is how a user gets serialized
passport.serializeUser(function(user, done) {
   console.log("in serilizers");
    done(null, user.id);
});

// This is how a user gets deserialized
passport.deserializeUser(function(id, done) {
    // Look the user up in the database and return the user object
    // For this demo, return a static user
    console.log("in deserializer");
    return done(null, {id:13370815, username:'john'});
});

// Lookup a user in our database
var lookupUser = function(username, password, done) {
    console.log("in look up");
    if(username === 'john' && password === 'johnspassword') {
        return done(null, {id:13370815, username:'john'});
    }    
    return done(null, false, { error: 'Incorrect username or password.' });
};

passport.use(new LocalStrategy({ usernameField: 'username', session: true }, lookupUser));





// POST /login
var loginRoute = function(req, res, next) {
			console.log("login");
    // The local login strategy
    passport.authenticate('local', function(err, user) {
        if (err) { return next(err); }

        // Technically, the user should exist at this point, but if not, check
        if(!user) {
            return next(new restify.InvalidCredentialsError("Please check your details and try again."));
        }

        // Log the user in!
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.session.user_id = req.user.id;
            console.log("login-req.login");
            if(user.username) { 
				res.json({ success: 'Welcome ' + user.username + "!"}); 
				return next();
            }            
            res.json({ success: 'Welcome!'});
            return next();
        });
    })(req, res, next);
};


// GET /hello
var helloRoute =function(req, res, next) {
	
	console.log(req["_passport"]);
	console.log(req['headers']);
	
    console.log(req.isAuthenticated());
    if(req.user) {
        res.send("Hello " + req.user.username);
    } else {
        res.send("Hello unauthenticated user");
    }

    return next();
};

server.post({url:'/login'}, loginRoute);
server.get({url:'/hello'}, helloRoute);

// Launch the server
server.listen(5000, function() {
    console.log('Server running at port 5000');
});