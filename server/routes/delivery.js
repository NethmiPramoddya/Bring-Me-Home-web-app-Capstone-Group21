const express = require("express");
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");
const SenderModel = require("../models/Senders");

const router = express.Router();

router.post("/verify-otp", async (req, res) => {
  const { sender_request_id, enteredOtp } = req.body;

  try {
    const sender = await SenderModel.findById(sender_request_id);

    if (!sender) {
      return res.status(404).json({ message: "Sender request not found" });
    }

    if (sender.deliveryStatus === "received") {
      return res.status(400).json({ message: "OTP already verified. Delivery confirmed." });
    }

    if (sender.deliveryOtp.toString().trim() !== enteredOtp.toString().trim()) {
        return res.status(400).json({ message: "Invalid OTP" });
        }


   
    sender.deliveryStatus = "received";
    //sender.status = "delivered"; /
    await sender.save();

    
    const transaction = await WalletTransaction.findOne({
      sender_request_id: sender._id,
      status: "pending",
    });

    if (!transaction) {
      return res.status(404).json({ message: "Wallet transaction not found" });
    }

    //  Update wallet
    const wallet = await Wallet.findById(transaction.wallet_id);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    //wallet.actual_amount += transaction.amount;
    wallet.can_withdrawal_amount += transaction.amount;
    await wallet.save();

    
    transaction.status = "success";
    await transaction.save();

    return res.status(200).json({ message: "Delivery confirmed. Wallet updated." });
  } catch (error) {
  console.error("OTP verification error:", error.message);
  console.error(error.stack);
  return res.status(500).json({ message: "Internal server error" });
}

});

module.exports = router;