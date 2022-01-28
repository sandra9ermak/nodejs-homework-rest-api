const mongoose = require("./mongoDB");
const Schema = mongoose.Schema;

const contacts = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.ObjectId,
    ref: "user",
  },
});

const Contacts = mongoose.model("contact", contacts);

module.exports = Contacts;
