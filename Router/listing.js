const express=require("express");
const app=express.Router();

const wrapasync=require("../utile/WeapAsync.js");
const {isLoggedin,isOwner}=require("../middleware.js");
const {validate}=require("../middleware.js");
const listController=require("../controller/listing.js");

app.get("/",wrapasync(listController.index));

app.get("/new",isLoggedin,wrapasync(listController.renderNewForm));

app.get("/:id/update",isLoggedin,isOwner,wrapasync(listController.renderEditForm));

app.get("/:id",wrapasync(listController.showListing));


app.post("/",validate,wrapasync(listController.postNewList));

app.put("/:id",isLoggedin,isOwner,validate, wrapasync(listController.putUpdatedList));

app.delete("/:id",isLoggedin,isOwner,wrapasync(listController.deleteList));


module.exports=app;