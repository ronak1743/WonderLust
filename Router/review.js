const express=require("express");
const app=express.Router({ mergeParams: true })
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {reviewSchema}=require("../Schemajoi.js");
const wrapasync=require("../utile/WeapAsync.js");
const ExpressError=require("../utile/ExpressError.js");

const {validateReview,isLoggedin,isOwnerOfReview}=require("../middleware.js");

app.post("/",isLoggedin,validateReview,wrapasync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.auther=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    res.redirect(`/listing/${listing.id}`);

}));

app.delete("/:reviewId",isLoggedin,isOwnerOfReview,wrapasync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted");
     res.redirect(`/listing/${id}`);
}))

module.exports=app;