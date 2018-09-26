var util = require('util');

module.exports = function (app) {

	app.get('/', function (req, res, next) {
        if (!req.session && !req.session.authenticated) {
            res.redirect('/login');
            return;
        }
        res.render('index', {username: req.session.authenticated});
	}); 

	app.get('/login', function (req, res, next) {
        if (req.session && req.session.authenticated) {
            res.redirect('/');
            return;
        }
        res.render( 'login', { flashErr: req.flash('error') });
    });

    app.get('/logout', function (req, res, next) {
        delete req.session.authenticated;
        res.redirect('/');
	});

	app.post('/login', function (req, res, next) {
        console.log(req.body);
		// you might like to do a database look-up or something more scalable here
		if (req.body.username && req.body.username === 'user' && req.body.password && req.body.password === 'pass') {
            req.session.authenticated = req.body.username;
            
            

            res.redirect('/');
            console.log("Login correct");
		} else {
			req.flash('error', 'Username and password are incorrect');
            res.redirect('/login');
            console.log("Login incorrect");
		}

	});

	app.get('/logout', function (req, res, next) {
		delete req.session.authenticated;
		res.redirect('/');
	});

};