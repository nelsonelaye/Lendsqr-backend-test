const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    note: {
      type: String,
    },
    amount: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transactions", transactionSchema);
