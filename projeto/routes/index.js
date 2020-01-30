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
			req.session.userid = response.data.id;
			req.session.save(err => {
				if (err) console.log("POST /login Erro no login do utilizador! " + JSON.stringify(err.response.data.info));
				console.log(req.session.redirectTo)
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
			res.redirect('/login')
		})
		.catch(erro => {
			console.log("POST /signup Erro no registo do utilizador! " + JSON.stringify(erro.response.data.info));
			req.flash('error', erro.response.data.info)
			res.redirect(301, '/signup');
		})
});

router.post('/facebooksignup', function (req, res) {
	var params = {
		username: req.body.username, password: req.body.password,
		name: req.body.name, email: req.body.email, role: 'user'
	}

	axios.post('http://localhost:3000/api/users/', params)
		.then(response => {
			res.redirect('/')
		})
		.catch(erro => {
			console.log("POST /singup Erro no registo do utilizador! " + JSON.stringify(erro.response.data.info));
			req.flash('error', erro.response.data.info)
			res.redirect(301, '/signup');
		})
});

router.post('/logout', function (req, res, next) {
	var parse_date = new Date().toISOString().split('.')[0].replace('T',',')
	var params = {
		username: req.session.username, tstamp: parse_date
	}
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

router.get('/feed', async (req,res,next)=>{
	var eventos =[]
	var publs
	var evals

	var feed

	await axios.get('http://localhost:3000/api/evento/',{ headers: { "Authorization": 'Bearer ' + req.session.token } })
			.then(events => eventos = events.data)
			.catch(erro => {
				if (erro.response.status) {console.log(erro.response.data) 
					return res.redirect('/login')}
				console.log('Erro na listagem dos utilizadores: ' + erro)
				res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
			})

	
	await axios.get('http://localhost:3000/api/pubs/',{ headers: { "Authorization": 'Bearer ' + req.session.token } })
			.then(pubs =>publs = pubs.data)
			.catch(erro => {
				if (erro.response.status) {console.log(erro.response.data) 
					return res.redirect('/login')}
				console.log('Erro na listagem dos utilizadores: ' + erro)
				res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
			})

			
	await axios.get('http://localhost:3000/api/evaluations/',{ headers: { "Authorization": 'Bearer ' + req.session.token } })
			.then(evaluation => evals = evaluation.data)
			.catch(erro => {
				if (erro.response.status) {console.log(erro.response.data) 
					return res.redirect('/login')}
				console.log('Erro na listagem dos utilizadores: ' + erro)
				res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
			})

//adicionar as tags 
	eventos.forEach(function (element) {
		element.tipotag = "evento";
		});
	publs.forEach(function (element) {
		element.tipotag = "pub";
		});
	evals.forEach(function (element) {
		element.tipotag = "eval";
		});

//ordenar o feed
	var feed =[...eventos,...publs,...evals]
	console.log(feed)
	feed.sort(function(a, b) {
		if(a.updatedAt > b.updatedAt) return -1
		if(a.updatedAt < b.updatedAt) return 1
		return 0;
	});
	
	console.log(feed)
	
	res.render('feed',{feed:feed})
		
})

module.exports = router;