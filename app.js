var express              =require("express");
var app                  =express();
var mongoose             =require("mongoose");
var passport             =require("passport");
var bodyParser           =require("body-parser");
var LocalStrategy        =require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var User                 =require("./models/user");
mongoose.connect("mongodb://localhost/auth_demo",{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
	secret:"Ebin is the bravest man known alive",
	resave:false,
	saveUninitialized:false


}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes===================

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err)
			console.log(err);
		else
		{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/secret");

			});
		}
	});
});

app.get("/",function(req,res){
	res.redirect("home");

});

app.get("/home",function(req,res){
	res.render("home");
});

app.get("/secret",Isloggedin,function(req,res){
	res.render("secret");
})

app.get("/login",function(req,res){
	res.render("login");

});
//login logic

app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login"
}),function(req,res){
	res.send("Login reached");

});

//logout

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");

});

function Isloggedin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000,function(){
	console.log(" server have started");
}); 