const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Experr = require("../utils/Experr.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn,isReviewAuthor} = require('../views/user/middleware.js');

const ReviewController = require("../controllers/reviews.js");

//validate review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body.Listings);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new Experr(400, errMsg);
    } else {
      next();
    }
  };
// Review Route
//post route for review
router.post("/",isLoggedIn,validateReview, wrapAsync(ReviewController.createReview));

  //delete route for review
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,
  wrapAsync(ReviewController.deleteReview));
module.exports = router;