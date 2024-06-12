const { query } = require("express");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: MapToken});

module.exports.index = async (req, res) => {
        const Listings = await Listing.find({});
        res.render('./listingejs/index.ejs', {Listings});
 };
 module.exports.new = (req, res) => {
    res.render("./listingejs/new.ejs");
  };
 module.exports.show = async (req, res) => {
    let { id } = req.params;
    const Listings = await Listing.findById(id).populate({path:"reviews",
      populate: {
        path: "author"
      },
    }).populate("owner");
     if(!Listings){
      req.flash("error", "Listing you are looking for is not found!");
      return res.redirect("/listings");
    }
    console.log(Listing);
    res.render("listingejs/show.ejs", {Listings});
  };
  module.exports.create = async (req, res,next) => {
     let response = await geocodingClient
     .forwardGeocode({
      query: req.body.list.location,
      limit: 2
    })
    .send();
    console.log(query);
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.list);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "Successfully a new listing is Created!");
    console.log(savedListing);
    res.redirect("/listings");
   };

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you are looking for is not found!");
      return res.redirect("/listings");
    }
    let originalImgUrl = listing.image.url;
    let NewImgUrl =originalImgUrl.replace('/upload','/upload/w_250');
    res.render("listingejs/edit.ejs", {Listings:listing,NewImgUrl});
  };
module.exports.update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.list });// 2nd arg is diconstructing the req.body.list it is an object and we are spreading it
    if(typeof req.file!=="undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = {url,filename};
     await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  };
  module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
  };