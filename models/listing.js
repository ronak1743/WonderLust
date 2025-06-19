const mongoose = require("mongoose");
const Review=require("./review.js")
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String, 
  image: {
    type: {
      url: String
    },
    default: () => ({
      url: 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
    })
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: { 
    type: String,
    required: true
  },
  reviews:[
    {type:Schema.Types.ObjectId,
      ref:"Review",
    }
  ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing.reviews.length){
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema); 

module.exports = Listing;
