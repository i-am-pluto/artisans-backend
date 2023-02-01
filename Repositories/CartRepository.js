const { default: mongoose } = require("mongoose");
const Cart = require("../Models/cart/CartModel");
// create a cart
const createACart = async () => {
  const cart = cartRepository.createACart();
  return cart;
};

// get Cart by User_Id
const getCartById = async (cart_id) => {
  const cart = await Cart.findById(cart_id);
  return cart;
};

// add product to cart
const addToCart = async (cart, product, addPrice) => {
  cart.cart_items.push(product);
  cart.price += addPrice;
  const savedCart = await cart.save();
  return savedCart;
};

// remove product from cart
const removeProductFromCart = async (cart, cart_item_id) => {
  for (var i = 0; i < cart.cart_items.length; i++) {
    if (cart.cart_items[i]._id.equals(cart_item_id)) {
      cart.cart_items.splice(i, 1);
      break;
    }
  }

  const newCart = await cart.save();
  return newCart;
};

// const find cart_item from cart
const getCartItemById = async (cart, cart_item_id) => {
  for (var i = 0; i < cart.cart_items.length; i++) {
    if (cart.cart_items[i].id === cart_item_id) {
      return cart.cart_items[i];
    }
  }
  return null;
};

const updateCartItem = async (cart, product_json, cart_item_id) => {
  cart.cart_items.array.forEach((element, i) => {
    if (element.id == cart_item_id) {
      cart.cart_items[i] = product_json;
      cart.price +=
        product.price * product.quantity -
        cart.cart_items[i].price * cart.cart_items[i].quantity;
    }
  });
  const savedCart = await cart.save();
  return savedCart;
};

// buy_cart || clear_cart

module.exports = {
  createACart,
  getCartById,
  addToCart,
  updateCartItem,
  removeProductFromCart,
  getCartItemById,
};
