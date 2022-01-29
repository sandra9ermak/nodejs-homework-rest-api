const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();
const User = require("../../model/user/user-schema");
const secret = process.env.SECRET;
const {
  getUserByEmail,
  addUser,
  updateToken,
} = require("../../model/user/user");

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err || req.headers.authorization !== "Bearer " + user.token) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
        data: "Unauthorized",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

router.post("/registration", async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await getUserByEmail(email);
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email in use",
      data: "Conflict",
    });
  }
  try {
    const user = await addUser({ email, password, username });
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Email or password is wrong",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
    subscription: user.subscription,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  await updateToken(user.id, token);

  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      user: {
        email: email,
        subscription: user.subscription,
      },
    },
  });
});

router.get("/logout", auth, async (req, res, next) => {
  await updateToken(req.user.id, null);
  res.status(204).end();
});

router.get("/current", auth, async (req, res, next) => {
  return res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
});

module.exports = router;
