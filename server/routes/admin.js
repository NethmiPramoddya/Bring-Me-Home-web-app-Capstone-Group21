const express = require("express");
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");
const Senders = require("../models/Senders");
const UserModel = require("../models/user");
const router = express.Router();


router.post("/withdraw/:traveler_user_id", async (req, res) => {
  const { traveler_user_id } = req.params;

  try {
    const wallet = await Wallet.findOne({ traveler_user_id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.can_withdrawal_amount <= 0) {
      return res.status(400).json({ message: "No funds to withdraw" });
    }

    
    wallet.actual_amount=(wallet.actual_amount-wallet.can_withdrawal_amount);
    wallet.can_withdrawal_amount = 0;
    await wallet.save();

    return res.status(200).json({ message: "Withdrawal completed successfully." });
  } catch (error) {
    console.error("Admin withdrawal error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/wallets", async (req, res) => {
  try {
    const wallets = await Wallet.find({});
    return res.status(200).json(wallets);
  } catch (error) {
    console.error("Fetch wallets error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});


//history
router.get("/wallets/:walletId/transactions", async (req, res) => {
  const { walletId } = req.params;
  try {
    const transactions = await WalletTransaction.find({ wallet_id: walletId }).populate("sender_request_id");
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Fetch wallet transactions error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find().select("name email phone location about");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
