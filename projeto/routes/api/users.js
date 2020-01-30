var express = require('express');
const passport = require('passport')
const jwt = require('jsonwebtoken')
var router = express.Router()
var User = require('../../controllers/users')
var BlackList = require('../../controllers/blacklist')
var auth = require("../../authentication/aut")
const {validationResult} = require('express-validator')
var fs = require('fs')

// Get all users
router.get('/', auth.checkBasicAuthentication, (req, res) => {
    User.list()
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
});

//TODO: deixar apenas procurar por utilizadores ou produtores
// GET /api/users/:username
router.get('/:username', auth.checkBasicAuthentication, (req, res) => {
    User.getUserByUsername(req.params.username)
        .then(data => res.jsonp(data))
        .catch(err => res.status(500).send('Erro na consulta de utilizador: ' + err))
})


router.get('/id/:id', auth.checkAdminAuthentication, (req, res) => {
    User.getUserById(req.params.id)
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
});

router.post('/:username/editinfo', auth.checkBasicAuthentication, (req,res) =>{
    var self = this;
    // console.log(req.body.email) Check
    
    // console.log(req.body.username) Check
	User.getUser(req.body.email, (err, results) => {
        console.log(err)
        console.log("asdasd")
        console.log(results)
		if (err) next(err);
		else if (results) {
            console.log("AHAHAHAHAHAHA")
			self.invalidate("email", "E-mail já registado");
			return next(new Error("E-mail já registado"));
		}
	});
	User.getUserByUsername(req.body.username, (err, results) => {
        console.log(err)
        console.log("asdasd")
        console.log(results)
        if (err) next(err);
		else if (results) {
            console.log("FODA SE")
			self.invalidate("email", "Username já existe");
			return next(new Error("Username já existe"));
		}
    });
    
    User.editinfo(req.body.id,req.body.name,req.body.username,req.body.email)
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na alteracao de informacao: ' + errors))    
})

//Ver isto
router.post('/:username/uploadimage', auth.checkBasicAuthentication, (req, res) => {
    console.log(req.params.username)
    User.editinformation(req.params.username,req.body.file)
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
})

// SignUp
router.post('/', User.validate('createUser'), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        const error = new Error("Registo do utilizador: Parametros inválidos")
        error.infos = "" + errors.array().map(i => `${i.msg}`).join(' ');
        return res.status(500).send(error)
    }
    passport.authenticate('signup', { session : false}, (err, user, info) => {
        if (err | !user) {
            const error = new Error('Erro no registo do utilizador')
            error.infos = "" + err
            return res.status(500).send(error)
        }
        res.jsonp("Utilizador registado com sucesso")
    })(req, res, next)

});

// LogIn
router.post('/login', (req, res, next) => {
    console.log("email:" + req.body.email + " pass: " + req.body.password + " ultimo acesso: " + req.body.ultimoacesso)
    passport.authenticate('login', (err, user) => {     
        try {
            if(err || !user){
                console.log("login error: " + err)
                const error = new Error('An Error occured')
                error.info = "cannot find user" + err
                return next(error);
            }
            req.login(user, { session : false }, (error) => {
                console.log('passou o autenticate')
                if( error ) return next(error)

                var myuser = { id : user._id, email : user.email};
                // Geração do token                
                var token = jwt.sign({ user : myuser },'secretpri', { expiresIn: '30m' });        
                return res.jsonp({username: user.username, token: token, id: user._id})                
            });     
        } 
        catch (err) {
            console.log("Erro: ", err)
            const error = new Error('An Error occured')
                error.info = "" + err
                return next(error);
        }
    })(req, res, next);
});

// LogOut
router.post('/logout',async(req, res, next) => {
    auth.isLoggedIn(req, res, (loggedin)=> {
        User.updatelastsession(req.body.username,req.body.tstamp)
            .then(data =>{
                BlackList.addToken({token: req.headers.authorization});
                req.logout();
            })
            .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
        res.jsonp("Logout efetuado com sucesso!")
    })
});

module.exports = router;