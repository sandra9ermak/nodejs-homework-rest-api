const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require("dotenv").config();

mongoose.connect(process.env.DB_HOST_REMOTE, function (error) {
  if (error) {
    console.log(error);
    process.exit(1);
  }
  console.log("Database connection successful");
});

module.exports = mongoose;
