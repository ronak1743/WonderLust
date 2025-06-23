const express=require("express");
const app=express.Router();
const Listing=require("../models/listing.js");
const wrapasync=require("../utile/WeapAsync.js");
const {isLoggedin,isOwner}=require("../middleware.js");
const {validate}=require("../middleware.js");

app.get("/",wrapasync( async (req, res) => {
    let data = await Listing.find({});
    res.render("listing/index", { data });
}));

app.get("/new",isLoggedin,wrapasync(async (req,res)=>{
    res.render("listing/new");
}));

app.get("/:id/update",isLoggedin,isOwner,wrapasync(async (req,res)=>{
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
    let data=await Listing.findById(id).populate({path:"reviews" , populate:{path:"auther"}}).populate("owner");
    if(!data){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    else{
        res.render("listing/show.ejs",{data});
    }
}));


app.post("/",validate,wrapasync(async (req,res,next)=>{
   
    let newdata=new Listing(req.body.listing);
    newdata.owner=req.user._id;
    await newdata.save();
    req.flash("success","New Listing created");
    res.redirect("/listing");
    
    
}));

app.put("/:id",isLoggedin,isOwner,validate, wrapasync(async (req,res)=>{
    
    let {id}=req.params;
    
        await Listing.findByIdAndUpdate(id,req.body.listing, { runValidators: true, new: true });
        req.flash("success","Listing Updated");
    
    let s="/listing/"+id;
    res.redirect(s);
}));

app.delete("/:id",isLoggedin,isOwner,wrapasync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listing");
}));


module.exports=app;