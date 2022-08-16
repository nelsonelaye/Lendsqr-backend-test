# Lendsqr - Backend Assesement Test

## Description

An API system to allows users create an account, fund their wallet, withdraw funds and transfer funds to another user's account

| HTTP Method | URL                               | action                                                         |
| ----------- | --------------------------------- | -------------------------------------------------------------- |
| GET         | /api/user                         | Gets the list of all registered users                          |
| GET         | /api/user/[userId]                | Gets the user with [userId]                                    |
| POST        | /api/user/                        | Registers a new user                                           |
| POST        | /api/user/login                   | Login a registered user and generate Access Token              |
| POST        | /api/user/[userId]/fund-wallet    | Allows user with [userId] to fund their wallet with cash       |
| POST        | /api/user/[userId]/withdraw-funds | Allows user with [userId] to withdraw funds from their balance |
| POST        | /api/user/[userId]/transfer-funds | Allows user with [userId] to transfer funds to another user    |
| GET         | /api/transaction                  | Gets the list of all transactions processed on the system      |
| GET         | /api/transaction/[transactionId]  | Gets a processed transaction with [transactionId]              |

The technologies used include NodeJs, Express, MongoDB, JSON web token, Bcrypt, @hapi/joi (for user vaidation).
