const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors')
const http = require ('http');
const { Server } = require('socket.io');
const SenderModel = require('./models/Senders')
const UserModel = require('./models/user')
const TravelerModel = require('./models/Traveler')
const NotificationModel = require('./models/Notification');
const paymentRouter = require('./routes/payment');
const SenderRouter = require('./routes/sender');
const MessageModel = require('./models/Masseges');
const RoomChatModel = require('./models/ChatRoom');


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/Send_a_package")

// Configure CORS
app.use(
  cors({
    origin:  [
    'http://localhost:5173',  // admin
    'http://localhost:5174'   // client
  ], // Adjust this if your frontend is hosted elsewhere
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials if needed
  })
);

app.use(bodyParser.json());

// Set up routes (payment)
app.use("/payment", paymentRouter);
app.use("", SenderRouter);

app.get('/', (req,res) => {
    SenderModel.find({ $or: [{ status: 'pending' }, { status: { $exists: false } }] })
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
        if (req.body.needsPurchase) {
            req.body.totalCost = parseFloat(req.body.itemPrice) + parseFloat(req.body.tip);
        } else {
            req.body.totalCost = parseFloat(req.body.tip);
        }
          
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
            link: `http://localhost:5174/more_info/${senderRequestId}`,
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
    .catch(err => {
        console.error("Error:", err)
        res.status(400).json(err)})

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
            link: `http://localhost:5174/more_info/${sender._id}`,
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

//accept request
app.post("/acceptRequest", async (req, res) => {
    try {
      const { requestId, travelerId } = req.body;
  
      const senderRequest = await SenderModel.findById(requestId);
      const travelerData = await TravelerModel.findOne({ 
        traveler_id: travelerId, 
        destination: senderRequest.dcountry, 
        depature_country: senderRequest.fcountry, 
        arrival_date: senderRequest.date 
      });
  
      if (!senderRequest || !travelerData) {
        return res.status(404).json({ success: false, message: "Data not found" });
      }
  
      // Double checking match again in backend
    //   return res.status(200).json({ 
    //     success: true, 
    //     message: {
    //       traveler_depature_country: travelerData.depature_country, 
    //       sender_fcountry: senderRequest.fcountry,
    //       traveler_destination: travelerData.destination,
    //       sender_dcountry: senderRequest.dcountry, 
    //       traveler_arrival_date: travelerData.arrival_date, 
    //       sender_date: senderRequest.date,
    //       traveler_travelerDate: new Date(travelerData.arrival_date).toISOString().split('T')[0],
    //       sender_senderDate: new Date(senderRequest.date).toISOString().split('T')[0]
    //     } 
    //   });
      if (
        travelerData.depature_country !== senderRequest.fcountry ||
        travelerData.destination !== senderRequest.dcountry ||
        new Date(travelerData.arrival_date).toISOString().split('T')[0] !== 
        new Date(senderRequest.date).toISOString().split('T')[0]
      ) {
        return res.status(400).json({ success: false, message: "Travel details do not match!" });
      }
      
      // Update Sender
      senderRequest.traveller_user_id = travelerData.traveler_id;
      senderRequest.travelling_form_id = travelerData._id;
      await senderRequest.save();
  
      // Update Traveler
      travelerData.sender_user_id = senderRequest.buyer_id;
      travelerData.sender_form_id = senderRequest._id;
      await travelerData.save();
  
      // Create Notification to Sender
      await NotificationModel.create({
        from_id: travelerData.traveler_id,
        to_id: senderRequest.buyer_id,
        content: "A traveler has accepted your delivery request!",
        link: `http://localhost:5174/view_more/${senderRequest._id}`, // Same as sender's my requests view
        dateTime: new Date(),
        status: false
      });
  

      await SenderModel.findByIdAndUpdate(requestId, { status: 'accepted' });
  
      res.json({ success: true });
    } catch (error) {
      console.error("Error accepting request:", error);
      res.status(500).json({ success: false, message:error.message });
    }
  });
  

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

//Request Details

// app.get("/buyer-requests/:senderRequestId", async (req,res)=>{
//     try{
//         const id = req.params.senderRequestId;
//         const request = await SenderModel.findById(id);
//         res.json(request);
//     }catch(error){
//         res.status(500).json({ message: err.message });
//     }
// })

//My Sender Requests

app.get("/mySenderRequests/:id",async(req,res)=>{
    try{const userId = req.params.id;
    const requests = await SenderModel.find({ buyer_id: userId })
    if (!requests) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(requests);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

app.delete("/deleteSenderRequest/:id", async (req, res) => {
    try {
        const deleted = await SenderModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Request not found" });
        }
        res.json({ message: "Sender request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//My traveling data

app.get("/travelingData/:id",async(req,res)=>{
    try{const userId = req.params.id;
    const travelingData = await TravelerModel.find({traveler_id: userId })
    if (!travelingData) {
        return res.status(404).json({ message: "Traveling data not found" });
      }
      res.json(travelingData);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

app.delete("/deleteTravelerData/:id", async (req, res) => {
    try {
        const deleted = await TravelerModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Request not found" });
        }
        res.json({ message: "Sender request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//view more
app.get("/view_more/:id", async (req,res)=>{
    try{
        const id = req.params.id;
        const request = await SenderModel.findById(id);
        res.json(request);
    }catch(error){
        res.status(500).json({ message: err.message });
    }
})


// Socket.io setup
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin:  [
            'http://localhost:5173',  // admin
            'http://localhost:5174'   // client
  ],
        methods: ["GET","POST"],
    },
});

io.on("connection",(Socket)=>{
    console.log(`User Connected: ${Socket.id}`);

    Socket.on("join_room", async (data)=>{
        Socket.join(data);
        console.log(`User with ID: ${Socket.id} joined room: ${data}`)


    // Send existing chat history from DB
    try {
      const messages = await MessageModel.find({ room: data }).sort({ createdAt: 1 });
      Socket.emit("chat_history", messages);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }

    });

    Socket.on("send_message",async (data)=>{
       try{
        // Save to DB
      await MessageModel.create(data);

        Socket.to(data.room).emit("receive_message",data)
       }catch(err){
         console.error("Error saving message:", err);
       }
    });

    Socket.on("disconnect",()=>{
        console.log("user Disconnected", Socket.id);
    });
});


app.post('/update_room/:id', async (req, res) => {
  const { id } = req.params;
  const { roomId, sender_user_id, traveler_user_id } = req.body;

  try {
  let chatroom = await RoomChatModel.findOne({ sender_request_id: id });

  if (chatroom) {
    // Update existing chatroom
    chatroom.roomID = roomId;
    chatroom.sender_user_id = sender_user_id;
    chatroom.traveller_user_id  = traveler_user_id;
    await chatroom.save();
  } else {
    // Create new chatroom
    await RoomChatModel.create({
      roomID: roomId,
      sender_request_id: id,
      sender_user_id,
      traveler_user_id
    });
  }

  const updatedSender = await SenderModel.findByIdAndUpdate(
      id,
      { roomId: roomId },
      { new: true }
    );

    if (!updatedSender) {
      return res.status(404).json({ message: 'Sender request not found to update roomId' });
    }

  res.status(200).json({ message: 'Room ID updated or created successfully' , updatedSender});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update or create room ID' });
  }
});

server.listen(3002, () => {
    console.log("Server with Socket.io is running on port 3002");
});


//OnGoing Tasks
app.get("/onGoingTasks/:id",async(req,res)=>{
    try{
        const userId = req.params.id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ongoingTasks = await SenderModel.find({
        traveller_user_id: userId,
        status: "accepted",
        paymentStatus: "paid",
        date: { $gte: today }
        });
    if (!ongoingTasks) {
        return res.status(404).json({ message: "ongoingTasks data not found" });
      }
      res.json(ongoingTasks);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

// receiver QR route
app.get('/receiver/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const senderTask = await SenderModel.findById(id);
    if (!senderTask) return res.status(404).send("Sender task not found");

    const traveler = await TravelerModel.findOne({ traveler_id: senderTask.traveller_user_id });
    const tname = traveler ? traveler.tname : "Unknown Traveler";

    res.json({ ...senderTask.toObject(), tname });
  } catch (err) {
    console.error("Error fetching receiver details:", err);
    res.status(500).send("Server error");
  }
});


//admin
app.get('/manageSenders', (req,res)=>{
    SenderModel.find({})
    .then(senders => res.json(senders))
    .catch(err =>res.json(err))
})