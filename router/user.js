const express = require("express");
const router = express.Router();
const authoriseUser = require("../config/authorise");

const {
  register,
  login,
  getAllUsers,
  getOneUser,
  deleteUsers,
  fundWallet,
  withdrawFunds,
  transferFunds,
} = require("../handler/user");

router.route("/user").post(register).get(getAllUsers).delete(deleteUsers);
router.route("/user/:userId").get(getOneUser);
router.post("/user/login", login);
router.post("/user/:userId/fund-wallet", authoriseUser, fundWallet);
router.post("/user/:userId/withdraw-funds", authoriseUser, withdrawFunds);
router.post("/user/:userId/transfer-funds", authoriseUser, transferFunds);

module.exports = router;
