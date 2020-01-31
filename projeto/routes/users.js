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

router.get('/:username', async (req, res) => {
	const authenticated = req.session.token;
	var username
	var publs
	var mp = false

	await axios.get('http://localhost:3000/api/users/' + req.params.username, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(user => {username = user.data
			console.log(user.data)})
		.catch(erro => {
			if (erro.response.status) return res.redirect('/login')
			console.log('Erro na listagem dos utilizadores: ' + erro)
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
		})
		await axios.get('http://localhost:3000/api/pubs/' + username._id, { headers: { "Authorization": 'Bearer ' + req.session.token } })
			.then(pubs =>{publs=pubs.data})
			.catch(erro => {
				if (erro.response.status) return res.redirect('/login')
				console.log('Erro na listagem dos utilizadores: ' + erro)
				res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
			})
			if(username._id == req.session.userid){
				var mp = true
			}
			publs.forEach(function (element) {
				element.usern = username.username
				 element.isimg = element.file.match(".*\\.(jpg|png|tif)$")
				 element.likeds = element.likes.length

				})


			res.render('profile', {authenticated: authenticated, user: username, myprofile: mp, pubs: publs})

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

router.post('/like/:id',async (req,res)=>{
	var params = {
		idpub : req.params.id,
		iduser : req.session.userid
	}
	var like
	await axios.post('http://localhost:3000/api/users/likexist', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(user => {like=user.data
			console.log(like)
		})
		.catch(erro => {
			if (erro.response.status) {console.log(erro.response.data) 
				return res.redirect('/login')}
			console.log('Erro na listagem dos utilizadores: ' + erro)
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
		})
		console.log(like.likes.indexOf(req.session.userid))
	if(like.likes.indexOf(req.session.userid)!=-1){
		await axios.post('http://localhost:3000/api/users/likeremove', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
			.then(user => {like=user.data
				res.redirect('http://localhost:3000/')
			})
			.catch(erro => {
				if (erro.response.status) {console.log(erro.response.data) 
					return res.redirect('/login')}
				console.log('Erro na listagem dos utilizadores: ' + erro)
				res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
			})
}else{
		await axios.post('http://localhost:3000/api/users/likeadd', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
			.then(user => {like=user.data
				res.redirect('http://localhost:3000')
			})
			.catch(erro => {
				if (erro.response.status) {console.log(erro.response.data) 
					return res.redirect('/login')}
				console.log('Erro na listagem dos utilizadores: ' + erro)
				res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
			})
}

})

router.post('/:username/editinfo', (req, res) => {	
	var params = {
		id: req.session.userid,
		username: req.body.username,
		name: req.body.name,
		email: req.body.email
	}
	var usern

	axios.get('http://localhost:3000/api/users/getuser/' + req.body.username, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(user => {usern= user.data
				console.log(usern)
				if(usern)
				{
					console.log("AHAHAHAHAHAHA")
					res.redirect('http://localhost:3000/users/'+req.params.username+'/editinfo')
				}else{
					axios.get('http://localhost:3000/api/users/getemail/' + req.body.email, { headers: { "Authorization": 'Bearer ' + req.session.token } })
						.then(user =>{useremail= user.data
						if(useremail){
							
							console.log("AHAHAHAHAHAHA")
							res.redirect('http://localhost:3000/users/'+req.params.username+'/editinfo')
						}else{
							axios.post('http://localhost:3000/api/users/' + req.body.username+'/editinfo',params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
								.then(user => {
									const authenticated = req.session.token || false;
									res.redirect('http://localhost:3000/login')
								})
								.catch(erro => {
									if (erro.response.status) {console.log(erro.response.data) 
										return res.redirect('/login')}
									console.log('Erro na listagem dos utilizadores: ' + erro)
									res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
								})
						}
						})
						.catch(erro => {
						if (erro.response.status) {console.log(erro.response.data) 
							return res.redirect('/login')}
						console.log('Erro na listagem dos utilizadores: ' + erro)
						res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
					})
				}
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