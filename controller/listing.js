const Listing=require("../models/listing.js");

module.exports.index=async (req, res) => {
    let data = await Listing.find({});
    res.render("listing/index", { data });
};

module.exports.renderNewForm=async (req,res)=>{
    res.render("listing/new");
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
     if(!data){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    else{
        let newurl=data.image.url;
        newurl=newurl.replace("/upload","/upload/w_250");
        res.render("listing/update.ejs",{data,newurl});
    }
    // res.send("hi");
}

module.exports.showListing= async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate({path:"reviews" , populate:{path:"auther"}}).populate("owner");
    if(!data){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    else{
        res.render("listing/show.ejs",{data});
    }
}

module.exports.postNewList=async (req,res,next)=>{
   let url=req.file.path;
   let filename=req.file.filename;
    let newdata=new Listing(req.body.listing);
    newdata.owner=req.user._id;
    newdata.image={url,filename};
    await newdata.save();
    req.flash("success","New Listing created");
    res.redirect("/listing");
}

module.exports.putUpdatedList=async (req,res)=>{
    
    let {id}=req.params;
    console.log("Uploaded file:", req.file);
    let listingimg=await Listing.findByIdAndUpdate(id,req.body.listing);
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listingimg.image={url,filename};
        await listingimg.save();
    }
    req.flash("success","Listing Updated");
    let s="/listing/"+id;
    res.redirect(s);
};

module.exports.deleteList=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listing");
};