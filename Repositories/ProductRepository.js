const { default: mongoose } = require("mongoose");
const Products = require("../Models/product/ProductModel");

// getting products

// by id
const getProductById = async (product_id) => {
  const product = await Products.findById(product_id);
  return product;
};

// find all products
const findAllProducts = async () => {
  const allProducts = await Products.find();
  return allProducts;
};

// by artist
const getProductByArtist = async (artist_id, pge_no) => {
  const all = await Products.find({ artist_id: artist_id })
    .sort({ clicks: 1, sold_no: 1 })
    .limit(50)
    .skip(pge_no * 50);
  return all;
};

// by clicks
const getProductByPopularity = async (pge_no) => {
  const all = await Products.find()
    .sort({ clicks: 1 })
    .limit(50)
    .skip(pge_no * 50);
  return all;
};
// by sold

// by newly added
const getProductsByNewLyAdded = async (pge_no) => {
  const all = await Products.find()
    .sort({ created_on: -1 })
    .limit(50)
    .skip(pge_no * 50);
  return all;
};

const getProductsByClicks = async (pge_no) => {
  const all = await Products.find()
    .sort({ clicks: 1 })
    .limit(50)
    .skip(pge_no * 50);
  return all;
};

const getProductsBySold = async (pge_no) => {
  const all = await Products.find()
    .sort({ sold_no: 1 })
    .limit(50)
    .skip(pge_no * 50);
  return all;
};

// recommended
// const getProductsByUser = async(user_id) => {
//     // create a logic
// };

// adding a product
// todos
// add a verification Method So That Only Sellers are able to do this
const addAProduct = async (product) => {
  const p = new Products({ ...product });
  const savedProduct = await p.save();
  return savedProduct;
};

// delete a product
const deleteAProduct = async (product_id) => {
  await Products.findByIdAndDelete(product_id);
};

// update product
const updateProduct = async (updatedProduct) => {
  return await updatedProduct.save();
};

module.exports = {
  getProductByArtist,
  getProductById,
  getProductByPopularity,
  getProductsByNewLyAdded,
  getProductsByClicks,
  getProductsBySold,
  addAProduct,
  findAllProducts,
  deleteAProduct,
  updateProduct,
};
