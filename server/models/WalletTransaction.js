const mongoose = require("mongoose");

const WalletTransactionSchema = new mongoose.Schema({
  sender_request_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sender",
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

module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);
