var express = require('express');
var router = express.Router();
var axios = require('axios')
var auth = require("../authentication/aut")

const fileUpload = require('express-fileupload');

var fs = require("fs");

router.use(fileUpload());

router.get('/', function(req, res) {
    axios.get('http://localhost:3000/api/pubs', { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(pubs => res.render('events', {pubs: pubs.data, authenticated:req.session.token}))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na listagem de eventos: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })
});

router.post('/', function(req, res) {
    var filepath=""
    if(req.files){
    req.files.sampleFile.mv('public/tmp/'+req.session.userid + req.files.sampleFile.name, function(err) {
        if (err)
            return res.status(500).send(err);
    
        });
        filepath = 'public/tmp/'+req.session.userid + req.files.sampleFile.name
    }

    var params = {data: new Date().toISOString().split('.')[0].replace('T',','), description:req.body.description, username: req.session.username, file:filepath}
    axios.post('http://localhost:3000/api/pubs', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(pubs => res.render('pubs', {pubs: pubs.data, authenticated:req.session.token}))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na listagem de eventos: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })
});

router.post('/profile', function(req, res) {
    
    var filepath=""
    if(req.files){
    req.files.sampleFile.mv('public/tmp/'+req.session.userid + req.files.sampleFile.name, function(err) {
        if (err)
            return res.status(500).send(err);
    
        });
        filepath ='tmp/'+req.session.userid + req.files.sampleFile.name
    }
    console.log(filepath)
    var params = {data: new Date().toISOString().split('.')[0].replace('T',','), description:req.body.description, username: req.session.username, file:filepath}
    axios.post('http://localhost:3000/api/pubs', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(pubs => res.redirect('http://localhost:3000/users/'+ req.session.username))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na listagem de eventos: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })
});

module.exports = router;