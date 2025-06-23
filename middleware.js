const Listing=require("./models/listing");
const ExpressError=require("./utile/ExpressError.js");
const {reviewSchema}=require("./Schemajoi.js");
const Review=require("./models/review.js");
const {listingSchema}=require("./Schemajoi.js");

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectpath=req.originalUrl;
        req.flash("error","You must login first");
        res.redirect("/login");
    }
    else{
        next();
    }
}

module.exports.getUrl=(req,res,next)=>{
    if(req.session.redirectpath){
        res.locals.redirectTo=req.session.redirectpath;
    }
    next();
}

module.exports.isOwner=async (req,res,
    next)=>{
        let {id}=req.params;
    let list=await Listing.findById(id);
        if(res.locals.curUser && !list.owner._id.equals(res.locals.curUser._id)){
            req.flash("error","you don't have authorization of this ");
            return res.redirect(`/listing/${id}`);
        }
        next();
}
module.exports.isOwnerOfReview=async (req,res,
    next)=>{
        let {id,reviewId}=req.params;
        let list=await Review.findById(reviewId);
        if(res.locals.curUser && !list.auther._id.equals(res.locals.curUser._id)){
            req.flash("error","you don't have authorization of this ");
            return res.redirect(`/listing/${id}`);
        }
        next();
}

module.exports.validate=(req,res,next)=>{
let result=listingSchema.validate(req.body);
   if(result.error){
    throw new ExpressError(400,result.error);
   }
   else{
    next();
   }
}

module.exports.validateReview=(req,res,next)=>{
let result=reviewSchema.validate(req.body);
   if(result.error){
    throw new ExpressError(400,result.error);
   }
   else{
    next();
   }
}