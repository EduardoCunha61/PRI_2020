var express = require('express');
var router = express.Router();
var axios = require('axios');
var multer = require('multer')
var fs = require("fs");


var upload = multer({dest:'./public/tmp'})

/* GET users listing. */
router.get('/', (req, res) => {
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
			var mp = false
			if(user.data.username == req.session.username){
				var mp = true
				console.log(mp)
			}
			console.log(mp)
			res.render('profile', {authenticated: authenticated, user: user.data, myprofile: mp})
			
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
router.post('/:username/uploadimage',upload.single('file'), (req, res) => {
	console.log(req.file.filename)
	var file = 'public/tmp/' + req.file.filename +'.png'
	var filepath = 'tmp/' + req.file.filename +'.png'
	var params = {file:filepath, username:req.session.username}
	console.log(file)

	fs.rename(req.file.path, file, function(err) {
		if (err) {
		  console.log(err);
		  res.send(500);
		} else {
			console.log(params)
			axios.post('http://localhost:3000/api/users/' + req.params.username + '/uploadimage',params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
				.then(user => {
					const authenticated = req.session.token || false;
					res.redirect('/users/'+req.params.username)
				})
				.catch(erro => {
					if (erro.response.status) {console.log(erro.response.data) 
						return res.redirect('/login')}
					console.log('Erro na listagem dos utilizadores: ' + erro)
					res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
				})
				}
	  })
});

module.exports = router;
