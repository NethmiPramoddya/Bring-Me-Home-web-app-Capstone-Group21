const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  traveler_user_id: {
    type: String,
    required: true,
    unique: true,
  },
  actual_amount: {
    type: Number,
    default: 0,
  },
  can_withdrawal_amount: {
    type: Number,
    default: 0,
  },

  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    branch: { type: String },
  },
});

const WalletModel= mongoose.model("Wallet", WalletSchema);

module.exports = WalletModel