const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema({
    from_id:String,
    to_id:String,
    content:String,
    link:String,
    dateTime:{
        type:Date,
        default:Date.now
    },
    status:{
        type:Boolean,
        default:false
    }
});

const NotificationModel = mongoose.model("notifications",NotificationSchema);
module.exports = NotificationModel;