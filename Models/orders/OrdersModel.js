const { default: mongoose } = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");

const Schema = mongoose.Schema;

const OrdersSchema = new Schema(
  {
    order_item: {
      product_id: mongoose.Types.ObjectId,
      varient_id: mongoose.Types.ObjectId,
      varient_name: String,
    },
    order_address: {
      fline: String,
      sline: String,
      city: String,
      state: String,
      country: String,
      pincode: {
        type: Number,
        match: /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/,
      },
      tag: String,
    },
    order_date: {
      type: Date,
      default: Date.now,
    },
    order_status: {
      type: String,
      enum: [
        "NOT_CONFIRMED",
        "PAYMENT_NOT_RECIEVED",
        "PAYMENT_RECIVED",
        "DISPATCHED",
        "DELIVERED",
        "COMPLETED",
      ],
      default: "NOT_CONFIRMED",
    },
    contact_details: {
      phone: Number,
      email: String,
    },
    payment_intent_id: {
      type: String,
    },
    c_id: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
    },
    a_id: {
      type: mongoose.Types.ObjectId,
      ref: "Artist",
    },

    customization: String,

  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", OrdersSchema);
module.exports = Orders;
