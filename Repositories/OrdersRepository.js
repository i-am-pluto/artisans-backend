const { default: mongoose } = require("mongoose");
const Orders = require("../Models/orders/OrdersModel");

// get order by order_id
const getOrderById = async (order_id, user_id) => {
  const order = Orders.findById(order_id);

  if (order.a_id === user_id) {
    order.customer = false;
    order.artist = true;
  } else {
    order.customer = true;
    order.artist = false;
  }

  return order;
};

// get all orders by customer_id

// update order status
const markOrderDelivered = async (order_id) => {
  const order = await getOrderById(order_id);
  order.order_status = "DELIVERED";
  const savedOrder = updateOrder(order);
  return savedOrder;
};
const markOrderDispatched = async (order_id) => {
  const order = await getOrderById(order_id);
  order.order_status = "DISPATCHED";
  const savedOrder = updateOrder(order);
  return savedOrder;
};

const updateOrder = async (order) => {
  const savedOrder = await order.save();
  return savedOrder;
};
// register order

// delete order

module.exports = {
  getOrderById,
  markOrderDelivered,
  markOrderDispatched,
};
