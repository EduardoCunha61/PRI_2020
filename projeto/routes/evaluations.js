var express = require('express');
var auth = require("../authentication/aut")
var router = express.Router();
var axios = require('axios');


const fileUpload = require('express-fileupload');

var fs = require("fs");

router.use(fileUpload());


router.get('/', (req, res) => {
	req.session.redirectTo = "/evaluations";
	axios.get('http://localhost:3000/api/evaluations', { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(evals => {
            console.log(evals.data)
			const authenticated = req.session.token || false;
			res.render('evaluations', {authenticated: authenticated, evaluations: evals.data })
			delete req.session.redirectTo
		})
		.catch(erro => {
			if (erro.response.status == 401) return res.redirect('/login')			
			console.log('Erro na listagem das avaliacoes: ' + erro)
			res.render('error', { error: erro, message: "Erro na listagem das avaliacoes!" })
		})

});

router.get('/exportevals',(req,res)=>{
    var publs
    axios.get('http://localhost:3000/api/evaluations', { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(eval => {evals=eval.data
        
            let data = JSON.stringify(evals)
            var path = '/tmp/evaluations.json'
            fs.writeFileSync('public/'+path, data)

            res.render('index', {evals: evals.data,pathpubs:path, authenticated:req.session.token})})
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na listagem de eventos: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })



    
})

router.post('/importevals',(req,res)=>{
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
        axios.post('http://localhost:3000/api/evalutions/import',params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
            .then(pubs => {

                res.redirect('http://localhost:3000/')})
            .catch(erro => {
                if (erro.response.status){console.log(erro.response.data) 
                    return res.redirect('/login')}
                console.log('Erro na listagem de eventos: ' + erro)
                res.render('error', {error: erro, message: "na listagem..."})
            })


	});
});
    
router.get('/newevaluation',function(req, res) {
    const authenticated = req.session.token
    res.render('createEvaluation',{authenticated: authenticated});
});

router.get('/:id', function(req, res) {
	var username = req.session.username
    axios.get('http://localhost:3000/api/evaluations/' + req.params.id, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(eval =>{console.log(JSON.stringify(eval.data.updatedAt))
             res.render('eval', {eval: eval.data,authenticated:req.session.token,usera:username})})
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na consulta do evento: ' + erro)
            res.render('error', {error: erro, message: "Meu erro..."})
        })
});

router.get('/tipo/:tipo', function(req, res) {
    axios.get('http://localhost:3000/api/evaluations/tipo/' + req.params.tipo, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(evals => res.render('evaluations', {evaluations: evals.data, authenticated:req.session.token}))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na consulta do evento: ' + erro)
            res.render('error', {error: erro, message: "Meu erro..."})
        })
});

router.post('/newevaluation', function(req, res) {
	var filepath=""
	if(req.files){
	req.files.sampleFile.mv('public/tmp/'+req.session.userid + req.files.sampleFile.name, function(err) {
		if (err)
			return res.status(500).send(err);
	
		});
		filepath = '/tmp/'+req.session.userid + req.files.sampleFile.name
	}
    var params = {
		tipo: req.body.tipo, uc: req.body.uc, data: req.body.data, hinicio: req.body.hinicio, hfim: req.body.hfim,
        local: req.body.local, file: filepath,user:req.session.userid}

    axios.post('http://localhost:3000/api/evaluations/newevaluation', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(()=> res.redirect('http://localhost:3000/evaluations'))
        .catch(erro => {
			if (erro.response.status){ console.log(erro.response.data) 
				return res.redirect('/login')}
            console.log('Erro na inserção da avaliação: ' + erro)
            res.render('error', {error: erro, message: "Meu erro ins..."})
        })

    });

    router.post('/participar/:id', function(req, res){  
            var params = {id: req.params.id, username: req.session.username}
            axios.post('http://localhost:3000/api/evaluations/participar',params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
                .then(()=> res.redirect('http://localhost:3000/evaluations'))
                .catch(erro => {
                    if (erro.response.status){console.log(erro.response.ldata) 
                        return res.redirect('/login')}
                    console.log('Erro na inserção da avaliação: ' + erro)
                    res.render('error', {error: erro, message: "Meu erro ins..."})
                })
        })

module.exports = router;