const crypto = require("crypto");
const mongoose = require("mongoose");
const userRepository = require("../Repositories/UserRepository");
const customerService = require("./../Services/CustomerService");
const { uploadpfp, uploadCover } = require("./CloudinaryService");
const { getArtistByID } = require("../Repositories/ArtistRepository");
const { addACustomer } = require("../Repositories/CustomerRepository");
const { addAnArtist } = require("./ArtistService");

const genPassword = (password) => {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
};

const validPassword = (password, hash, salt) => {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return hash === hashVerify;
};

const getUserById = async (user_id) => {
  const user = await userRepository.getUserById(user_id);
  return user;
};
const markUserArtist = async (user_id) => {
  const user = await userRepository.getUserById(user_id);
  console.log(addAnArtist);
  const artist = await addAnArtist(user);
  user.artist = true;
  await user.save();
  return user;
};
const markUserCustomer = async (user_id) => {
  const user = await userRepository.getUserById(user_id);
  const savedUser = await user.save();
  console.log(addACustomer);
  const customer = await addACustomer(user.id);
  user.customer = true;
  await user.save();
  return user;
};

const setProfilePic = async (image, user_id) => {
  const uploadResponse = await uploadpfp(image, user_id);
  const user = await getUserById(user_id);
  user.pfp_url = uploadResponse.secure_url;
  await user.save();
  return uploadResponse;
};

// register logic

// get user credentials

// edit add user credentials
const updateUser = async (data, user_id) => {
  const user = await getUserById(user_id);
  // console.log(user);

  for (element in data) {
    user[element] = data[element];
  }

  const savedUser = await user.save();
  return savedUser;
};

const updateAddress = async (newAddress, user_id) => {
  const user = await getUserById(user_id);

  user.address = newAddress;
  const savedUser = await user.save();
  return savedUser;
};

module.exports = {
  genPassword,
  validPassword,
  getUserById,
  markUserArtist,
  markUserCustomer,
  setProfilePic,
  updateUser,
  updateAddress,
  uploadCover,
};
