const express = require("express");
const router = express.Router();
const productModel = require("../../Models/product/ProductModel");
const productServices = require("../../Services/ProductService");

// get all home products
router.get("/", async (req, res) => {
  try {
    const home = {
      homeSlider: await productServices.getHomeSlider(),
      mostPopular: await productServices.getMostPopular(),
      mostSelling: await productServices.getMostSelling(),
      // recommended: await productServices.getRecommended(),
      success: true,
    };
    console.log(home.homeSlider.length);
    res.json(home);
    res.end();
  } catch (error) {
    console.log(error);
    res.json({ message: "Server Error", success: "false" });
  }
});

module.exports = router;
