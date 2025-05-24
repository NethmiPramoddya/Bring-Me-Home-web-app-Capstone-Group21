const mongoose = require("mongoose");

const WalletTransactionSchema = new mongoose.Schema({
  sender_request_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "senders",
    required: true,
  },
  wallet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success"],
    default: "pending",
  },
});

const WalletTransaction = mongoose.model("WalletTransaction", WalletTransactionSchema);

 module.exports = WalletTransaction
