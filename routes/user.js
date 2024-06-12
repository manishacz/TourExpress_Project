const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const {saveRedirectUrl} = require("../views/user/middleware.js");  // Import the saveRedirectUrl function   
const UserControllers = require("../controllers/user.js");

router
.route("/signup").get(UserControllers.renderSignup).post(wrapAsync(UserControllers.userSignup));
// login route
router.route("/login").get(UserControllers.renderLogin).post(saveRedirectUrl,
    passport.authenticate('local',{ failureRedirect:'/login',failureFlash:true}),
    wrapAsync(UserControllers.userLogin));
// here is the passport.authenticate middleware which is used to authenticate the user and redirect to the desired page also it will flash the message if the user is not found
// logout route
router.get("/logout", UserControllers.userLogout);
module.exports = router;
