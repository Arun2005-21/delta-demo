

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.string().required().min(0),
    image: Joi.string().allow("", null),
    category: Joi.string().valid(
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
    ).required()
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required()
});

module.exports.hygieneSchema = Joi.object({
  hygiene: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required()
});
