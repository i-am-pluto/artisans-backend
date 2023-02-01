const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchRecommendationSchema = new Schema({
  searchTerm: String,
});

const SearchRecommendation = mongoose.model(
  "SearchRecommendation",
  searchRecommendationSchema
);
module.exports = SearchRecommendation;
