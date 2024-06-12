const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const Experr = require("../utils/Experr.js"); // Import the Experr class
const {isLoggedIn,isOwner} = require("../views/user/middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body.Listings);
     if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new Experr(400,errMsg); // Use the Experr class to throw the error
      }else{
        next();
   }
 }; 
  //New Route
  router.get("/new",isLoggedIn,listingController.new);
 router
 .route("/").get(wrapAsync(listingController.index)).post(upload.single('list[image][url]'),isLoggedIn,validateListing,
  wrapAsync (listingController.create)
  );
 router
  .route("/:id").get(wrapAsync (listingController.show))
  .put(isLoggedIn,isOwner,upload.single('list[image.url]'),validateListing, wrapAsync(listingController.update))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroy));
  //Edit Route
  router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.edit));
  module.exports = router;