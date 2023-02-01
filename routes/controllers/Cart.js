const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const AuthMiddleware = require("./AuthMiddleware");
const {
  addItemToCart,
  getCartByCustomerId,
  removeItem,
} = require("../../Services/CartService");
const { getCartById } = require("../../Repositories/CartRepository");

const router = express.Router();

// getCart
router.get("/", AuthMiddleware.isCustomer, async (req, res) => {
  try {
    const cart = await getCartByCustomerId(
      mongoose.mongo.ObjectId(req.user.id)
    );
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
});

// view cart
router.get("/:cart_id", AuthMiddleware.isCustomerToCart, async (req, res) => {
  try {
    const cart_id = mongoose.mongo.ObjectId(req.params.cart_id);
    const cart = await getCartById(cart_id);
    res.json(cart);
  } catch (error) {
    res.json({
      message: error,
      success: false,
    });
  }
});

// buy cart

// remove item
router.post(
  "/:cart_id/delete",
  AuthMiddleware.isCustomerToCart,
  async (req, res) => {
    try {
      const cart_item_id = mongoose.mongo.ObjectId(req.body.cart_item_id);
      const cart_id = mongoose.mongo.ObjectId(req.params.cart_id);
      const newCart = await removeItem(cart_id, cart_item_id);
      res.json({ success: true, message: "SuccessFully Removed" });
    } catch (error) {
      res.json({ success: false, message: error });
    }
  }
);

// add to cart
router.post("/add", AuthMiddleware.isCustomer, async (req, res) => {
  try {
    console.log(req.body);

    const product_id = mongoose.mongo.ObjectId(req.body.productid);

    const varient_id = mongoose.mongo.ObjectId(req.body.varient._id);
    const user_id = mongoose.mongo.ObjectId(req.user.id);

    const customization = req.body.customization;

    const savedCart = await addItemToCart(
      user_id,
      product_id,
      varient_id,
      customization
    );
    res.json(savedCart);
  } catch (error) {
    res.json({ message: error, success: false });
  }
});

// update quantity

// apply coupon

module.exports = router;
