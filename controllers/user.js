const User = require("../models/user");
module.exports.renderSignup = (req, res) => {
    res.render("../views/user/signup.ejs");    
 };

module.exports.userSignup = async (req, res) => {
    try{
        let { email, username, password } = req.body;
    const newuser = new User({ email, username });
    const registeredUser = await User.register(newuser, password);    
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err){
            return next(err);
        }
         req.flash("success", "Welcome to Wanderlust!");
    res.redirect(req.session.redirectUrl);
     });
 } catch(err)
    {
      req.flash("error", err.message);
        res.redirect("/signup");
    }   
};
module.exports.renderLogin = (req, res) => {
    res.render("../views/user/login.ejs");
};
module.exports.userLogin = async (req, res) => {
    req.flash("success", `Welcome back to Wanderlust ${req.body.username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};
module.exports.userLogout = (req, res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are Logged out!");
        res.redirect("/listings");
    }
 );
};
