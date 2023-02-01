const express = require("express");
const mongoose = require("mongoose");
const Reviews = require("../../Models/product/ReviewSchema");
const {
  getReviews,
  addAReview,
  downvoteAReview,
  upvoteAReview,
} = require("../../Services/ReviewServise");
const { isAuth } = require("./AuthMiddleware");
const router = express.Router();

router.get("/:product_id/:start", async (req, res) => {
  try {
    console.log(req.params);
    const product_id = mongoose.mongo.ObjectId(req.params.product_id);
    let user_id = null;
    if (req.user) {
      user_id = mongoose.mongo.ObjectId(req.user.id);
    }
    console.log(product_id);
    const reviews = await getReviews(
      product_id,
      Number(req.params.start),
      user_id
    );
    res.json({
      reviews,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error,
    });
  }
});

router.post("/:product_id/add", isAuth, async (req, res) => {
  try {
    const product_id = mongoose.mongo.ObjectId(req.params.product_id);
    const user_id = mongoose.mongo.ObjectId(req.user.id);

    const comment = req.body.comment;

    const savedReview = await addAReview(product_id, comment, user_id);

    res.json({
      message: "Review Added Successfully",
      success: true,
    });
  } catch (error) {
    res.json({
      message: error,
      success: false,
    });
  }
});

router.put("/:review_id/upvote", isAuth, async (req, res) => {
  try {
    const user_id = mongoose.mongo.ObjectId(req.user.id);
    const review_id = mongoose.mongo.ObjectId(req.params.review_id);
    const updatedReview = await upvoteAReview(user_id, review_id);
    res.json({ message: "Upvoted Successfully", success: true });
  } catch (error) {
    res.json({ message: error, success: false });
  }
});
router.put("/:review_id/downvote", isAuth, async (req, res) => {
  try {
    const user_id = mongoose.mongo.ObjectId(req.user.id);
    const review_id = mongoose.mongo.ObjectId(req.params.review_id);
    const updatedReview = await downvoteAReview(user_id, review_id);
    res.json({ message: "Downvoted Successfully", success: true });
  } catch (error) {
    res.json({ message: error, success: false });
  }
});

module.exports = router;
