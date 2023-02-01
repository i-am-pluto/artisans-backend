const mongoose = require("mongoose");
const Products = require("../Models/product/ProductModel");
const ReviewSchema = require("../Models/product/ReviewSchema");
const {
  getArtistByID,
  getArtistById,
  getArtistBySoldNo,
} = require("../Repositories/ArtistRepository");
const {
  getCategoryById,
  updateCategory,
} = require("../Repositories/CategoryRepository");
const productRepository = require("../Repositories/ProductRepository");
const reviewRepository = require("../Repositories/reviewRepository");
const { createProductObject, createPriceObject } = require("./StripeAccnt");
const artistService = require("./ArtistService");
const {
  uploadProductMainImage,
  uploadProductImages,
  deleteProductImage,
} = require("./CloudinaryService");
const Varients = require("../Models/product/VarientModel");
const { getVarientById } = require("../Repositories/VarientRepository");
const { generateProductCategories } = require("./CategoryService");
const { indexAproduct } = require("./SearchEngineService");
//get a product
const getAProduct = async (id) => {
  let product = await productRepository.getProductById(id);
  if (product.reviews)
    product.reviews.sort((a, b) => {
      if (a.upvotes < b.upvotes) {
        return -1;
      }
      if (a.upvotes > b.upvotes) {
        return 1;
      }
      return 0;
    });
  await visitProduct(product);

  return product;
};

// get product varients
const getVarients = async (product_id) => {
  console.log(product_id);
  let product = await productRepository.getProductById(product_id);
  const varients = [];
  const v = product.varients;
  for (let i = 0; i < v.length; i++) {
    var varient = await getVarientById(v[i].varient_id);
    console.log(varient);
    varients.push(varient);
  }
  return varients;
};

// build the home page
const getHomeSlider = async () => {
  let homeSLider = await productRepository.getProductsByClicks(0);
  return homeSLider.slice(0, 10);
};

const getMostSelling = async () => {
  let products = await productRepository.getProductsBySold(0);
  return products.slice(0, 20);
};
const getMostPopular = async () => {
  let product = await productRepository.getProductsByClicks(0);
  return product.slice(0, 30);
};

const getNewProducts = async () => {
  const topArtists = await getArtistBySoldNo();
  let products = [];
  for (const artist of topArtists) {
    if (artist.products.length) products = [...products, ...artist.products];
  }

  // products.sort(async (a, b) => {
  //   const productA = await productRepository.getProductById(a);
  //   const productB = await productRepository.getProductById(b);

  //   if (!productA || !productB) {
  //     console.log(a, b);
  //   }

  //   // if (productA.created_on && productB.created_on)
  //   //   return new Date(productB.created_on) - new Date(productA.created_on);
  //   return 0;
  // });

  // products = products.slice(0, 20);

  // console.log(products);

  const p = [];
  for (const product of products) {
    const x = await productRepository.getProductById(product);
    if (x) p.push(x);
  }

  p.sort((a, b) => {
    return new Date(b.created_on) - new Date(a.created_on);
  });

  return p.slice(0, 20);
};

const getFeaturedProducts = async () => {
  const top5Artist = await getArtistBySoldNo();
  const products = [];
  for (const artist of top5Artist) {
    if (artist.products.length) {
      const ps = artist.products;
      let lp;
      for (const p of ps) {
        const prod = await productRepository.getProductById(p);
        if (
          prod &&
          (!lp || new Date(lp.created_on) < new Date(prod.created_on))
        ) {
          lp = prod;
        }
      }
      if (lp) products.push(lp);
    }
  }

  return products;
};

// register a product
const addAProduct = async (jsonObject, user_id) => {
  const categories = new Array();
  const artist = await getArtistById(user_id);

  const product = {
    product_name: jsonObject.product_name,
    categories: categories,

    artist: {
      artist_name: artist.artist_name,
      artist_followers: artist.follower_count,
      artist_id: mongoose.Types.ObjectId(artist.user_id),
    },
    description: jsonObject.description,
    clicks: 0,
    sold_no: 0,
    description: jsonObject.description,
    long_description: jsonObject.long_description,
    informationTable: {
      itemWeight: jsonObject.informationTable.itemWeight,
      packageDimensions: jsonObject.informationTable.packageDimensions,
      manufacture: jsonObject.informationTable.manufacture,
    },
    customization: jsonObject.customization,
    customization_optional: jsonObject.customization_optional,
  };

  const savedProduct = await productRepository.addAProduct(product);
  await artistService.addAProduct(artist, mongoose.mongo.ObjectId(product.id));
  return savedProduct;
};

// add varients
const addVarients = async (varients, product_id, artist_id) => {
  console.log(varients, product_id, artist_id);
  const product = await productRepository.getProductById(product_id);
  const artist = await getArtistById(artist_id);
  let saveVarients = [];
  for (var i = 0; i < varients.length; i++) {
    const varient_name = varients[i].varient_name;
    const varient_price = varients[i].varient_price;
    const varient_stocks = varients[i].varient_stocks;

    const varient = new Varients({
      product_id,
      varient_name,
      varient_price,
      varient_stocks,
    });
    const savedVarient = await varient.save();
    saveVarients.push({
      varient_id: savedVarient._id,
      varient_price: savedVarient.varient_price,
    });
  }
  product.varients = saveVarients;
  console.log("Product varients - ", product.varients);
  const savedProduct = await product.save();
  console.log("SAVED PRODUCT VARINETS - ", savedProduct.varients);
  return savedProduct;
};

// edit varients

// delete varients

// add main image
const addMainImage = async (imageFile, product_id, user_id) => {
  const savedImageUrl = await uploadProductMainImage(
    imageFile,
    user_id,
    product_id
  );
  const product = await productRepository.getProductById(product_id);
  product.main_image_url = savedImageUrl;
  const savedProduct = await product.save();
  return savedProduct;
};

const addAGiftImage = async (imageFile, user_id, product_id) => {
  const product = await productRepository.getProductById(product_id);
  const index = product.gift_image_urls.length;
  const savedImageUrl = await uploadProductImages(
    imageFile,
    user_id,
    product_id,
    index
  );
  product.gift_image_urls.push(savedImageUrl.secure_url);
  const savedProduct = await product.save();
  return savedProduct;
};

// const deleteALLImages
const deleteAllImages = async (user_id, product_id) => {
  const product = await productRepository.getProductById(product_id);
  if (!product.gift_image_urls) return true;
  const gift_images = product.gift_image_urls;
  for (var i = 0; i < gift_images.length; i++) {
    const response = await deleteProductImage(product_id, index);
    if (response.result !== "ok") {
      return false;
    }
  }
  product.gift_image_urls.clear();
  await product.save();
  return true;
};

// edit a particular gift image
// find previous image index
// edit the image
// if new image i.e. replacing no image then push

//add review

// delete a product
const deleteAProduct = async (product_id) => {
  await productRepository.deleteAProduct(product_id);
};

// update a product
const visitProduct = async (product) => {
  product.clicks++;
  const savedProduct = await productRepository.updateProduct(product);

  for (const category of product.categories) {
    const cat = await getCategoryById(category.cat_id);
    cat.clicks++;
    const savedCat = await updateCategory(cat);
  }

  return savedProduct;
};

const updateAProduct = async (jsonObject) => {
  const product = await getAProduct(mongoose.Types.ObjectId(jsonObject.id));
  const categories = new Array();
  if (tempCat)
    for (var i = 0; i < tempCat.length; i++) {
      const category = await getCategoryById(tempCat[i]);
      categories.push({
        cat_id: category.id,
        cat_name: category.cat_name,
      });
    }
  product.product_name = jsonObject.product_name;
  product.categories = categories;
  // images  { to be added}
  product.price = jsonObject.price;
  product.count_in_stock = jsonObject.count_in_stock;
  product.description = jsonObject.description;
  const updatedProduct = await productRepository.updateAProduct(product);
  return updatedProduct;
};

const addCategoriesToProducts = async (categories, product_id) => {
  const cats = await generateProductCategories(categories, product_id);
  const product = await productRepository.getProductById(product_id);
  product.categories = cats;
  const savedProduct = productRepository.updateProduct(product);
  await indexAproduct(savedProduct);
  return savedProduct;
};

// build similar products
const getSimilarProducts = async (q, pge_no) => {};
// build search results
const getSearchResults = async (q, pge_no) => {};
// build recommended products
const getRecommended = async (user_id) => {};

module.exports = {
  getAProduct,
  getRecommended,
  getHomeSlider,
  getMostPopular,
  getMostSelling,
  getSearchResults,
  updateAProduct,
  getSimilarProducts,
  addAProduct,
  addVarients,
  addMainImage,
  addAGiftImage,
  deleteAllImages,
  getVarients,
  getFeaturedProducts,
  getNewProducts,
  addCategoriesToProducts,
  deleteAProduct,
};
