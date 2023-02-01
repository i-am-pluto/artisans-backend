const { default: mongoose } = require("mongoose");
const SearchRecommendation = require("../Models/searchEngine/SearchRecommendation");
const { getAllProducts } = require("./CategoryRepository");
const { findAllProducts } = require("./ProductRepository");

const generateRecommendationForProduct = async (product) => {
  const p_name = product.product_name;
  const a_name = product.artist.artist_name;
  const categories = product.categories;

  const words = [p_name, a_name, ...categories];

  const result = words.flatMap((v, i) =>
    words.slice(i + 1).map((w) => v + " " + w)
  );

  result.forEach(async (el, i) => {
    var searchRecommendation = new SearchRecommendation({
      searchTerm: el,
    });
    var savedSearchRecommendation = await searchRecommendation.save();
  });
  return true;
};

const generateAllRecommendations = async () => {
  const products = await findAllProducts();
  products.forEach(async (el, i) => {
    var recc = await generateRecommendationForProduct(el);
  });
  return true;
};

module.exports = {
  generateRecommendationForProduct,
  generateAllRecommendations,
};
