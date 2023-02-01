const mongoose = require("mongoose");
const Products = require("./ProductModel");
const ReviewSchema = require("./ReviewSchema");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  cat_name: {
    type: String,
  },
  // images  { to be added}
  clicks: {
    type: Number,
    default: 0,
  },
  products: [
    {
      product_id: mongoose.mongo.ObjectId,
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
