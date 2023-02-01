const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const artistSchema = new Schema({
  user_id: {
    type: mongoose.mongo.ObjectId,
    unique: true,
    required: true,
    ref: "User",
  },
  artist_name: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
  },
  follower_count: { type: Number, default: 0 },

  products: [
    {
      type: mongoose.mongo.ObjectId,
      ref: "Products",
    },
  ],

  // artist profile picture
  // artist cover picture
  cover_url: String,

  socials: {
    instagram: String,
    facebook: String,
    twitter: String,
    pinterest: String,
    youtube: String,
  },

  followers: [
    {
      type: mongoose.mongo.ObjectId,
      ref: "User",
    },
  ],

  sold_no: {
    type: Number,
    default: 0,
  },
});

artistSchema.index(
  {
    artist_name: "text",
  },
  {
    weights: {
      artist_name: 25,
    },
  }
);

const Artist = mongoose.model("Artist", artistSchema);
module.exports = Artist;
