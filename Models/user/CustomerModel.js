const { default: mongoose, Mongoose } = require("mongoose");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    // add a profile picture

    user_id: {
        type: mongoose.mongo.ObjectId,
        required: true,
        unique: true,
    },

    cart_id: {
        type: mongoose.Types.ObjectId,
        ref: "Cart",
    },
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: "Orders",
    }, ],
    // save the payment details
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;