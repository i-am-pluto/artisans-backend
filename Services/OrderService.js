const Orders = require("../Models/orders/OrdersModel");
const { addOrderToCustomer } = require("./CustomerService");
const orderRepository = require("./../Repositories/OrdersRepository");
const { getProductById } = require("../Repositories/ProductRepository");
const { createCheckOutSession } = require("./StripeAccnt");
const { getUserById } = require("./UserService");
const { getArtistById } = require("../Repositories/ArtistRepository");

const createAnOrder = async (cart_item, cart, user_id, address, sessionID) => {
  const order = new Orders({
    order_amount: cart_item.price * cart_item.quantity,
    order_items: { cart_item_id: cart_item.id, cart_id: cart.id },
    order_address: address,
    payment_intent_id: sessionID,
    c_id: user_id,
  });
  const savedOrder = await order.save();

  await addOrderToCustomer(user_id, order.id);

  return savedOrder;
};

const createOrderFromCartItem = async (cart_item, user_id) => {
  const order = new Orders({
    order_item: {
      product_id: cart_item.product_id,
      varient_id: cart_item.varient_id,
      varient_name: cart_item.varient_name,
    },
    c_id: user_id,
    a_id: cart_item.artist_id,
    customization: cart_item.customization,
  });

  const savedOrder = await order.save();
  return savedOrder;
};

const createOrderFromProduct = async (
  product,
  customer_id,
  varient,
  customization
) => {
  const order = new Orders({
    order_item: {
      product_id: product.id,
      varient_id: varient.id,
      varient_name: varient.varient_name,
    },
    c_id: customer_id,
    a_id: product.artist.artist_id,
    customization: customization,
  });
  const savedOrder = order.save();
  return savedOrder;
};

const buyNow = async (productid, varient, customization, user_id) => {
  const product = await getProductById(productid);
  const artist = product.artist.artist_id;

  const order = new Orders({
    order_item: {
      product_id: productid,
      varient_id: varient.varient_id,
      varient_name: varient.varient_name,
    },
    c_id: user_id,
    a_id: artist,
    customization: customization,
  });

  const savedOrder = await order.save();
  let index = product.varients.findIndex((el) => {
    return el.varient_stripe_id === varient.varient_stripe_id;
  });
  if (index !== -1) product.varients[index].varient_stocks--;
  product.save();
  return savedOrder;
};

const confirmOrder = async (order_id, orderDetails, user_id) => {
  const order = await getOrderById(order_id);
  order.order_address = orderDetails.address;
  order.contact_details = {};

  order.contact_details.phone = orderDetails.contact_details.phonenumber;
  order.contact_details.email = orderDetails.contact_details.email;

  order.order_status = "PAYMENT_NOT_RECIEVED";
  const savedOrder = await order.save();

  return savedOrder;
};

const getOrderByPaymentIntent = async (payment_intent_id) => {
  const order = await Orders.findOne({ payment_intent_id: payment_intent_id });
  return order;
};

const markOrderPaid = async (order) => {
  order.status = "PAYMENT_RECIEVED";
  const savedOrder = await order.save();
  return savedOrder;
};

// get order detorder_idails
const getOrderById = async (order_id) => {
  const order = orderRepository.getOrderById(order_id);
  return order;
};

// set order dispatched
const setOrderDispatched = async (order_id) => {
  const order = orderRepository.markOrderDispatched(order_id);
  return order;
};

// set order delivered
const setOrderDelivered = async (order_id) => {
  const order = orderRepository.markOrderDelivered(order_id);
  return order;
};

// end the order
const setOrderCompleted = async (order_id) => {
  const order = orderRepository.getOrderById(order_id);
  order.status = "COMPLETED";
  const savedOrder = await order.save();
  return savedOrder;
};

const removeOrder = async (order_id, customer_id, artist_id) => {
  // remove order from customer's profile
  // remove order from artist's profile
  // remove order from database
};

module.exports = {
  createAnOrder,
  getOrderByPaymentIntent,
  getOrderById,
  setOrderCompleted,
  setOrderDelivered,
  setOrderDispatched,
  buyNow,
  createOrderFromCartItem,
  createOrderFromProduct,
  confirmOrder,
  markOrderPaid,
  removeOrder,
};
