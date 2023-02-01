const { default: mongoose } = require("mongoose");
const Cart = require("../Models/cart/CartModel");
const Customer = require("../Models/user/CustomerModel");
const { createACart, getCartById } = require("./CartRepository");

// get customer by ID
const getCustomerById = async (user_id) => {
  const customer = await Customer.findOne({ user_id: user_id });
  return customer;
};

// add a customer || registration
const addACustomer = async (user_id, cart_id) => {
  if (!cart_id) {
    const cart = new Cart();
    const savedCart = await cart.save();
    cart_id = savedCart.id;
  }

  const customer = new Customer({
    user_id: user_id,
    cart_id: cart_id,
  });

  try {
    const savedCustomer = await customer.save();
    return savedCustomer;
  } catch (error) {
    console.log(eror);
    return null;
  }
};

const getCart = async (user) => {
  const cart_id = user.cart_id;
  const cart = await getCartById(cart_id);
  return cart;
};
// update a customer || update profile

// delete a customer || account delete

module.exports = {
  addACustomer,
  getCustomerById,
  getCart,
};
