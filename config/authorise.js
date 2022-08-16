const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authoriseUser = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (auth) {
      const token = auth.split(" ")[1];

      if (token) {
        await jwt.verify(token, process.env.SECRET, (err, payload) => {
          if (err) {
            res.status(500).json({
              message: err.message,
            });
          } else {
            req.user = payload;
            next();
          }
        });
      } else {
        res.status(404).json({
          message: "Invalid token",
        });
      }
    } else {
      res.status(404).json({
        message: "authorization not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = authoriseUser;
