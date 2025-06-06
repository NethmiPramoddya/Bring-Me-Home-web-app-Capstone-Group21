const mongoose = require('mongoose')

const userSchema  =new mongoose.Schema (
    {
    name:String,
    email:String,
    phone:String,
    password:String,
    about: String,
    location: String,
}
)

const UserModel = mongoose.model("users",userSchema)

module.exports = UserModel