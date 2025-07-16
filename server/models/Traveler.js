const mongoose = require('mongoose')

const TravelerSchema = new mongoose.Schema({
    traveler_id: String,
    tname: String,
    temail: String,
    depature_country: String,
    destination: String,
    Luggage_space: String,
    depature_date:Date,
    arrival_date: Date,
    post_date: Date,
    note: String,
    contactinfo_d: String,
    contactinfo_a:String,
    profile1: String,
    profile2: String,
    sender_user_id: String,
    sender_form_id: String,
})


const TravelerModel = mongoose.model("travelers", TravelerSchema)
module.exports = TravelerModel