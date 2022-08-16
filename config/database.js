const mongoose = require("mongoose");

const url = "mongodb://localhost/lendsqrWallet";

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err.message);
  });

module.exports = mongoose;
