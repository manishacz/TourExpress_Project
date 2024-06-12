const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const Experr = require("../utils/Experr.js");
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review added", newReview);
    req.flash("success", "Successfully added a new review!");
    res.redirect(`/listings/${listing._id}`);
  };
  module.exports.deleteReview = async (req, res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  };