const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;
const path=require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
const ExpressError=require("./utile/ExpressError.js");
const listing=require("./Router/listing.js");
const review=require("./Router/review.js");
let session = require('express-session');
let flash=require("connect-flash");

const sessioncontent={
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
  
};

app.use(session(sessioncontent));
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.static("public"));

main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listing",listing);
app.use("/listing/:id/review",review);
app.listen(port,()=>{
    console.log("Server is listning on port 8080");
})

app.get("/",(req,res)=>{
    res.send("Hi,I am root");
})

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found!!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("listing/error", { err });

});