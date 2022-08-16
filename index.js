require("./config/database");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 2000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to Lendsqr");
});

app.use("/api", require("./router/user"));
app.use("/api", require("./router/transaction"));

app.listen(port, () => {
  console.log("Listenind to port: ", port);
});
