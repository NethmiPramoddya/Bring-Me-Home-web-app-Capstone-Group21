const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const SenderModel = require('./models/Senders')
const UserModel = require('./models/user')
const TravelerModel = require('./models/Traveler')
const NotificationModel = require('./models/Notification');



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

app.post("/create",async(req,res)=>{
    try{
    const senderData =await SenderModel.create(req.body)
    const from_country = senderData.fcountry;
    const to_country = senderData.dcountry;
    const delivery_date = new Date(senderData.date);


    const senderId = senderData.buyer_id;
    const senderRequestId = senderData._id;

    const matchingTravelers = await TravelerModel.find({
        depature_country:from_country,
        destination:to_country,
        arrival_date:{$eq:delivery_date}
    });

    const notifications = matchingTravelers.map(traveler=>{
        return{
            from_id:senderId,
            to_id:traveler._id.toString(),
            content: "You have a new buyer request",
            link: `http://localhost:5173/buyer-requests/${senderRequestId}`,
            dateTime: new Date(),
            status: false
        }
    })
        // 6. Save all notifications to DB (if any)
    if (notifications.length > 0) {
        await NotificationModel.insertMany(notifications);
      }

      // 7. Return success
    res.json({ success: true, senderData });

    } catch(error){
        console.error("Error submitting sender request:", error);
        res.status(500).json({ success: false, error: "Something went wrong!" });
    }
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
    .then(user => res.status(201).json({
            userId: user._id,
            email: user.email,
            phone: user.phone, 
    }))
    .catch(err => res.status(400).json(err))

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


//profile

app.get("/profile/:id",(req,res)=>{
    const userId = req.params.id
    UserModel.findById(userId)
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

//Notifications

app.get('/notifications/:userId',async(req,res)=>{
    try{
        const userId = req.params.userId;
        console.log('Received userId:', userId);
        const notifications = await NotificationModel.find({to_id:userId}).sort({dateTime:-1});
        console.log('Notifications found:', notifications);
        res.json(notifications);
    }catch(error){
        console.error("Error fetching notifications:",error);
        res.status(500).json({error:"something went wrong"})
    }
})