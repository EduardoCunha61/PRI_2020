var express = require('express');
var router = express.Router();
var Evento = require('../../controllers/events')
var Pub = require('../../controllers/pubs')
var Evaluation = require('../../controllers/evaluations')

var auth = require("../../authentication/aut")

router.get('/', auth.checkBasicAuthentication, function(req, res) {
    Evento.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});
