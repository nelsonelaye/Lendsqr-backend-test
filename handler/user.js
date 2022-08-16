const userModel = require("../model/user");
const transactionModel = require("../model/transaction");
const { validateUser } = require("../config/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json({
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await (
      await userModel.findById(req.params.userId)
    ).populate("transactions");

    if (user) {
      res.status(200).json({
        data: user,
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { error } = validateUser(req.body);

    if (error) {
      res.status(400).json({
        message: error.details[0].message,
      });
    } else {
      const checkMail = await userModel.findOne({ email: email });

      if (checkMail) {
        res.status(400).json({
          message: "user with this mail already exist",
        });
      } else {
        const salt = await bcrypt.genSalt(16);
        const hashed = await bcrypt.hash(password, salt);

        const user = await userModel.create({
          firstName,
          lastName,
          email,
          password: hashed,
        });

        res.status(201).json({
          status: "Successful",
          data: user,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    if (user) {
      const compare = await bcrypt.compare(password, user.password);

      if (compare) {
        const { password, ...restData } = user._doc;

        const token = await jwt.sign(
          {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          process.env.SECRET,
          { expiresIn: "1d" }
        );
        res.status(200).json({
          status: "Successful",
          data: { token, ...restData },
        });
      } else {
        res.status(400).json({
          message: "password is incorrect",
        });
      }
    } else {
      res.status(400).json({
        message: "user not found/email is incorrect",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const fundWallet = async (req, res) => {
  try {
    const { amount, note } = req.body;

    const user = await userModel.findById(req.params.userId);

    if (user) {
      const transaction = new transactionModel({
        title: "Deposit",
        amount: amount,
        note: note,
      });

      const userNewBalance = user.balance + amount;
      // console.log(typeOf,userNewBalance )
      await userModel.findByIdAndUpdate(
        user._id,
        { balance: userNewBalance },
        { new: true }
      );

      transaction.user = user;
      transaction.save();

      user.transactions.push(mongoose.Types.ObjectId(transaction._id));
      user.save();

      res.status(201).json({
        data: transaction,
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const withdrawFunds = async (req, res) => {
  try {
    const { amount, note } = req.body;

    const user = await userModel.findById(req.params.userId);

    if (user) {
      const currentBalance = user.balance;

      if (currentBalance < amount) {
        res.status(400).json({
          message: `Insuffucient funds. Total Balance: ${currentBalance}`,
        });
      } else {
        const transaction = new transactionModel({
          title: "Withdrawal",
          amount: amount,
          note: note,
        });

        await userModel.findByIdAndUpdate(
          user._id,
          {
            balance: currentBalance - amount,
          },
          { new: true }
        );

        transaction.user = user;
        transaction.save();

        user.transactions.push(mongoose.Types.ObjectId(transaction._id));
        user.save();

        res.status(201).json({
          status: "Successful",
          data: transaction,
        });
      }
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const transferFunds = async (req, res) => {
  try {
    const { amount, receiverId, note } = req.body;
    const sender = await userModel.findById(req.params.userId);

    if (sender) {
      const receiver = await userModel.findById(receiverId);

      if (receiver) {
        if (sender.balance >= amount) {
          const transaction = new transactionModel({
            title: "Transfer",
            amount: amount,
            note: note,
          });

          transaction.to = receiver;
          transaction.user = sender;
          transaction.save();

          const receiverBalance = receiver.balance + amount;
          await userModel.findByIdAndUpdate(
            receiverId,
            { balance: receiverBalance },
            { new: true }
          );

          receiver.transactions.push(mongoose.Types.ObjectId(transaction._id));
          receiver.save();

          const senderBalance = sender.balance - amount;
          await userModel.findByIdAndUpdate(
            sender._id,
            { balance: senderBalance },
            { new: true }
          );

          sender.transactions.push(mongoose.Types.ObjectId(transaction._id));
          sender.save();

          res.status(201).json({
            status: "Successful",
            data: transaction,
          });
        } else {
          res.status(400).json({
            message: "Insufficient funds",
          });
        }
      } else {
        res.status(404).json({
          message: "fund receiver not found",
        });
      }
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// const deleteUsers = async (req, res) => {
//   try {
//     await userModel.deleteMany();

//     res.status(204).json({
//       message: "users deleted",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

module.exports = {
  register,
  login,
  getAllUsers,
  getOneUser,
  fundWallet,

  withdrawFunds,
  transferFunds,
};
