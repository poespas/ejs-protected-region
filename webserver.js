const express = require('express')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('express-flash');

const app = express();

app.use(express.static("./web/static"))


function checkAuth (req, res, next) {
	console.log('checkAuth ' + req.url);

	// don't serve /secure to those not logged in
	// you should add to this list, for each and every secure url
	if (req.url !== '/login' && !req.url.endsWith("css") && !req.url.endsWith("js") && !req.url.endsWith("png") && (!req.session || !req.session.authenticated)) {
		console.log("403");
		res.redirect('/login');
		return;
	}

	next();
}



app.use(cookieParser());
app.use(session({
    secret: "eeeeee",
    name: "aaaaaaa",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded());
app.use(flash());

app.use(checkAuth);

require('./routes')(app);
app.set('view engine', 'ejs');
app.set('views', './web/views');

app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

module.exports.startServer = startServer = function(port) {
    console.log('Starting webserver at 127.0.0.1:' + port);
    app.listen(port)
};