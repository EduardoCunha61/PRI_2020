var express = require('express');
var router = express.Router();
var Evento = require('../../controllers/events')
var auth = require("../../authentication/aut")

router.get('/', auth.checkBasicAuthentication, function(req, res) {
    Evento.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/:id', auth.checkBasicAuthentication, function(req, res) {
    Evento.consultar(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta: ' + erro))
});

router.get('/tipo/:t', auth.checkBasicAuthentication, function(req, res) {
    Evento.listarTipo(req.params.t)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/data/:d', auth.checkBasicAuthentication, function(req, res) {
    Evento.listarData(req.params.d)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/criarEvento', auth.checkBasicAuthentication, function(req, res) {
    var params = {description: req.body.description}
    Evento.inserir(params)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
    });

router.get('/dataEx/:d', auth.checkBasicAuthentication, function(req, res) {
    Evento.listarDataExact(req.params.d)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.post('/', auth.checkBasicAuthentication, function(req, res) {
    var params = {
		data: req.body.data, hinicio: req.body.hinicio, hfim: req.body.hfim,
        tipo: req.body.tipo, titulo: req.body.titulo, local: req.body.local,
        description: req.body.description,file:req.body.file, user:req.body.user}
    Evento.inserir(params)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.post('/participar', auth.checkBasicAuthentication, function(req, res) {
    Evento.participar(req.body.id, req.body.username)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});
router.post('/import', auth.checkBasicAuthentication, function(req, res) {
    var params = req.body
    console.log(params)
    Evento.save(params)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

module.exports = router;