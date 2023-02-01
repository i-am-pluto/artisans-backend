const { default: mongoose } = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");

const Schema = mongoose.Schema;

const OrdersGroupSchema = new Schema(
  {
    order_items: [
      {
        product_id: mongoose.Types.ObjectId,
        varient_id: mongoose.Types.ObjectId,
        varient_name: String,
        order_id: mongoose.Types.ObjectId,
      },
    ],
    order_date: {
      type: Date,
      default: Date.now,
    },

    c_id: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
    },

    order_status: {
      type: String,
      enum: ["NOT_CONFIRMED", "PAYMENT_NOT_RECIEVED", "PAYMENT_RECIVED"],
      default: "NOT_CONFIRMED",
    },
  },
  { timestamps: true }
);

const OrdersGroup = mongoose.model("OrdersGroup", OrdersGroupSchema);
module.exports = OrdersGroup;
