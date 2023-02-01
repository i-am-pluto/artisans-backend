const express = require("express");
const passport = require("passport");
const {
  getArtistById,
  getArtistCard,
} = require("../../Repositories/ArtistRepository");
const {
  activate_stripe,
  updateArtist,
  setCoverPic,
  getArtistPorfile,
  getBestSelling,
} = require("../../Services/ArtistService");
const AuthMiddleware = require("./AuthMiddleware");
const mongoose = require("mongoose");
const { getUserById } = require("../../Repositories/UserRepository");

const router = express.Router();

// view profile card
router.get("/:id/artistcard", async (req, res) => {
  try {
    const artist = await getArtistCard(mongoose.mongo.ObjectId(req.params.id));
    res.json(artist);
  } catch (error) {
    res.json({ success: false, message: error });
  }
});

router.get("/:id/profile", async (req, res) => {
  try {
    const profile = await getArtistPorfile(
      mongoose.mongo.ObjectId(req.params.id)
    );
    console.log(profile);
    res.json(profile);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
});

router.get("/bestselling", async (req, res) => {
  try {
    const artists = await getBestSelling();
    res.json(artists);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
});

// edit profile

router.put(
  "/:id/setcoverpic",
  AuthMiddleware.isUserAuthorOfRequest,

  async (req, res) => {
    try {
      const fileStr = req.body.data;
      // console.log(fileStr);
      console.log("here");
      await setCoverPic(fileStr, req.params.id);
      console.log("here");
      res.json({
        success: true,
        message: "image uploaded successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }
);

router.put(
  "/:id/edit",
  AuthMiddleware.isUserAuthorOfRequest,
  async (req, res) => {
    try {
      const artistbody = req.body;
      const savedArtist = await updateArtist(
        artistbody,
        mongoose.mongo.ObjectId(req.params.id)
      );
      res.json({ success: true, message: "Artist updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "something went wrong" });
    }
  }
);

// hide products from profile

// choose products to show on profile

// get all products

// get categories

router.get("/activate_stripe", AuthMiddleware.isArtist, async (req, res) => {
  const account_link = await activate_stripe(req.user.id);
  res.json({ ...account_link, success: true });
});

// get all orders sorted by date

// get profile
router.get("/:id", AuthMiddleware.isUserAuthorOfRequest, async (req, res) => {
  const artist = await getArtistById(mongoose.mongo.ObjectId(req.params.id));

  res.json(artist);
});

module.exports = router;
