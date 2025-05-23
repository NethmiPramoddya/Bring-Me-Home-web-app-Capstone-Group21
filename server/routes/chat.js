const express = require('express');
const router = express.Router();
const RoomChatModel = require('../models/ChatRoom');
const MessageModel = require('../models/Masseges');
const NotificationModel = require('../models/Notification');
const SenderModel = require('../models/Senders');
const UserModel = require('../models/user');

// Get room ID by sender request ID
router.get('/room/:senderRequestId', async (req, res) => {
    try {
        const chatRoom = await RoomChatModel.findOne({ sender_request_id: req.params.senderRequestId });
        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }
        return res.status(200).json({ roomId: chatRoom.roomID });
    } catch (err) {
        console.error('Error getting room ID:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get room details by roomId
router.get('/room-details/:roomId', async (req, res) => {
    try {
        const chatRoom = await RoomChatModel.findOne({ roomID: req.params.roomId });
        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        // Get sender and traveler details
        let senderInfo = null;
        let travelerInfo = null;

        if (chatRoom.sender_user_id) {
            senderInfo = await UserModel.findById(chatRoom.sender_user_id, 'username name email');
        }

        if (chatRoom.traveler_user_id || chatRoom.traveller_user_id) {
            const travelerId = chatRoom.traveler_user_id || chatRoom.traveller_user_id;
            travelerInfo = await UserModel.findById(travelerId, 'username name email');
        }

        return res.status(200).json({
            ...chatRoom.toObject(),
            senderInfo,
            travelerInfo
        });
    } catch (err) {
        console.error('Error getting room details:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get message history
router.get('/messages/:roomId', async (req, res) => {
    try {
        const messages = await MessageModel.find({ room: req.params.roomId }).sort({ createdAt: 1 });
        return res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Mark messages as read
router.post('/messages/read', async (req, res) => {
    const { roomId, userId } = req.body;

    if (!roomId || !userId) {
        return res.status(400).json({ message: 'roomId and userId are required' });
    }

    try {
        const result = await MessageModel.updateMany({ room: roomId, receiver_id: userId, is_read: false }, { $set: { is_read: true } });

        return res.status(200).json({
            message: 'Messages marked as read',
            count: result.modifiedCount
        });
    } catch (err) {
        console.error('Error marking messages as read:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create or update room
router.post('/room', async (req, res) => {
    const { roomId, sender_request_id, sender_user_id, traveler_user_id } = req.body;
    
    if (!roomId || !sender_request_id || !sender_user_id || !traveler_user_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        let chatroom = await RoomChatModel.findOne({ sender_request_id });

        if (chatroom) {
            // Update existing chatroom
            chatroom.roomID = roomId;
            chatroom.sender_user_id = sender_user_id;
            chatroom.traveler_user_id = traveler_user_id;
            await chatroom.save();
        } else {
            // Create new chatroom
            chatroom = await RoomChatModel.create({
                roomID: roomId,
                sender_request_id,
                sender_user_id,
                traveler_user_id
            });
        }

        // Update sender model with roomId
        const updatedSender = await SenderModel.findByIdAndUpdate(
            sender_request_id, { roomId }, { new: true }
        );

        if (!updatedSender) {
            return res.status(404).json({ message: 'Sender request not found' });
        }

        return res.status(200).json({
            message: 'Chat room created/updated successfully',
            chatroom,
            updatedSender
        });
    } catch (err) {
        console.error('Error creating/updating chat room:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;