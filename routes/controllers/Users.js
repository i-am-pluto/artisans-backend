const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../../Models/user/User");
const {
  genPassword,
  markUserCustomer,
  markUserArtist,
} = require("../../Services/UserService");
const cloudinary = require("../../config/cloudinary");
const userService = require("../../Services/UserService");
const AuthMiddleware = require("./AuthMiddleware");
const customerService = require("./../../Services/CustomerService");

const router = express.Router();

router.get("/", AuthMiddleware.isAuth, async (req, res) => {
  try {
    const user = await userService.getUserById(
      mongoose.mongo.ObjectId(req.user.id)
    );
    res.json(user);
  } catch (Err) {
    const response = { success: false, message: error };
    res.json(response);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureMessage: true,
    failureRedirect: "/api/user/login-failure",
  }),
  (req, res, next) => {
    res.json({
      message: "You Were Successfully Logged in To Your Account",
      success: true,
    });
  }
);

router.get("/login-failure", (req, res) => {
  res
    .status(401)
    .json({ message: "Invalid Username or Password", success: false });
  res.end();
});

router.post("/register", async (req, res, next) => {
  const genP = genPassword(req.body.password);

  const salt = genP.salt;
  const hash = genP.hash;

  const newuser = new User({
    name: {
      f_name: req.body.name.f_name,
      l_name: req.body.name.l_name,
    },

    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    artist: req.body.artist,
    customer: req.body.customer,
    username: req.body.username,
    hash: hash,
    salt: salt,
  });
  try {
    console.log("hi");
    await newuser.save();
    try {
      if (newuser.artist && newuser.customer) {
        const artist = await markUserArtist(newuser._id);
        await markUserCustomer(newuser._id);
        res.json({
          message: "Succesfully Created Your Account",
          success: true,
          url: artist.url,
        });
      } else if (saveduser.artist) {
        const artist = await markUserArtist(newuser._id);
        res.json({
          message: "Succesfully Created Your Account",
          success: true,
          url: artist.url,
        });
      } else if (saveduser.customer) {
        const customer = await markUserCustomer(newuser._id);

        res.json({
          message: "Succesfully Created Your Account",
          success: true,
        });
      }
    } catch (error) {
      console.log(error);
      console.log(0);
      await User.findById(newuser._id).remove();
      res.json({
        message: `1. Failed to create the Account: ${error}`,
        success: false,
      });
      res.end();
    }
  } catch (error) {
    console.log(1);
    res.json({
      message: `2. Failed to create the Account: ${error}`,
      success: false,
    });
    res.end();
  }
});

router.get("/logout", AuthMiddleware.isAuth, (req, res, next) => {
  req.logout((err) => {
    res.json({ message: "Logged out", success: "true" });
    // res.redirect("/");
  });
});

router.get(
  "/:id/role",
  AuthMiddleware.isUserAuthorOfRequest,
  async (req, res, next) => {
    const user = await userService.getUserById(
      mongoose.mongo.ObjectId(req.params.id)
    );
    if (user)
      res.json({
        message: "Successfully retrieved the request.",
        success: true,
        artist: user.artist,
        customer: user.customer,
      });
    else
      res.json({
        message: "Successfully retrieved the request.",
        success: false,
      });
  }
);

router.get(
  "/:id/markusercustomer",
  AuthMiddleware.isUserAuthorOfRequest,
  async (req, res, next) => {
    const user = await userService.markUserCustomer(
      mongoose.mongo.ObjectId(req.params.id)
    );
    if (user.customer) {
      res.json({
        message: "successfully marked the user as a customer",
        success: true,
      });
    } else {
      res.json({
        message: "Failed To mark the user as a Customer",
        success: false,
      });
    }
  }
);
router.get(
  "/:id/markuserartist",
  AuthMiddleware.isUserAuthorOfRequest,
  async (req, res, next) => {
    const user = await userService.markUserArtist(
      mongoose.mongo.ObjectId(req.params.id)
    );
    if (user.artist) {
      res.json({
        message: "successfully marked the user as a customer",
        success: true,
      });
    } else {
      res.json({
        message: "Failed To mark the user as a Customer",
        success: false,
      });
    }
  }
);

router.post(
  "/:id/setprofilepic",
  AuthMiddleware.isUserAuthorOfRequest,

  async (req, res) => {
    try {
      const fileStr = req.body.data;
      // console.log(fileStr);
      await userService.setProfilePic(fileStr, req.params.id);
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
  async (req, res, next) => {
    try {
      const newUser = req.body;
      const savedUser = await userService.updateUser(
        newUser,
        mongoose.mongo.ObjectId(req.params.id)
      );
      res.json({ success: true, message: "User Updated Succesfully" });
    } catch (err) {
      res.json({ success: false, message: err });
    }
  }
);

router.put(
  "/:id/editaddress",
  AuthMiddleware.isUserAuthorOfRequest,
  async (req, res) => {
    try {
      const newAddress = req.body;
      const savedUser = await userService.updateAddress(
        newAddress,
        mongoose.mongo.ObjectId(req.params.id)
      );
      res.json({ success: true, message: "User Updated Succesfully" });
    } catch (err) {
      res.json({ success: false, message: err });
    }
  }
);

module.exports = router;
