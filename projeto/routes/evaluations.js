var express = require('express');
var auth = require("../authentication/aut")
var router = express.Router();
var axios = require('axios');

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

router.get('/newevaluation',function(req, res) {
    const authenticated = req.session.token
    res.render('createEvaluation',{authenticated: authenticated});
});

router.post('/newevaluation', function(req, res) {
    var params = {
		tipo: req.body.tipo, uc: req.body.uc, data: req.body.data, hinicio: req.body.hinicio, hfim: req.body.hfim,
        local: req.body.local, file: req.body.file}

    axios.post('http://localhost:3000/api/evaluations/newevaluation', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
        .then(()=> res.redirect('http://localhost:3000/evaluations'))
        .catch(erro => {
            if (erro.response.status) return res.redirect('/login')
            console.log('Erro na inserção da avaliação: ' + erro)
            res.render('error', {error: erro, message: "Meu erro ins..."})
        })
});

module.exports = router;