//routes
module.exports = function (app, passport) {
	//index
	app.get('/', function(req, res) {
		res.render('../app/views/PlatformUser/index.ejs');
	});

	//Login form
	app.get('/login', function(req, res){
		res.render('../app/views/PlatformUser/login.ejs', {message: req.flash('loginMessage')});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', //redireccion luego que el usuario se loggea
		failureRedirect: '/login', //login de nuevo si falla el inicio de sesion
		failureFlash: true //activar mensajes
	}));

	//registro
	app.get('/signup', function(req,res){
		res.render('../app/views/PlatformUser/signup.ejs', {message: req.flash('signupMessage')});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile.ejs',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	//panel usuario
	app.get('/profile', isLoggedIn, function(req,res){
		res.render('../app/views/PlatformUser/profile.ejs', {user: req.user});
	});

	//logout
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	//404

	app.use(function (req, res, next) {
		res.status(404);
		if (req.accepts('html')) {
			res.render('../app/views/404/index.ejs');
		}
	});
};

//funcion para validar si el usuario ha iniciado sesion o no
function isLoggedIn(req,res,next) {
	//si es un usuario autenticado, continua todo normal
	if (req.isAuthenticated()) return next();
 
	res.redirect('/');
}