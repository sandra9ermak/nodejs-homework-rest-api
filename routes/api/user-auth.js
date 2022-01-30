const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const fs = require("fs").promises;
const multer = require("../../multer");
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
        avatarURL: gravatar.url(`${user.email}`),
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
    avatarURL: req.user.avatarURL,
  });
});

router.patch("/avatars", multer.single("picture"), async (req, res, next) => {
  const { description } = req.body;
  const { path: temporaryName, originalname } = req.file;
  const newPathName = path.join(
    process.cwd(),
    `public/avatars/${uuidv4()}_${originalname}`
  );

  Jimp.read(temporaryName, async (err, storeImage) => {
    if (err) throw err;
    storeImage
      .resize(250, 250) // resize
      .quality(60) // set JPEG quality
      .write(newPathName); // save
    await fs.unlink(temporaryName);
  });

  res.json({ description, message: "Файл успешно загружен", status: 200 });
});

module.exports = router;
