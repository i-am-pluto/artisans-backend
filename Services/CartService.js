const mongoose = require("mongoose");
const Cart = require("../Models/cart/CartModel");
const userRepository = require("../Repositories/UserRepository");
const cartRepository = require("../Repositories/CartRepository");
const { createCheckOutSession } = require("./StripeAccnt");
const Orders = require("../Models/orders/OrdersModel");
const { createAnOrder } = require("./OrderService");
const { getProductById } = require("../Repositories/ProductRepository");
const CustomerService = require("./CustomerService");
const { getCustomerById } = require("../Repositories/CustomerRepository");
const { getVarientById } = require("../Repositories/VarientRepository");

const createACart = async () => {
  const cart = new Cart();
  const savedCart = await cart.save();
  return savedCart;
};

// add item to cart
const addItemToCart = async (
  user_id,
  product_id,
  varient_id,
  customization
) => {
  const product = await getProductById(product_id);
  const customer = await getCustomerById(user_id);
  const cart = await getCartById(customer.cart_id);
  const varient = await getVarientById(varient_id);
  const cart_item = {
    product_id,
    product_image: product.main_image_url,
    product_name: product.product_name,
    artist_name: product.artist.artist_name,
    artist_id: product.artist.artist_id,
    varient_price: varient.varient_price,
    varient_id: varient_id,
    varient_name: varient.varient_name,
    quantity: 1,
    customization: customization,
  };
  console.log(cart);
  cart.cart_items.push(cart_item);
  console.log("here");
  const savedCart = await cart.save();

  return savedCart;
};

const getCartByCustomerId = async (user_id) => {
  const customer = await getCustomerById(user_id);
  console.log(customer);
  const cart = await getCartById(customer.cart_id);
  return cart;
};

const getCartById = async (cart_id) => {
  const cart = await Cart.findById(cart_id);
  return cart;
};
const getCartItemById = async (cart_item_id, cart_id) => {
  const cart_item = await cartRepository.getCartItemById(
    await getCartById(cart_id),
    cart_item_id
  );
  return cart_item;
};

// remove item
const removeItem = async (cart_id, cart_item_id) => {
  const cart = await getCartById(cart_id);
  const newCart = await cartRepository.removeProductFromCart(
    cart,
    cart_item_id
  );
  return newCart;
};

// update quantity
const updateQuantity = async (cart_id, product_json) => {
  const cart = await getCartById(cart_id);
  const newCart = await cartRepository.updateCartItem(
    cart,
    product_json,
    cart_item_id
  );
  return newCart;
};

// buy a cart
const buyCartItemSession = async (cart_id, cart_item_id, user_id, address) => {
  const cart_item = await getCartItemById(cart_item_id, cart_id);
  const cart = await getCartById(cart_id);

  const CheckOutSession = await createCheckOutSession(cart_item);

  //create an order
  const order = await createAnOrder(
    cart_item,
    cart,
    user_id,
    address,
    CheckOutSession.payment_intent
  );
  return CheckOutSession;
};

const confirmPayment = async (cart_id, cart_item_id) => {};

module.exports = {
  addItemToCart,
  createACart,
  getCartById,
  getCartByCustomerId,
  removeItem,
};
