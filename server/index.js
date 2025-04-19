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
            to_id:traveler.traveler_id.toString(),
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


app.post("/createTraveler",async(req,res)=>{
    try{
    const travelerData = await TravelerModel.create(req.body)

    //data needed to find matching senders
    const from_country = travelerData.depature_country;
    const to_country = travelerData.destination;
    const delivery_dt = travelerData.arrival_date;
    const travelerId = travelerData.traveler_id;

    //finding sender requests that match the traveler's route and date
    const matchingSenders = await SenderModel.find({
        fcountry:from_country,
        dcountry:to_country,
        date:{$eq:delivery_dt}
    })

    //creating notofications for the traveler from each sender
    const notifications = matchingSenders.map(sender=>{
        return{
            from_id:sender.buyer_id,
            to_id:travelerId,
            content:"A sender is looking for a traveler matching your route!",
            link: `http://localhost:5173/buyer-requests/${sender._id}`,
            dateTime: new Date(),
            status: false   
        }
    })

     // 5. Store the notifications in the DB
     if (notifications.length > 0) {
        await NotificationModel.insertMany(notifications);
      }

      // 6. Respond with success
    res.json({ success: true, travelerData });
    }catch(error){
        console.error("Error submitting traveler info:", error);
    res.status(500).json({ success: false, error: "Something went wrong!" });
    }

})


//profile

app.get("/profile/:id",async(req,res)=>{
    try{const userId = req.params.id;
    const user = await UserModel.findById(userId)
    if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
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

//More info

app.get("/more_info/:id", async (req,res)=>{
    try{
        const id = req.params.id;
        const request = await SenderModel.findById(id);
        res.json(request);
    }catch(error){
        res.status(500).json({ message: err.message });
    }
})