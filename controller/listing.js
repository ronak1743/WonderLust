const Listing=require("../models/listing.js");
const axios = require('axios');

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

function createMapScript(lon,lat){
    let key=process.env.Map_API_KEY;
    let style=`https://api.maptiler.com/maps/streets/style.json?key=$key`;
const mapScript = `
  <script>
    const lat = ${lat};
    const lon = ${lon};
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=${key}',
      center: [${lon}, ${lat}],
      zoom: 12
    });
    new maplibregl.Marker().setLngLat([${lon}, ${lat}]).addTo(map);
  </script>
`;
return mapScript;
}
async function geocodeCity(cityName, country) {
  const location = `${cityName}, ${country}`;
  const apiKey = process.env.Map_API_KEY;
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${apiKey}`;

  const response = await axios.get(url);

  if (response.data.features && response.data.features.length > 0) {
    const [lon, lat] = response.data.features[0].geometry.coordinates;
    return { lat, lon };
  } else {
    throw new Error("Location not found");
  }
}
module.exports.showListing= async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate({path:"reviews" , populate:{path:"auther"}}).populate("owner");
    if(!data){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    else{
        try{
            let {lat,lon}=await geocodeCity(data.location,data.country);
            let mapScript=createMapScript(lon,lat);
            return res.render("listing/show.ejs",{data,mapScript});
        }
        catch(err){
            req.flash("error","can't Find city on map");
            return res.render("listing/show.ejs",{data,mapScript:""});

        }
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