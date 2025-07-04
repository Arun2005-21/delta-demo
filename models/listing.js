const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const hygiene = require("./hygiene.js");
const { string } = require("joi");












const listingSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,              
  },    
  
  price: String,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  hygiene: [
    {
      type: Schema.Types.ObjectId,
      ref: "Hygiene",
    }
  ],
  
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  
  geometry: {    
      type: {
        type: String, 
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      },     
      
    },

    category: {
        type: String,
        enum: [
            "Trending",
            "Roots",
            "Iconic cities",
            "Mountains",
            "Castles",
            "Amazing pools",
            "Camping",
            "Farms",
            "Artic",
            "Domes",
            "Boats"
          ],
          required: true
       },   

 
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id : { $in: listing.reviews}});

  }
  
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;