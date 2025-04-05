const mongoose = require('mongoose')

const SendersSchema = new mongoose.Schema({

    sname: String,
    semail: String,
    rname: String,
    remail: String,
    plink: String,
    item:String,
    date: Date,
    fcountry: String,
    dcountry: String,
    details: String,
    message: String,
    contactinfo: String,
    profile1: String,
    profile2: String
})


const SenderModel = mongoose.model("senders", SendersSchema)
module.exports = SenderModel