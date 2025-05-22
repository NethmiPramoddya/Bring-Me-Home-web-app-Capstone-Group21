const SenderModel = require("../models/Senders");
const express = require("express");
const crypto = require("crypto");
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");


const router = express.Router();

// Merchant details
const merchant_id = "1230370"; // Replace with your actual Merchant ID
const merchant_secret = "MTEwODI1ODM0ODI0MDY0MTg1MDQxMzk2NTQyMzcxMjIwOTgzNTU="; // Replace with your Merchant Secret

router.post("/start", (req, res) => {
  const { order_id, amount, currency } = req.body;
  console.log("Payment request for order:", order_id);
  

  // Generate the hash value
  const hash = crypto
    .createHash("md5")
    .update(
      merchant_id +
        order_id +
        amount +
        currency +
        crypto
          .createHash("md5")
          .update(merchant_secret)
          .digest("hex")
          .toUpperCase()
    )
    .digest("hex")
    .toUpperCase();

    console.log("Hash generated for order:", order_id);
    

  res.json({ hash, merchant_id });
});

// Payment notification endpoint
router.post("/notify", async (req, res) => {
  console.log("Payment notification received");

  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = req.body;

  const local_md5sig = crypto
    .createHash("md5")
    .update(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        crypto
          .createHash("md5")
          .update(merchant_secret)
          .digest("hex")
          .toUpperCase()
    )
    .digest("hex")
    .toUpperCase();

  console.log("Payment notification for order:", order_id);
  console.log("Received MD5 signature:", md5sig);
  console.log("Local MD5 signature:", local_md5sig);
  console.log("Status code:", status_code);
  if (local_md5sig === md5sig && status_code == "2") {
    try {
      const sender = await SenderModel.findById(order_id);

      if (!sender) {
        console.log("Sender not found for order:", order_id);
        return res.sendStatus(404);
      }

      const paidAmount = parseFloat(payhere_amount);
      const totalCost = sender.totalCost || 0;

      let paymentStatus = 'partial';
      if (paidAmount >= totalCost) {
        paymentStatus = 'paid';
      }

      // ✅ Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      sender.paidAmount = paidAmount;
      sender.paymentStatus = paymentStatus;
      sender.paymentDate = new Date();
      sender.deliveryOtp = otp;
      sender.deliveryStatus = 'pending'; // Mark sender request as pending
      await sender.save();

      // Wallet logic
        let wallet = await Wallet.findOne({ traveler_user_id: sender.traveller_user_id });
        if (!wallet) {
          wallet = new Wallet({
            traveler_user_id: sender.traveller_user_id,
          });
          await wallet.save();
        }

        // Create wallet transaction
        const travelerShare = sender.travelerShare || 0;

        //  Update actual_amount immediately
            wallet.actual_amount += travelerShare;
            await wallet.save();

        // Create wallet transaction
          //const travelerShare = sender.travelerShare || 0;

          const transaction = new WalletTransaction({
            sender_request_id: sender._id,
            wallet_id: wallet._id,
            amount: travelerShare,
            status: "pending", // not withdrawable yet
          });
          await transaction.save();

      console.log("Payment successful for order:", order_id);
      console.log("Generated OTP:", otp);


      if (paymentStatus === 'paid') {
        console.log(`Notify traveler (user_id: ${sender.traveller_user_id}) - Payment received.`);
        console.log(`Notify sender (email: ${sender.semail}) - Payment successful.`);
      }

      return res.sendStatus(200); // ✅ Only this one
    } catch (error) {
      console.error("Error updating sender payment:", error);
      return res.sendStatus(500);
    }
  } else {
    console.log("Payment verification failed for order:", order_id);
    return res.sendStatus(400);
  }
});


module.exports = router;
