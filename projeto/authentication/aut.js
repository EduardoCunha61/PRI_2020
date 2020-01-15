var passport = require('passport')
var localStrategy = require('passport-local').Strategy
var UserModel = require('../models/users')
var BlackList = require('../controllers/blacklist')
// Verificação do token
var JWTstrategy = require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')



// Registo de utilizadores
passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
}, async (req, username, password, done) => {   

    var newUser = {
        "username": req.body.username,
        "password": req.body.password, 
        "name": req.body.name,
        "email": req.body.email,
        "role": req.body.role,           
    };
    try{
        user = await UserModel.create(newUser)
        return done(null, user)
    }
    catch(erro){
        return done(erro)
    }
}))

// Login de utilizadores
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try{
        user = await UserModel.findOne({email})
        if(!user) return done(null, false, {message: 'Utilizador não encontrado!'})

        var valida = await user.isValidPassword(password)
        if(!valida) return done(null, false, {message: 'Password inválida!'})

        return done(null, user, {message: 'Utilizador autenticado!'})
    }
    catch(erro){
        return done(erro)
    }
}))

passport.use('jwt', new JWTstrategy({
    secretOrKey: 'iBandaSecret2',
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {        
    if (token == null) {
        console.log("Erro de autenticação: Token inválido")
        return done("Erro de autenticação: Token inválido")
    } 
    user = await UserModel.findById(token.user.id)
    if(!user) return done(null, false, {message: 'Utilizador não encontrado!'})
    return done(null, user)
}))

module.exports.checkBasicAuthentication = (req, res, next) => {
    passport.authenticate('jwt', { session : false}, 
        async function(err, user, info) {
            const error = new Error("Registo do utilizador: Parametros inválidos")
            if (err) { 
                error.info = "" + err;
                return res.status(401).jsonp(error); 
            };
            if (!user) { 
                error.info = "O utilizador não existe"
                return res.status(401).jsonp(error) 
            };

            var blacklist_token = await BlackList.getToken(req.headers.authorization)
            if (blacklist_token) {
                error.info = "O token pertence à blacklist"
                return res.status(401).jsonp(error)// eturn res.redirect('/login');
            }

            next()   
    })(req, res, next)
}
 
module.exports.checkAdminAuthentication = (req, res, next) => {
    console.log("token: " + JSON.stringify(req.headers.authorization))
    passport.authenticate('jwt', { session : false}, 
        async function(err, user, info) {
            const error = new Error("Registo do utilizador: Parametros inválidos")
            if (err) { 
                error.info = "" + err;
                return res.status(401).jsonp(error); 
            };
            if (!user) { 
                error.info = "O utilizador não existe"
                return res.status(401).jsonp(error) 
            };

            if (user.role !== "admin") {
                error.info = "Não tem permissões para aceder a estas routes"
                return res.status(401).jsonp(error) 
            }

            var blacklist_token = await BlackList.getToken(req.headers.authorization)
            if (blacklist_token) {
                error.info = "O token pertence à blacklist"
                return res.status(401).jsonp(error)// eturn res.redirect('/login');
            }

            next()   
    })(req, res, next)
}
 

module.exports.isLoggedIn = (req, res, next) => {
    passport.authenticate('jwt', { session : false}, 
        function(err, user) {
            console.log("isLoggedIn: " + user)
            if (err) { res.status(401).json(err); };
            if (!user) { return next(false) };
            return next(true)
    })(req, res, next)
}