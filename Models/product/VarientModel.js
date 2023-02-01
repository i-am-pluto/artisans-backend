const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VarientSchema = new Schema({

  product_id: { type: mongoose.mongo.ObjectId, ref: "Products" },

  varient_name: String,
  varient_price: Number,
  varient_stocks: Number,
});

const Varients = mongoose.model("Varients", VarientSchema);
module.exports = Varients;
