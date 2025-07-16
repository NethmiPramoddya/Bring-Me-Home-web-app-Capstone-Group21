const mongoose = require('mongoose');

const ChatroomSchema = new mongoose.Schema({
  roomID: String,
  sender_request_id: String,
  sender_user_id: String,
  traveler_user_id: String,
}, { timestamps: true });

const RoomChatModel = mongoose.model('roomchat', ChatroomSchema);

module.exports = RoomChatModel;
