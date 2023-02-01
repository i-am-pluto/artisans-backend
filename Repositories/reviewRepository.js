const { default: mongoose } = require("mongoose");
const ReviewSchema = require("../Models/product/ReviewSchema");

// update review
const updateAReview = async(review) => {
    const r = await review.save();
    return r;
};
// remove review
const deleteAReview = async(review_id) => {
    await ReviewSchema.findByIdAndDelete(review_id);
};
// add review
const addAReview = async(review) => {
    const r = await review.save();
    return r;
};

module.exports = {
    addAReview,
    updateAReview,
    deleteAReview,
};