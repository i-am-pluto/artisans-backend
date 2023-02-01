const mongoose = require("mongoose");
const categoryRepository = require("../Repositories/CategoryRepository");
const { getProductById } = require("../Repositories/ProductRepository");

const getACategory = async (cat_id) => {
  try {
    const category = await categoryRepository.getCategoryById(cat_id);
    return category;
  } catch (error) {
    console.log(error);
  }
};
const getAllCategories = async () => {
  try {
    return await categoryRepository.getAllCategories();
  } catch (error) {
    console.log(error);
  }
};
const getAllProducts = async (cat_id) => {
  try {
    return await categoryRepository.getAllProducts(cat_id);
  } catch (error) {
    console.log(error);
  }
};
const generateProductCategories = async (categories, product_id) => {
  const result = [];
  console.log(categories);
  for (const category of categories) {
    if (category.cat_id) {
      result.push(category);
    } else {
      const savedCategory = await categoryRepository.createCategory(
        category,
        product_id
      );
      result.push({
        cat_id: savedCategory._id,
        cat_name: savedCategory.cat_name,
      });
    }
  }
  return result;
};

const categorySearch = async (query) => {
  const searchResults = await categoryRepository.autoCompleteCategorySearch(
    query
  );
  return searchResults;
};

module.exports = {
  getACategory,
  getAllCategories,
  getAllProducts,
  generateProductCategories,
  categorySearch,
};
