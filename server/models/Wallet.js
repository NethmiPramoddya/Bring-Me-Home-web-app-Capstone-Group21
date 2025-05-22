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
});

module.exports = mongoose.model("Wallet", WalletSchema);
