const mongoose = require("mongoose");
const { createACart, getCartById } = require("./CartService");
const customerRepository = require("../Repositories/CustomerRepository");
const { getProductById } = require("../Repositories/ProductRepository");
const { getArtistByID } = require("../Repositories/ArtistRepository");
const { getOrderId } = require("./OrderService");
const { getCartItemById } = require("../Repositories/CartRepository");

const addACustomer1 = async (user_id) => {
  const cart = await createACart();
  const customer = await customerRepository.addACustomer(user_id, cart.id);
  return customer;
};

const getCustomerById = async (user_id) => {
  const customer = await customerRepository.getCustomerById(user_id);
  return customer;
};

const getCartByCustomerId = async (user_id) => {
  const customer = await customerRepository.getCustomerById(user_id);
  const cart = await getCartById(customer.cart_id);
  return cart;
};

const addToCart = async (product_id, user_id) => {
  const cart = await getCartByCustomerId(user_id);
  const product = await getProductById(product_id);
  const artist = await getArtistByID(product.artist.artist_id);
  const p = {
    product_id: product.id,
    product_name: product.product_name,
    artist_name: product.artist.artist_name,
    artist_stripe_account_id: artist.artist_stripe_account_id,
    price: product.price,
    stripe_price_id: product.stripe_price_id,
    quantity: 1,
  };
  const addPrice = product.price;
  const savedCart = await cartRepository.addToCart(cart, p, addPrice);

  return savedCart;
};

const addOrderToCustomer = async (user_id, order_id) => {
  const customer = await getCustomerById(user_id);
  customer.orders.push(order_id);
  await customer.save();
};

const getOrdersByCustomerId = async (user_id, pgeno) => {
  const customer = getCustomerById(user_id);

  const orderIds = customer.orders;
  const orders = [];

  for (var i = 0; i < 50; i++) {
    orders.push(
      await getOrderById(orderIds[orderIds.length - (pgeno - 1) * 50 - i])
    );
  }

  for (orderId in orderIds) {
    // get the order details for each order
    orders.push(await getOrderById(orderId));
  }
  return orders;
};

module.exports = {
  addACustomer1,
  addToCart,
  getCartByCustomerId,
  getCustomerById,
  addOrderToCustomer,
  getOrdersByCustomerId,
};
