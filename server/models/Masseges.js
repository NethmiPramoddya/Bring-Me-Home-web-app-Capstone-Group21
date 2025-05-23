const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: String,
  author: String,
  sender_id: String,
  receiver_id: String,
  message: String,
  time: String,
  is_read: { type: Boolean, default: false }
}, { timestamps: true });

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
