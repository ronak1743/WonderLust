const express=require("express");
const app=express.Router({ mergeParams: true });
const User=require("../models/user.js");
const passport = require("passport");
const WrapAsync=require("../utile/WeapAsync.js");
const { isLoggedin, getUrl } = require("../middleware.js");


app.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

app.post("/signup",WrapAsync(async (req,res)=>{
    try{
        let{Username,Email,password}=req.body;
        let newuser=new User({ username: Username, email: Email });
        let rest=await User.register(newuser,password);
        console.log(rest);
        req.login(newuser,(err)=>{
            if(err){
                req.flash("error",e.message);
                res.redirect("/signup");
            }
            else{

                req.flash("success","welcome to Wonderlust");
                res.redirect("/listing");
            }

        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

app.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

app.post("/login",getUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}),async (req,res)=>{

    req.flash("success","welcome Back Wonderlust !");
    if(res.locals.redirectTo){
        console.log(res.redirect(res.locals.redirectTo));
    }
    else{
        res.redirect("/listing");
    }
    
});

app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Have been successfully Loggedout !!");
        res.redirect("/listing");
    })
});

module.exports=app;