const { default: mongoose, set } = require("mongoose");
const Products = require("../Models/product/ProductModel");
const SearchLookup = require("../Models/searchEngine/SearchLookup");
const { getProductById } = require("./ProductRepository");

const searchByRevelency = async (query, pge_no) => {
  let results = await SearchLookup.aggregate([
    {
      $search: {
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "artist_name",
              },
            },
            {
              autocomplete: {
                query: query,
                path: "p_name",
              },
            },
            {
              autocomplete: {
                query: query,
                path: "categories",
              },
            },
          ],
        },
      },
    },
    { $skip: pge_no * 50 },
    { $limit: 50 },
  ]);

  results = await generateResponses(results);
  return results;
};

const searchByPriceAscending = async (query, pge_no) => {
  let results = await SearchLookup.aggregate([
    {
      $search: {
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "artist_name",
              },
            },
            {
              autocomplete: {
                query: query,
                path: "p_name",
              },
            },
            {
              autocomplete: {
                query: query,
                path: "categories",
              },
            },
          ],
        },
      },
    },
    { $sort: { price: 1 } },
    { $skip: pge_no * 50 },
    { $limit: 50 },
  ]);

  results = await generateResponses(results);
  return results;
};

const searchByPriceDescending = async (query, pge_no) => {
  let results = await SearchLookup.aggregate([
    {
      $search: {
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "artist_name",
              },
            },
            {
              autocomplete: {
                query: query,
                path: "p_name",
              },
            },
            {
              autocomplete: {
                query: query,
                path: "categories",
              },
            },
          ],
        },
      },
    },
    { $sort: { price: -1 } },
    { $skip: pge_no * 50 },
    { $limit: 50 },
  ]);

  results = await generateResponses(results);
  return results;
};

const generateAutoComplete = async (query) => {
  console.log(query);

  const results = await SearchLookup.aggregate([
    {
      $search: {
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "artist_name",
              },
            },
            {
              autocomplete: {
                query: query,
                path: "p_name",
              },
            },
            {
              autocomplete: {
                query: query,
                path: "categories",
              },
            },
          ],
        },
      },
    },
    { $limit: 10 },
  ]);
  const result = results.slice(0, 10);

  const resp = [
    // check if product name
    // check if artist name
    // check if [ categories ] then what categories
  ];

  for (var res of result) {
    // get the product
    const product = await getProductById(res.p_id);
    const thumbnail = product.main_image_url;
    const p_name = res.p_name;
    const artist_name = res.artist_name;
    const cats = [];
    for (var cat of res.categories) {
      if (query.includes(cat)) cats.push(cat);
    }
    const p_url = "/product/" + res.p_id;
    resp.push({
      thumbnail,
      p_name,
      artist_name,
      cats,
      p_url,
    });
  }

  return resp;
};

const generateResponses = async (result) => {
  const resp = [];
  for (var res of result) {
    const product = await getProductById(res.p_id);
    const thumbnail = product.main_image_url;
    const p_name = res.p_name;
    const artist_name = res.artist_name;
    let price = 0;
    if (Products.varients) price = product.varients[0].varient_price;
    const cats = [];
    for (var cat of res.categories) {
      if (query.includes(cat)) cats.push(cat);
    }
    const p_url = "/product/" + res.p_id;
    resp.push({
      thumbnail,
      p_name,
      artist_name,
      cats,
      p_url,
      price,
    });
  }
  return resp;
};

module.exports = {
  searchByRevelency,
  searchByPriceAscending,
  searchByPriceDescending,
  generateAutoComplete,
};
