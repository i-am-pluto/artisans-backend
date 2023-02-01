const mongoose = require("mongoose");
const SearchLookup = require("../Models/searchEngine/SearchLookup");
const { getArtistById } = require("../Repositories/ArtistRepository");
const { findAllProducts } = require("../Repositories/ProductRepository");
const {
  generateAutoComplete,
} = require("../Repositories/SearchEngineRepository");
const SearchEngineRepository = require("../Repositories/SearchEngineRepository");

const indexAllProducts = async () => {
  const allProducts = await findAllProducts();

  allProducts.forEach(async (el, i) => {
    const savedLookup = await indexAproduct(el);
  });
  return true;
};

const indexAproduct = async (product) => {
  const artist = await getArtistById(product.artist.artist_id);
  let price = 0;
  if (product.varients.length) price = product.varients[0].price;
  const searchLookup = new SearchLookup({
    p_name: product.product_name,
    p_id: product.id,
    artist_name: artist.artist_name,
    categories: product.categories,
    price: price,
  });
  const savedLookup = await searchLookup.save();
  return savedLookup;
};

const searchByRevelency = async (query, pgeno) => {
  const responseData = await SearchEngineRepository.searchByRevelency(
    query,
    pgeno
  );
  return responseData;
};
const searchByPriceAscending = async (query, pgeno) => {
  const responseData = await SearchEngineRepository.searchByPriceAscending(
    query,
    pgeno
  );
  return responseData;
};
const searchByPriceDescending = async (query, pgeno) => {
  const responseData = await SearchEngineRepository.searchByPriceDescending(
    query,
    pgeno
  );
  return responseData;
};
const generateAutoCompleteSearch = async (query) => {
  const responseData = await generateAutoComplete(query);
  return responseData;
};

module.exports = {
  indexAllProducts,
  indexAproduct,
  searchByRevelency,
  searchByPriceAscending,
  searchByPriceDescending,
  generateAutoCompleteSearch,
};
