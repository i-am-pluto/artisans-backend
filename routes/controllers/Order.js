const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");
const { getOrderById } = require("../../Repositories/OrdersRepository");
const AuthMiddleware = require("./AuthMiddleware");
const orderService = require("./../../Services/OrderService");
const {
  createOrderGroup,
  createSingleOrderGroup,
  getOrderGroup,
  confirmOrderGroup,
} = require("../../Services/OrdersGroupService");
const OrdersGroup = require("../../Models/orders/OrdersGroup");

const router = express.Router();

// view an order
router.get("/:orderid/", AuthMiddleware.canUserViewOrder, async (req, res) => {
  try {
    const order = await getOrderById(
      mongoose.mongo.ObjectId(req.params.orderid),
      mongoose.mongo.ObjectId(req.user.id)
    );
    res.json(order);
  } catch (error) {
    res.json({ success: false, message: error });
  }
});

// group order
router.get(
  "/:orderid/group",
  AuthMiddleware.canUserViewOrderGroup,
  async (req, res) => {
    try {
      const orderGroupId = mongoose.mongo.ObjectId(req.params.orderid);
      const order = await getOrderGroup(orderGroupId);
      res.json(order);
    } catch (error) {
      res.json({ success: false, message: error });
    }
  }
);

//order a cart
router.post(
  "/:cart_id/order-cart",
  AuthMiddleware.isCustomerToCart,
  async (req, res) => {
    try {
      const cart_id = mongoose.mongo.ObjectId(req.params.cart_id);
      const ordersGroup = await createOrderGroup(
        cart_id,
        mongoose.mongo.ObjectId(req.user.id)
      );
      console.log(ordersGroup);
      res.json({
        success: true,
        message: "Order Created",
        orderid: ordersGroup._id,
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: error,
      });
    }
  }
);

// buy now
router.post("/create", AuthMiddleware.isAuth, async (req, res) => {
  try {
    const varient = req.body.varient;
    const customization = req.body.customization;
    const productid = req.body.productid;

    const order = await createSingleOrderGroup(
      mongoose.mongo.ObjectId(productid),
      mongoose.mongo.ObjectId(req.user.id),
      mongoose.mongo.ObjectId(varient._id),
      customization
    );
    res.json({
      success: true,
      message: "Order Created",
      orderid: order._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
});

// confirm order group

router.post(
  "/:orderid/confirmbuynow",
  AuthMiddleware.canUserViewOrder,
  async (req, res) => {
    try {
      const user_id = mongoose.mongo.ObjectId(req.user.id);
      const orderid = mongoose.mongo.ObjectId(req.params.orderid);
      const session = await orderService.confirmBuyNow(
        orderid,
        req.body,
        user_id,
        user_id
      );
      console.log(session);
      res.json(session);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
);

router.post(
  "/:orderid/confirm-order-group",
  AuthMiddleware.canUserViewOrderGroup,
  async (req, res) => {
    try {
      const user_id = mongoose.mongo.ObjectId(req.user.id);
      const orderid = mongoose.mongo.ObjectId(req.params.orderid);
      const order_details = req.body;
      console.log(order_details);
      const confirmedOrder = await confirmOrderGroup(
        orderid,
        order_details,
        user_id
      );
      res.json(confirmedOrder);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
);

// update an order
// to do anything with the order the order must be paid first
// if the order is paid only the artist can mark it as dispatched
router.get("/:orderid/markorderdispatched", async (req, res) => {
  try {
    await orderService.setOrderDispatched(
      mongoose.mongo.ObjectId(req.params.orderid)
    );
    res.json({ message: "order successfully updated", success: true });
  } catch (error) {
    res.json({ success: false, message: "order failed to be placed" });
  }
});

// if the order is delivered only the customer can mark the order as delivered
router.get("/:orderid/markorderdelivered", async (req, res) => {
  try {
    await orderService.setOrderDelivered(
      mongoose.mongo.ObjectId(req.params.orderid)
    );
    res.json({ message: "order successfully updated", success: true });
  } catch (error) {
    res.json({ success: false, message: "order failed to be placed" });
  }
});
// if the order is delivered the artist can only mark it as done
router.get("/:orderid/end", async (req, res) => {
  try {
    await orderService.setOrderCompleted(
      mongoose.mongo.ObjectId(req.params.orderid)
    );
    res.json({ message: "order successfully updated", success: true });
  } catch (error) {
    res.json({ success: false, message: "order failed to be placed" });
  }
});

module.exports = router;
