var express = require('express');
var router = express.Router();
var axios = require('axios')
var users = require('../controllers/users')

/* GET home page. */
router.get('/', function (req, res) {	
	const authenticated = req.session.token || false;
	const username = req.session.username || false;
	if (req.session) {
		res.render('index',{authenticated: authenticated, username: username});
    } else {
        res.render('signup')
    }
	
});

router.get('/login', function (req, res) {	
	res.render('login', { expressFlash: req.flash('error'), sessionFlash: res.locals.sessionFlash });	
});

router.post('/login', function (req, res) {
	var params = {
		email: req.body.email, password: req.body.password	
	}
	axios.post('http://localhost:3000/api/users/login', params)
		.then(response => {						
			req.session.token = response.data.token;
			req.session.username = response.data.username;
			req.session.save(err => {
				if (err) console.log("POST /login Erro no login do utilizador! " + JSON.stringify(err.response.data.info));
				var redirectTo = req.session.redirectTo || '/';
				delete req.session.redirectTo;			
				res.redirect(redirectTo);
			})
				    
		})
		.catch(erro => {
			console.log("POST /login Erro no login do utilizador! " + JSON.stringify(erro.response.data.info));
			req.flash('error', erro.response.data.info)
			res.redirect(301, '/login');
		})
});

router.get('/signup', function (req, res) {	
	res.render('signup');
});

router.post('/signup', function (req, res) {
	var params = {
		username: req.body.username, password: req.body.password,
		name: req.body.name, email: req.body.email, role: 'user'
	}

	axios.post('http://localhost:3000/api/users/', params)
		.then(response => {
			res.redirect('/index')
		})
		.catch(erro => {
			console.log("POST /singup Erro no registo do utilizador! " + JSON.stringify(erro.response.data.info));
			req.flash('error', erro.response.data.info)
			res.redirect(301, '/signup');
		})
});

router.get('/logout', function (req, res, next) {
	var params
	axios.post('http://localhost:3000/api/users/logout', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(tag => {
			delete req.session.email
			res.redirect('/login');	
		})
		.catch(erro => {
			console.log("POST /logout Erro no logout do utilizador! " + JSON.stringify(erro.response.data.info));
			req.flash('error', erro.response.data.info)
			res.redirect(301, '/logout');
		})
});

module.exports = router;