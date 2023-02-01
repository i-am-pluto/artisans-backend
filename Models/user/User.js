const { default: mongoose, Mongoose } = require("mongoose");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");

const Schema = mongoose.Schema;
const userSchema = new Schema({
    // add a profile picture

    pfp_url: {
        type: String,
        required: false,
    },

    name: {
        f_name: String,
        l_name: { type: String, required: true },
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
        validate: [isEmail, "invalid email"],
    },
    phone: {
        type: Number,
        match: /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    },
    address: {
        fline: String,
        sline: String,
        city: String,
        state: String,
        country: String,
        pincode: {
            type: Number,
            required: true,
            match: /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/,
        },
        tag: String,
    },

    payment: [{
        card_number: {
            type: String,
            required: true,
            maxlength: 16,
        },
        card_holder: {
            type: String,
            required: true,
        },
        expiry: {
            type: String,
            required: true,
        },
    }, ],

    artist: {
        type: Boolean,
        default: false,
    },
    customer: {
        type: Boolean,
        default: true,
    },

    // login credentials
    username: {
        type: String,
        unique: true,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        unique: true,
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;