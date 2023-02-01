const { default: mongoose } = require("mongoose");
const Varients = require("../Models/product/VarientModel");
const getVarientById = async (varient_id) => {
  const varient = await Varients.findById(varient_id);
  return varient;
};

module.exports = {
  getVarientById,
};
