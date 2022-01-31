const gravatar = require("gravatar");
const Users = require("./user-schema");

const getUser = async () => Users.find();
const getUserById = async (id) => Users.findById(id);
const getUserByEmail = async (email) => Users.findOne({ email });
const addUser = async ({ username, email, password, verificationToken }) => {
  const newUser = new Users({ username, email, verificationToken });

  newUser.setPassword(password);
  await newUser.updateOne({ avatarURL: gravatar.url(email) });
  await newUser.save();
  return newUser;
};

const verifyUpdateToken = async ({ token }) => {
  await Users.findOneAndUpdate({ verificationToken: token }, { verify: true });
};

const updateToken = async (id, token) => {
  await Users.updateOne({ _id: id }, { token });
};

module.exports = {
  updateToken,
  getUser,
  getUserById,
  addUser,
  getUserByEmail,
  verifyUpdateToken,
};
