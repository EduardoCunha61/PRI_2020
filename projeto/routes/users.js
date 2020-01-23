var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */
router.get('/', (req, res) => {
	console.log("req.body = ", JSON.stringify(req.headers))
	req.session.redirectTo = "/users";
	axios.get('http://localhost:3000/api/users', { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(users => {
			const authenticated = req.session.token || false;
			res.render('users', {authenticated: authenticated, users: users.data })
			delete req.session.redirectTo
		})
		.catch(erro => {
			if (erro.response.status == 401) return res.redirect('/login')			
			console.log('Erro na listagem dos utilizadores: ' + erro)
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
		})

});

router.get('/:username', (req, res) => {	
	axios.get('http://localhost:3000/api/users/' + req.params.username, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(user => {
			const authenticated = req.session.token;
			res.render('profile', {authenticated: authenticated, user: user.data})
		})
		.catch(erro => {
			if (erro.response.status) return res.redirect('/login')
			console.log('Erro na listagem dos utilizadores: ' + erro)
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
		})
});

router.get('/:username/editinfo', (req,res) =>{
	axios.get('http://localhost:3000/api/users/' + req.params.username, { headers: { "Authorization": 'Bearer ' + req.session.token } })
	.then(user => {
		const authenticated = req.session.token || false;
		res.render('editinfo', {authenticated: authenticated, user: user.data})
	})
	.catch(erro => {
		if (erro.response.status) return res.redirect('/login')
		console.log('Erro na listagem dos utilizadores: ' + erro)
		res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
	})
});

router.post('/:username/editinfo', (req, res) => {	
	var params = {
		id: req.session.username,
		name: req.body.name,
		username: req.body.username,
		email: req.body.email
	}

	axios.post('http://localhost:3000/api/users/' + req.params.username + '/editinfo', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(user => {
			console.log("Success!")
			res.redirect('http://localhost:3000/users/' + req.body.username)
		})
		.catch(erro => {
			if (erro.response.status) {console.log(erro.response.data) 
				return res.redirect('/login')}
			console.log('Erro na listagem dos utilizadores: ' + erro)
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
		})
});

//Ver isto
router.post('/:username/uploadimage', (req, res) => {	
	console.log(req.params.username)
	axios.post('http://localhost:3000/api/users/' + req.params.username + '/uploadimage', { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(user => {
			const authenticated = req.session.token || false;
			res.render('profile', {authenticated: authenticated, user: user.data})
		})
		.catch(erro => {
			if (erro.response.status) {console.log(erro.response.data) 
				return res.redirect('/login')}
			console.log('Erro na listagem dos utilizadores: ' + erro)
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
		})
});

module.exports = router;
