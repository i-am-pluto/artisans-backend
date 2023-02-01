const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const productModel = require("../../Models/product/ProductModel");
const { getCartById } = require("../../Repositories/CartRepository");
const { getCustomerById } = require("../../Repositories/CustomerRepository");
const productServices = require("../../Services/ProductService");
const customerService = require("../../Services/CustomerService");
const AuthMiddleware = require("./AuthMiddleware");
const { getVarientById } = require("../../Repositories/VarientRepository");

// get search results

// add a product
router.post(
  "/:id/add",
  AuthMiddleware.isUserAuthorOfRequest,
  async (req, res) => {
    const product = await productServices.addAProduct(
      req.body,
      mongoose.mongo.ObjectId(req.user.id)
    );
    if (!product) {
      res.json({
        message: "Failed To Add The Product",
        success: false,
      });
    } else {
      res.json({
        id: product.id,
        message: "Added The Product Successfully",
        success: true,
      });
    }
  }
);

router.post(
  "/:id/addvarients",
  AuthMiddleware.isArtistToProduct,
  async (req, res) => {
    const product = await productServices.addVarients(
      req.body.varients,
      mongoose.mongo.ObjectId(req.params.id),
      mongoose.mongo.ObjectId(req.user.id)
    );
    if (!product) {
      res.json({
        message: "Failed To Add The Product",
        success: false,
      });
    } else {
      res.json({
        message: "Added The Product Successfully",
        success: true,
      });
    }
  }
);

router.get("/varient/:id", async (req, res) => {
  try {
    const varient = await getVarientById(
      mongoose.mongo.ObjectId(req.params.id)
    );
    res.json(varient);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
});

router.post(
  "/:id/addcategories",
  AuthMiddleware.isArtistToProduct,
  async (req, res) => {
    try {
      const savedProduct = await productServices.addCategoriesToProducts(
        req.body,
        mongoose.mongo.ObjectId(req.params.id)
      );
      res.json({ success: true, message: "Categories successfully added" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error });
    }
  }
);

// ADD main image
router.post(
  "/:id/addmainimage",
  AuthMiddleware.isArtistToProduct,
  async (req, res) => {
    const product = await productServices.addMainImage(
      req.body.mainimage,
      mongoose.mongo.ObjectId(req.params.id),
      mongoose.mongo.ObjectId(req.user.id)
    );
    if (!product) {
      res.json({
        message: "Failed To Add The Product",
        success: false,
      });
    } else {
      res.json({
        message: "Added The Product Successfully",
        success: true,
      });
    }
  }
);
// add gift image
router.post(
  "/:id/addgiftimage",
  AuthMiddleware.isArtistToProduct,
  async (req, res) => {
    try {
      const savedProduct = await productServices.addAGiftImage(
        req.body.imageFile,
        mongoose.mongo.ObjectId(req.user.id),
        mongoose.mongo.ObjectId(req.params.id)
      );
      res.json({
        message: "Added The Product Successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      // delete all added images
      const response = productServices.deleteAllImages(
        mongoose.mongo.ObjectId(req.user.id),
        mongoose.mongo.ObjectId(req.params.id)
      );

      res.json({
        message: "Failed To Add The Images",
        success: false,
      });
    }
  }
);

// edit a product
router.post("/:id/edit", AuthMiddleware.isArtistToProduct, async (req, res) => {
  try {
    const updatedProduct = productServices.updateAProduct(req.body);
    res.json({ message: "item updated successfully", success: true });
  } catch (error) {
    res.json({ message: `Failed To add The Item:${error}`, success: false });
  }
});
// delete a product
router.post(
  "/:id/delete",
  AuthMiddleware.isArtistToProduct,
  async (req, res) => {
    try {
      await productServices.deleteAProduct(
        mongoose.Types.ObjectId(req.params.id)
      );
      res.json({ message: "item updated successfully", success: true });
    } catch (error) {
      res.json({
        message: `Failed To add The Item:${error}`,
        success: false,
      });
    }
  }
);
// add to cart
router.get("/:id/addtocart", AuthMiddleware.isCustomer, async (req, res) => {
  try {
    const product_id = mongoose.mongo.ObjectId(req.params.id);
    const user_id = req.user.id;
    await customerService.addToCart(product_id, user_id);

    res.json({ message: "Item Successfully added to cart", success: true });
  } catch (error) {
    res.json({ message: `Failed To add The Item:${error}`, success: false });
  }
});

// add a review
router.get("/:id/addReview", AuthMiddleware.isCustomer, async (req, res) => {
  try {
    const product_id = mongoose.mongo.ObjectId(req.params.id);
    const user_id = req.user.id;
    const review = await productService.addReview(
      product_id,
      user_id,
      req.body.review
    );

    if (!review) {
      res.json({
        message: `Failed To add the Review:${error}`,
        success: false,
      });
    } else res.json({ message: "Review Added Successfully", success: true });
  } catch (error) {
    res.json({ message: `Failed To add the Review:${error}`, success: false });
  }
});
// upvote a review
router.get("/:id/upvote/:id2", AuthMiddleware.isCustomer, async (req, res) => {
  try {
    const review_id = mongoose.mongo.ObjectId(req.params.id2);
    const user_id = req.user.id;
    const review = await productServices.upvoteReview(user_id, review_id);

    if (!review) {
      res.json({
        message: `Failed To add the Review:${error}`,
        success: false,
      });
    } else res.json({ message: "Review Added Successfully", success: true });
  } catch (error) {
    res.json({ message: `Failed To add the Review:${error}`, success: false });
  }
});
router.get(
  "/:id/downvote/:id2",
  AuthMiddleware.isCustomer,
  async (req, res) => {
    try {
      const review_id = mongoose.mongo.ObjectId(req.params.id2);
      const user_id = req.user.id;
      const review = await productServices.downvoteReview(user_id, review_id);

      if (!review) {
        res.json({
          message: `Failed To add the Review:${error}`,
          success: false,
        });
      } else res.json({ message: "Review Added Successfully", success: true });
    } catch (error) {
      res.json({
        message: `Failed To add the Review:${error}`,
        success: false,
      });
    }
  }
);
router.get("/:product_id/varients", async (req, res) => {
  try {
    const product_id = mongoose.mongo.ObjectId(req.params.product_id);
    console.log(product_id);
    const varients = await productServices.getVarients(product_id);
    res.json(varients);
  } catch (error) {
    res.json({
      message: error,
      success: false,
    });
  }
});

// buy the product without adding to cart

// get featured products
// get latest product from top 5 best selling artists
router.get("/featured", async (req, res) => {
  console.log("this was called");
  try {
    const products = await productServices.getFeaturedProducts();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.json({
      message: error,
      success: false,
    });
  }
});

router.get("/new", async (req, res) => {
  try {
    const products = await productServices.getNewProducts();
    res.json(products);
  } catch (error) {
    console.log(1);
    console.log(error);
    res.json({
      message: error,
      success: false,
    });
  }
});
router.get("/bestselling", async (req, res) => {
  try {
    const products = await productServices.getMostSelling();
    res.json(products);
  } catch (error) {
    console.log(2);
    console.log(error);
    res.json({
      message: error,
      success: false,
    });
  }
});
router.get("/popular", async (req, res) => {
  try {
    const products = await productServices.getMostPopular();
    res.json(products);
  } catch (error) {
    console.log(3);
    console.log(error);
    res.json({
      message: error,
      success: false,
    });
  }
});

// get a product

router.get("/:id", async (req, res) => {
  try {
    console.log(req.params);
    const product = await productServices.getAProduct(
      mongoose.Types.ObjectId(mongoose.mongo.ObjectId(req.params.id))
    );
    res.json(product);
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error,
    });
  }
  // res.json({});
});

module.exports = router;
