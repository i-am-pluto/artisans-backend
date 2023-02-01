const router = require("express").Router();

const productRoutes = require("./Products");
const userRoutes = require("./Users");
const homeRoute = require("./Home");
const artistRoute = require("./Artist");
const customerRoute = require("./Customer");
const orderRoute = require("./Order");
const cartRoute = require("./Cart");
const reviewRoute = require("./Review");
const searchRoute = require("./Search");
const paymentRoute = require("./Payment");
const categoryRoute = require("./Category");

// product routes
router.use("/product", productRoutes);
// user routes
router.use("/user", userRoutes);
// home route
router.use("/home", homeRoute);
// artist route
router.use("/artist", artistRoute);
router.use("/customer", customerRoute);

//order route
router.use("/order", orderRoute);

router.use("/cart", cartRoute);
router.use("/category", categoryRoute);

router.use("/reviews", reviewRoute);
router.use("/search", searchRoute);
router.use("/payment", paymentRoute);

module.exports = router;
