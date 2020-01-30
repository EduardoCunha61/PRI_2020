var express = require('express');
var router = express.Router();
var Pub = require('../../controllers/pubs')
var auth = require("../../authentication/aut")

router.get('/', auth.checkBasicAuthentication, function(req, res) {
    Pub.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/:username', auth.checkBasicAuthentication, function(req, res) {
    Pub.pubsbyUser(req.params.username)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});


router.post('/', auth.checkBasicAuthentication, function(req, res) {
    var params = {
        data: req.body.data,
        description: req.body.description,
        file:req.body.file,
        user: req.body.username}
    
    Pub.inserir(params)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

module.exports = router;