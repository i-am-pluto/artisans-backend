const express = require("express");
const path = require("path");
const crypto = require("crypto");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const routes = require("./routes");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { retrieveSession } = require("./Services/StripeAccnt");
const { getOrderByPaymentIntent } = require("./Services/OrderService");
const { removeProductFromCart } = require("./Repositories/CartRepository");
const cartService = require("./Services/CartService");
const artistService = require("./Services/ArtistService");
const { indexAllProducts } = require("./Services/SearchEngineService");
const {
  generateAllRecommendations,
} = require("./Repositories/SearchRecommendationRepository");

require("dotenv").config();
const app = express();
connectDB();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});

/**
 * -------------- SESSION SETUP ----------------
 */

app.use(
  session({
    secret: "secret temp",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.DB_HOST}:${process.env.DB_PASS}@cluster0.ojndtwk.mongodb.net/?retryWrites=true&w=majority`,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);
app.use(cookieParser("secret temp"));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

const port = 5000;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
