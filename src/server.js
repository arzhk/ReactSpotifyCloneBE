const express = require("express");
const cors = require("cors");
const { join } = require("path");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const usersRouter = require("./services/users");
<<<<<<< Updated upstream
const spotifyOauth = require("./services/auth/spotifyOauth");
const gooleOauth = require("./services/auth/googleOauth");
const facebookOauth = require("./services/auth/facebookOauth");

const {
  notFoundHandler,
  forbiddenHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");
=======
const oauth = require("./services/auth/oauth");

const { notFoundHandler, forbiddenHandler, badRequestHandler, genericErrorHandler } = require("./errorHandlers");
>>>>>>> Stashed changes

const server = express();

const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

server.use(cors(corsOptions));
const port = process.env.PORT;

<<<<<<< Updated upstream
const staticFolderPath = join(__dirname, "../public");
server.use(express.static(staticFolderPath));
=======
>>>>>>> Stashed changes
server.use(express.json());
server.use(cookieParser());
server.use(passport.initialize());

server.use("/users", usersRouter);

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port);
    })
  )
  .catch((err) => console.log(err));
