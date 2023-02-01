const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  categories: [
    {
      cat_id: mongoose.mongo.ObjectId,
      cat_name: String,
    },
  ],

  // images  { to be added}

  main_image_url: String,
  gift_image_urls: [String],

  artist_id: {
    type: mongoose.mongo.ObjectId,
    unique: false,
    ref: "Artist",
  },

  artist: {
    artist_name: String,
    artist_followers: Number,
    artist_id: {
      type: mongoose.mongo.ObjectId,
      unique: false,
      ref: "Artist",
    },
  },

  varients: [
    {
      varient_id: {
        type: mongoose.mongo.ObjectId,
        ref: "Varients",
      },
      varient_price: Number,
    },
  ],
  description: {
    type: String,
  },
  long_description: {
    type: String,
  },
  informationTable: {
    itemWeight: {
      type: String,
    },
    packageDimensions: {
      type: String,
    },
    manufacture: {
      type: String,
    },
  },
  customization: {
    type: String,
  },
  customization_optional: {
    type: Boolean,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  sold_no: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.mongo.ObjectId,
      ref: "Reviews",
    },
  ],
  created_on: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index(
  {
    product_name: "text",
    description: "text",
    categories: "text",
  },
  {
    weights: {
      product_name: 50,
    },
  }
);

const Products = mongoose.model("Products", productSchema);
module.exports = Products;
