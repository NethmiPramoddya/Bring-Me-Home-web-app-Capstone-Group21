const mongoose = require('mongoose')

const userSchema  =new mongoose.Schema ({
    email:String,
    password:String,
})

const AdminUserModel = mongoose.model("adminUsers",userSchema)

module.exports = AdminUserModel