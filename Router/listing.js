const express=require("express");
const app=express.Router();
const Listing=require("../models/listing.js");
const wrapasync=require("../utile/WeapAsync.js");
const ExpressError=require("../utile/ExpressError.js");
const {listingSchema}=require("../Schemajoi.js");

let validate=(req,res,next)=>{
let result=listingSchema.validate(req.body);
   if(result.error){
    throw new ExpressError(400,result.error);
   }
   else{
    next();
   }
}

app.get("/",wrapasync( async (req, res) => {
    let data = await Listing.find({});
    res.render("listing/index", { data });
}));

app.get("/new",wrapasync(async (req,res)=>{
    res.render("listing/new");
}));

app.get("/:id/update",wrapasync(async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
     if(!data){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    else{
        res.render("listing/update",{data});
    }
    // res.send("hi");
}));

app.get("/:id",wrapasync( async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate("reviews");
    if(!data){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    else{
        res.render("listing/show",{data});
    }
}));

app.post("/",validate,wrapasync(async (req,res,next)=>{
   
    let newdata=new Listing(req.body.listing);
    await newdata.save();
    req.flash("success","New Listing created");
    res.redirect("/listing");
    
    
}));

app.put("/:id",validate, wrapasync(async (req,res)=>{
    
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing, { runValidators: true, new: true });
    let s="/listing/"+id;

    req.flash("success","Listing Updated");
    res.redirect(s);
}));

app.delete("/:id",wrapasync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listing");
}));


module.exports=app;