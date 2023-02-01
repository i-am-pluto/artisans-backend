const { default: mongoose } = require("mongoose");
const Category = require("../Models/product/CategoryModel");
const Products = require("../Models/product/ProductModel");

// get products of cat*
const getAllProducts = async (cat_id) => {
  const category = await Category.findById(cat_id);
  return category.Products;
};
// get category from id
const getCategoryById = async (cat_id) => {
  const category = await Category.findById(cat_id);
  return category;
};
// get all categories
const getAllCategories = async () => {
  const categories = await Category.find({});
  return categories;
};

const createCategory = async (category, product_id) => {
  const cat = new Category({
    cat_name: category.cat_name,
    products: [product_id],
  });
  const savedCat = await cat.save();
  return savedCat;
};

const updateCategory = async (category) => {
  const savedCategory = await category.save();
  return savedCategory;
};

const autoCompleteCategorySearch = async (query) => {
  let results = await Category.aggregate([
    {
      $search: {
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "cat_name",
              },
            },
          ],
        },
      },
    },
    { $limit: 10 },
  ]);
  return results;
};

module.exports = {
  getAllProducts,
  getCategoryById,
  getAllCategories,
  createCategory,
  updateCategory,
  autoCompleteCategorySearch,
};
