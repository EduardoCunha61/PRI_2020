var express = require('express');
var router = express.Router();
var axios = require('axios')
var auth = require("../authentication/aut")
var multer = require('multer')
const fileUpload = require('express-fileupload');

var fs = require("fs");

router.use(fileUpload());


router.get('/', function(req, res) {
    req.session.redirectTo = "/events";	
    axios.get('http://localhost:3000/api/evento', { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(eventos => { res.render('events', {eventos: eventos.data,authenticated:req.session.token})})
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na listagem de eventos: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })
});

router.get('/criarEvento',function(req, res) {
    const authenticated = req.session.token
    res.render('createEvento',{authenticated: authenticated});
});




router.get('/export/exportevents',(req,res)=>{
    var publs
    axios.get('http://localhost:3000/api/evento', { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(pubs => {events=pubs.data
        
            let data = JSON.stringify(events)
            var path = '/tmp/events.json'
            fs.writeFileSync('public/'+path, data)

            res.render('index', {pubs: pubs.data,pathpubs:path, authenticated:req.session.token})})
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na listagem de eventos: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })



    
})


router.get('/:id', function(req, res) {
    var isimg
    axios.get('http://localhost:3000/api/evento/' + req.params.id, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(evento =>{
            if( evento.data.file){
                isimg = evento.data.file.match(".*\\.(jpg|png|tif)$")
                res.render('evento', {evento: evento.data,authenticated:req.session.token,isimg:isimg})
            }else{
            res.render('evento', {evento: evento.data,authenticated:req.session.token,isimg:null})}
        })
        .catch(erro => {
            if (erro.response.status) {
                console.log(erro.response.data)
                return res.redirect('/login')}
            console.log('Erro na consulta do evento: ' + erro)
            res.render('error', {error: erro, message: "Meu erro..."})
        })
});
router.post('/importevents',(req,res)=>{
    var filepath=""
    var pubs
    if(req.files){
    req.files.sampleFile.mv('public/tmp/'+req.files.sampleFile.name, function(err) {
        if (err)
            return res.status(500).send(err);
    
        });
        filepath ='tmp/'+req.session.userid + req.files.sampleFile.name
    }
    fs.readFile('public/tmp/'+req.files.sampleFile.name, (err, data) => {
        if (err) throw err;
        let pubs = JSON.parse(data);
        var params = pubs
        axios.post('http://localhost:3000/api/evento/import',params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
            .then(pubs => {

                res.redirect('http://localhost:3000/')})
            .catch(erro => {
                if (erro.response.status){console.log(erro.response.data) 
                    return res.redirect('/login')}
                console.log('Erro na listagem de eventos: ' + erro)
                res.render('error', {error: erro, message: "na listagem..."})
            })


    });
    


})



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

router.post('/', function(req, res) {

        var filepath=""
        if(req.files){
        req.files.sampleFile.mv('public/tmp/'+req.session.userid + req.files.sampleFile.name, function(err) {
            if (err)
                return res.status(500).send(err);
        
            });
            filepath = '/tmp/'+req.session.userid + req.files.sampleFile.name
        }

    

    var params = {
		data: req.body.data, hinicio: req.body.hinicio, hfim: req.body.hfim,
        tipo: req.body.tipo, titulo: req.body.titulo, local: req.body.local,
        description: req.body.description,file:filepath,user:req.session.userid}
        console.log(params)
       
            axios.post('http://localhost:3000/api/evento', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
                .then(()=> res.redirect('http://localhost:3000/events'))
                .catch(erro => {
                    if (erro.response.status){ 
                        console.log(erro.response.data)
                        return res.redirect('/login')}
                    console.log('Erro na inserção do evento: ' + erro)
                    res.render('error', {error: erro, message: "Meu erro ins..."})
                })
});



module.exports = router;