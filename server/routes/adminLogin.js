const express = require("express");
const AdminUserModel = require("../models/userAdmin");
const bcrypt = require ('bcrypt')

const router = express.Router();

router.post('/', (req,res)=>{
    const {username, password} = req.body;
    const email = username;
    AdminUserModel.findOne({email:email})
    .then(user =>{
        if(user){
            //  const passwordHash = bcrypt.hashSync(req.body.password, 10)
            // const adminUserData = {
            //     email :req.body.username,
            //     password :passwordHash
            // }
            // AdminUserModel.create(adminUserData)
            const isPassowrdCorrect = bcrypt.compareSync(password, user.password)
            if(isPassowrdCorrect){
                res.json({
                    message:"Success",
                    userId: user._id,
                    email: user.email
                })
                
            }
            else{
                res.json({message:"The password is incorrect"})
            }
        }
        else{
            res.json({message:"No recored existed"})
        }
    })
})

module.exports = router;