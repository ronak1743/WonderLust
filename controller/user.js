const User=require("../models/user.js");

module.exports.renderSignupFrom=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async (req,res)=>{
    try{
        let{Username,Email,password}=req.body;
        let newuser=new User({ username: Username, email: Email });
        let rest=await User.register(newuser,password);
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
}

module.exports.renderLoginFrom=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async (req,res)=>{

    req.flash("success","welcome Back Wonderlust !");
    if(res.locals.redirectTo){
        res.redirect(res.locals.redirectTo);
    }
    else{
        res.redirect("/listing");
    }
    
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Have been successfully Loggedout !!");
        res.redirect("/listing");
    })
}