const express=require("express");
const app=express.Router({ mergeParams: true });
const userController=require("../controller/user.js");
const passport = require("passport");
const WrapAsync=require("../utile/WeapAsync.js");
const { isLoggedin, getUrl } = require("../middleware.js");


app.get("/signup",userController.renderSignupFrom);

app.post("/signup",WrapAsync(userController.signup));

app.get("/login",userController.renderLoginFrom);

app.post("/login",getUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}),userController.login);

app.get("/logout",userController.logout);

module.exports=app;