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
    weight: String,
    length: String,
    width: String,
    height: String,
    post_date:Date,
    content: String,
    message: String,
    contactinfo_d: String,
    contactinfo_a: String,
    profile1: String,
    profile2: String
})


const SenderModel = mongoose.model("senders", SendersSchema)
module.exports = SenderModel