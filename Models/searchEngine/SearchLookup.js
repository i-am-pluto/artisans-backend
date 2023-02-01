const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchLookupSchema = new Schema({
  p_name: String,
  p_id: mongoose.mongo.ObjectId,
  artist_name: String,
  artist_id: mongoose.mongo.ObjectId,
  categories: [String],
  price: Number,
});

searchLookupSchema.index(
  {
    p_name: "text",
    artist_name: "text",
    categories: "text",
  },
  {
    p_name: "50",
    artist_name: "25",
    categories: "1",
  }
);

const SearchLookup = mongoose.model("SearchLookup", searchLookupSchema);
module.exports = SearchLookup;
