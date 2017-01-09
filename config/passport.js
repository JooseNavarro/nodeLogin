//load library for gestion local users
var LocalStrategy = require('passport-local').Strategy;

//load User model
var User = require('../app/models/user');


module.exports = function(passport){

	//serialize User
	passport.serializeUser(function(user,done){
		done(null, user.id);								
	});

	//deserializeUser
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err,user){
			done(err,user);
		});
	});

	//local signup, registro de nuevo usuario
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback: true
		}, function(req, email, password, done){
			//funcion asincrona
			process.nextTick(function() {
				//validar si existe el correo.
				User.findOne({'local.email': email}, function(err, user) {
					//depurar error
					if (err) return done(err);
					//comparar email
					if (user) return done(null,false, req.flash('signupMessage','Error, su direccion de correo ya se encuentra registrada'));
					else{
						var newUSer = new User();
						//set attributes
						newUSer.local.email = email;
						//cifrar y guardar password
						newUSer.local.password = newUSer.generateHash(password);
						newUSer.save(function(err) {
							if (err) throw err;
							return done(null, newUSer);
						});
					}
				});
			});
		})
	);

	//login
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback: true	
		}, function(req, email, password, done){
			//buscar usuario por email
			User.findOne({'local.email': email}, function(err,user) {
				//depurar error
				if (err) return done(err);
				//mensaje de usuario no encontrado
				if (!user) 
					return done(null, false, req.flash('loginMessage','No se encuentra registrado'));
				//contraseña incorrecta
				if (!user.validPassword(password)) 
					return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta'));
				//si todo salio bien
				return done(null, user);
			});
		})
	);
};