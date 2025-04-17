const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const SenderModel = require('./models/Senders')
const UserModel = require('./models/user')
const TravelerModel = require('./models/Traveler')


const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/send_packageinfo")

app.get('/', (req,res) => {
    SenderModel.find({})
    .then(senders => res.json(senders))
    .catch(err => res.json(err))
})

app.get('/getUser/:id', (req, res)=>{
    const id = req.params.id
    SenderModel.findById({_id:id})
    .then(senders => res.json(senders))
    .catch(err => res.json(err))
})

app.put('/editUser/:id', (req, res) => {
    const id = req.params.id
    SenderModel.findByIdAndUpdate(id, req.body, { new: true })
    .then(senders => res.json(senders))
    .catch(err => res.json(err))
})

app.post("/create",(req,res)=>{
    SenderModel.create(req.body)
    .then(senders => res.json(senders))
    .catch(err => res.json(err))
})

app.delete('/deleteRequest/:id',(req,res)=>{
    const id = req.params.id
    SenderModel.findByIdAndDelete({_id:id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
})

//Login and signUp

app.post('/login', (req,res)=>{
    const {email, password} = req.body;
    UserModel.findOne({email:email})
    .then(user =>{
        if(user){
            if(user.password===password){
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

app.post('/register',(req,res)=>{
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))

})


app.listen(3002, ()=>{
    console.log("Server is Running")
})

// traveler requests


app.post("/createTraveler",(req,res)=>{
    TravelerModel.create(req.body)
    .then(travelers => res.json(travelers))
    .catch(err => res.json(err))
})