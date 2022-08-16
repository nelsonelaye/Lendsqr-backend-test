const userModel = require("../model/user");
const transactionModel = require("../model/transaction");
const { validateUser } = require("../config/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const viewAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find();

    res.status(200).json({
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const viewOneTransaction = async (req, res) => {
  try {
    const transaction = await transactionModel.findById(
      req.params.transactionId
    );

    if (transaction) {
      res.status(200).json({
        data: transaction,
      });
    } else {
      res.status(200).json({
        message: "Transaction not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  viewAllTransactions,
  viewOneTransaction,
};
