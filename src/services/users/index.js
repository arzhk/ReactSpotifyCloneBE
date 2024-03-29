const express = require("express");
const passport = require("passport");
<<<<<<< Updated upstream
=======
const jwt = require("jsonwebtoken");

>>>>>>> Stashed changes
const UserModel = require("./schema");
const { authenticate, refresh } = require("../auth");
const { authorize } = require("../auth/middlewares");

const usersRouter = express.Router();

usersRouter.get("/", authorize, async (req, res, next) => {
  try {
    console.log(req.user);
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    console.log("Cookies: ", req.cookies);
    /*  const decoded = await jwt.verify(accessToken, process.env.JWT_SECRET);
    console.log(decoded);
    if (decoded) {
      const user = await UserModel.findById(decoded._id);
      res.send(user);
    } */
  } catch (err) {
    next(err);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

/* usersRouter.put("/me", async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    next(error);
  }
}); */

usersRouter.delete("/me", async (req, res, next) => {
  try {
    await req.user.deleteOne(res.send("Deleted"));
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    //Check credentials
    const { email, password } = req.body;

    const user = await UserModel.findByCredentials(email, password);
    //Generate token
    const tokens = await authenticate(user);

    //Send back tokens
    res.cookie("accessToken", tokens.accessToken);
    /*   res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      path: "/users/refreshToken",
    }); */

    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get("/refreshToken", async (req, res, next) => {
  try {
    // Grab the refresh token

    console.log(req.cookies);
    const oldRefreshToken = req.cookies.refreshToken;

    // Verify the token

    // If it's ok generate new access token and new refresh token

    const { accessToken, refreshToken } = await refresh(oldRefreshToken);

    // send them back

    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/spotifyLogin",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
    showDialog: true,
  })
);

usersRouter.get("/spotifyRedirect", passport.authenticate("spotify"), async (req, res, next) => {
  try {
    res.cookie("accessToken", req.user.tokens.accessToken, {
      httpOnly: true,
    });
    res.cookie("refreshToken", req.user.tokens.refreshToken, {
      httpOnly: true,
      path: "/users/refreshToken",
    });

    res.status(200).redirect("http://localhost:3000/");
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res, next) => {
    try {
      res.cookie("accessToken", req.user.tokens.accessToken, {
        httpOnly: true,
      });
      res.cookie("refreshToken", req.user.tokens.refreshToken, {
        httpOnly: true,
        path: "/users/refreshToken",
      });

      res.status(200).redirect("http://localhost:3000/");
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/facebookLogin",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

usersRouter.get(
  "/facebookRedirect",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  async (req, res, next) => {
    try {
      res.cookie("accessToken", req.user.tokens.accessToken, {
        httpOnly: true,
      });
      res.cookie("refreshToken", req.user.tokens.refreshToken, {
        httpOnly: true,
        path: "/users/refreshToken",
      });

      res.status(200).redirect("http://localhost:3000/");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = usersRouter;
