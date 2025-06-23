const express=require("express");
const app=express.Router({ mergeParams: true })
const wrapasync=require("../utile/WeapAsync.js");
const reviewController=require("../controller/review.js");

const {validateReview,isLoggedin,isOwnerOfReview}=require("../middleware.js");

app.post("/",isLoggedin,validateReview,wrapasync(reviewController.createReview));

app.delete("/:reviewId",isLoggedin,isOwnerOfReview,wrapasync(reviewController.deleteReview));

module.exports=app;