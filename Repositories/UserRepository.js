const { default: mongoose } = require("mongoose");
const User = require("../Models/user/User");

const getUserById = async(user_id) => {
    const user = await User.findById(user_id);
    return user;
};

module.exports = {
    getUserById,
};