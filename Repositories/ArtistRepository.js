const { default: mongoose } = require("mongoose");
const Artist = require("../Models/user/ArtistModel");
const { getUserById } = require("./UserRepository");

// get artist by id

const getArtistById = async (artist_id) => {
  const artist = await Artist.findOne({ user_id: artist_id });
  return artist;
};

const getArtistCard = async (artist_id) => {
  const artist = await getArtistById(artist_id);
  const user = await getUserById(artist_id);
  const card = {
    artist_id: artist.artist_id,
    name: artist.artist_name,
    pfp_url: user.pfp_url,
    cover_url: artist.cover_url,
    follower_count: artist.follower_count,
  };
  return card;
};

const getArtistBySoldNo = async () => {
  const artists = await Artist.find().sort({ sold_no: "asc" }).limit(10);
  return artists;
};

// get artist by name || search

// get artist by popularity || followers

// add an artist || registration
const addAnArtist = async (artist) => {
  try {
    const savedArtist = await artist.save();
    return savedArtist;
  } catch (error) {
    console.log(error);
    return null;
  }
};
// update an artist || update profile

// delete an artist || account delete

module.exports = {
  addAnArtist,
  getArtistById,
  getArtistCard,
  getArtistBySoldNo,
};
