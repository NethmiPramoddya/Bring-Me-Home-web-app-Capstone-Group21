const mongoose = require('mongoose')


const SendersSchema = new mongoose.Schema({
    buyer_id: String,
    sname: String,
    semail: String,
    rname: String,
    remail: String,
    plink: String,
    item:String,
    date: Date,
    fcountry: String,
    dcountry: String,
    weight: String,
    length: String,
    width: String,
    height: String,
    tip: Number,
    needsPurchase: Boolean,
    itemPrice: Number,
    totalCost: Number,
    post_date:Date,
    content: String,
    message: String,
    contactinfo_d: String,
    contactinfo_a: String,
    profile1: String,
    profile2: String,
    traveller_user_id: String,
    travelling_form_id: String,
    status: {
        type: String,
        default: 'pending', // default when first created
        enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed']
    },
    paidAmount: {
    type: Number,
    default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'partial', 'paid'],
        default: 'unpaid'
    },
    paymentDate: Date,
    roomId:String,
    deliveryOtp: {
        type: Number,
        default: null
    },
    systemShare: {
    type: Number,
    required: true
    },
    travelerShare: {
    type: Number,
    required: true
    },
    deliveryStatus:  {
        type: String,
        default: 'pending', // default when first created
        enum: ['pending', 'received']
    },



})


const SenderModel = mongoose.model("senders", SendersSchema)
module.exports = SenderModel