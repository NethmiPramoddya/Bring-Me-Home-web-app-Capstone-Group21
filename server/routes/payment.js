const SenderModel = require("../models/Senders");
const express = require("express");
const crypto = require("crypto");
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");
const NotificationModel = require("../models/Notification");
require('dotenv').config();

const router = express.Router();

// Merchant details
const merchant_id = "1230370"; 
const merchant_secret = process.env.MERCHANT_SECRET; 

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

      //  6-digit OTP
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

        
        const travelerShare = sender.travelerShare || 0;

        if(sender.itemPrice!=null){
          itemPrice=sender.itemPrice;
        }else{
          itemPrice=0;
        }
        transactionAmount=(travelerShare+(itemPrice));
        wallet.actual_amount += transactionAmount;
        await wallet.save();

        const transaction = new WalletTransaction({
          sender_request_id: sender._id,
          wallet_id: wallet._id,
          amount: transactionAmount,
          status: "pending", 
        });
        await transaction.save();

      console.log("Payment successful for order:", order_id);
      console.log("Generated OTP:", otp);


      if (paymentStatus === 'paid') {
        //  notification for the traveler
          try {
              await NotificationModel.create({
                  from_id: sender.buyer_id,
                  to_id: sender.traveller_user_id,
                  content: `${sender.sname} paid $ ${transactionAmount} for deliver ${sender.item}`,
                  link: `/onGoingTasks/${sender.traveller_user_id}`,
                  dateTime: new Date(),
                  status: false
              });
          } catch (notifyErr) {
              console.error("Error creating notification:", notifyErr);
              
          }
      }

      return res.sendStatus(200); 
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
