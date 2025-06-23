const express=require("express");
const app=express.Router();

const wrapasync=require("../utile/WeapAsync.js");
const {isLoggedin,isOwner}=require("../middleware.js");
const {validate}=require("../middleware.js");
const listController=require("../controller/listing.js");

app
    .route("/")
    .get(wrapasync(listController.index))
    .post(validate,wrapasync(listController.postNewList));

app.get("/new",isLoggedin,wrapasync(listController.renderNewForm));

app.get("/:id/update",isLoggedin,isOwner,wrapasync(listController.renderEditForm));

app
    .route("/:id")
    .get(wrapasync(listController.showListing))
    .put(isLoggedin,isOwner,validate, wrapasync(listController.putUpdatedList))
    .delete(isLoggedin,isOwner,wrapasync(listController.deleteList));


module.exports=app;