const mailer = require("nodemailer");
require("dotenv").config();

const config = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "sermak990@gmail.com",
    pass: process.env.PASSWORD,
  },
};

const transporter = mailer.createTransport(config);

module.exports = transporter;
