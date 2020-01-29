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

router.post('/newevaluation', auth.checkBasicAuthentication, function(req, res) {
    var params = {
		tipo: req.body.tipo, uc: req.body.uc, data: req.body.data,
        local: req.body.local}
    Evaluation.inserir(params)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

module.exports = router;