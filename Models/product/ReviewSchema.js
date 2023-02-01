const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  user_id: { type: mongoose.mongo.ObjectId, ref: "Customer", required: true },
  upvotes: { type: Number, default: 0 },
  upvoted_by: [
    {
      type: mongoose.mongo.ObjectId,
      ref: "User",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
const Reviews = mongoose.model("Reviews", ReviewSchema);
module.exports = Reviews;
