const express = require("express");
const router = express.Router();
// const authoriseUser = require("../config/authorise");
const {
  viewAllTransactions,
  viewOneTransaction,
} = require("../handler/transaction");

router.route("/transaction").get(viewAllTransactions);
router.route("/transaction/:transactionId").get(viewOneTransaction);

module.exports = router;
