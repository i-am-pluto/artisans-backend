const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  cart_items: [
    {
      product_id: { type: mongoose.Types.ObjectId, ref: "Products" },
      // add image thumbnail
      product_image: String,
      product_name: String,
      artist_name: String,
      artist_id: mongoose.mongo.ObjectId,

      varient_price: Number,
      varient_name: String,
      varient_id: mongoose.mongo.ObjectId,

      date_added: { type: Date, default: Date.now },
      quantity: Number,
      customization: String,
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
