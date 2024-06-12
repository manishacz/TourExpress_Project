// Purpose: Main file to run the server
if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}
console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const Experr = require("./utils/Experr.js");
const Reviewroute = require("./routes/reviews.js");
const listroute = require("./routes/listing.js");
const userroute = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const falsh = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const DbUrl=process.env.ATLAS_DBURL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(DbUrl);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);  
const store = MongoStore.create({
    mongoUrl: DbUrl,
    touchAfter: 24 * 60 * 60,
    crypto :{
      secret: process.env.MYSECRET
    },
    touchAfter: 24 * 60 * 60,
  });
  store.on("error", function (e) {
    console.log("Mongo Session Store Error", e);
  });
const sessionOptions = {
    store,  
   secret:process.env.MYSECRET,
   resave: false, 
   saveUninitialized: true,
   cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
   },
  };
// ///----------- home route-----------------///
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });
/////------------------------------------////
app.use(session(sessionOptions));
app.use(falsh());
////passport middleware////
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//-----------------passport-----------------////
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  console.log(res.locals.success);
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

//-----------------Routes-----------------////
app.use("/listings", listroute);
app.use('/listings/:id/reviews', Reviewroute);
app.use("/", userroute);
////---------------------------------------////


//err page
app.all("*", (req, res, next) => {
  next(new Experr(404, "Page not found"));
});

//custom error handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  console.log(err);
  res.status(statusCode).render("listingejs/error.ejs",{message});//{err[lists.stack]}
  // res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log("server is listening to port 3000");
});
