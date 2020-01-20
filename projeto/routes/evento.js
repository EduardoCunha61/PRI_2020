var express = require('express');
var router = express.Router();
var axios = require('axios')

router.get('/', function(req, res) {
    console.log("eventos")
    req.session.redirectTo = "/eventos";	
    axios.get('http://localhost:3000/api/evento', { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(eventos => res.render('events', {eventos: eventos.data}))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na listagem de eventos: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })
});

router.get('/criarEvento', function(req, res) {
    res.render('createEvento');
});


router.get('/:id', function(req, res) {
    axios.get('http://localhost:3000/api/eventos/' + req.params.id, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(evento => res.render('evento', {evento: evento.data}))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na consulta do evento: ' + erro)
            res.render('error', {error: erro, message: "Meu erro..."})
        })
});

router.post('/', function(req, res) {
    var params = {
		data: req.body.data, hinicio: req.body.hinicio, hfim: req.body.hfim,
        tipo: req.body.tipo, titulo: req.body.titulo, local: req.body.local,
        description: req.body.description}
        console.log(params)
    axios.post('http://localhost:3000/api/eventos', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(()=> res.redirect('http://localhost:3000/eventos'))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na inserção do evento: ' + erro)
            res.render('error', {error: erro, message: "Meu erro ins..."})
        })
});

module.exports = router;