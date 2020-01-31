var express = require('express');
const passport = require('passport')
const jwt = require('jsonwebtoken')
var router = express.Router()
var User = require('../../controllers/users')
var auth = require("../../authentication/aut")
var Evaluation = require('../../controllers/evaluations')
const {validationResult} = require('express-validator')
var fs = require('fs')

router.get('/', auth.checkBasicAuthentication, function(req, res) {
    Evaluation.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/:id', auth.checkBasicAuthentication, function(req, res) {
    Evaluation.consultar(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta: ' + erro))
});

router.get('/tipo/:t', auth.checkBasicAuthentication, function(req, res) {
    Evaluation.listarTipo(req.params.t)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.post('/newevaluation', auth.checkBasicAuthentication, function(req, res) {
    var params = {
		tipo: req.body.tipo, uc: req.body.uc, data: req.body.data,
        local: req.body.local,hinicio:req.body.hinicio,hfim:req.body.hfim,file:req.body.file, user:req.body.user}
    Evaluation.inserir(params)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.post('/import', auth.checkBasicAuthentication, function(req, res) {
    var params = req.body
    console.log(params)
    Evaluation.save(params)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});
router.post('/participar', auth.checkBasicAuthentication, function(req, res) {
    Evaluation.participar(req.body.id, req.body.username)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});


module.exports = router;