var express = require('express');
var router = express.Router();
var axios = require('axios')
var auth = require("../authentication/aut")
var multer = require('multer')
var fs = require("fs");


var upload = multer({dest:'./public/tmp'})




router.get('/', function(req, res) {
    console.log("eventos")
    req.session.redirectTo = "/events";	
    axios.get('http://localhost:3000/api/evento', { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(eventos => res.render('events', {eventos: eventos.data,authenticated:req.session.token}))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na listagem de eventos: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })
});

router.get('/criarEvento',function(req, res) {
     res.render('createEvento', {authenticated:req.session.token})
});


router.get('/:id', function(req, res) {
    axios.get('http://localhost:3000/api/evento/' + req.params.id, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(evento => res.render('evento', {evento: evento.data,authenticated:req.session.token}))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na consulta do evento: ' + erro)
            res.render('error', {error: erro, message: "Meu erro..."})
        })
});

router.get('/tipo/:tipo', function(req, res) {
    axios.get('http://localhost:3000/api/evento/tipo/' + req.params.tipo, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(eventos => res.render('events', {eventos: eventos.data,authenticated:req.session.token}))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na consulta do evento: ' + erro)
            res.render('error', {error: erro, message: "Meu erro..."})
        })
});

router.post('/participar/:id', function(req, res){  
    var params = {id: req.params.id, username: req.session.username}
    axios.post('http://localhost:3000/api/evento/participar',params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(()=> res.redirect('http://localhost:3000/events'))
        .catch(erro => {
            if (erro.response.status){console.log(erro.response.ldata) 
                return res.redirect('/login')}
            console.log('Erro na inserção do evento: ' + erro)
            res.render('error', {error: erro, message: "Meu erro ins..."})
        })
})

router.post('/',upload.single('file'), function(req, res) {
    var file = 'public/tmp/' + req.file.filename
    var filepath = 'tmp/' + req.file.filename
    var params = {
		data: req.body.data, hinicio: req.body.hinicio, hfim: req.body.hfim,
        tipo: req.body.tipo, titulo: req.body.titulo, local: req.body.local,
        description: req.body.description,file:filepath}
        console.log(params)
       

	fs.rename(req.file.path, file, function(err) {
		if (err) {
		  console.log(err);
		  res.send(500);
		} else {
            axios.post('http://localhost:3000/api/evento', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
                .then(()=> res.redirect('http://localhost:3000/events'))
                .catch(erro => {
                    if (erro.response.status) return res.redirect('/login')
                    console.log('Erro na inserção do evento: ' + erro)
                    res.render('error', {error: erro, message: "Meu erro ins..."})
                })
            
            }
    })
});

module.exports = router;