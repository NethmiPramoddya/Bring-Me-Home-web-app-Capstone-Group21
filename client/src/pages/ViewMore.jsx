import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const socket = io("http://localhost:3002"); 

function generateUniqueId(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length })
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('');
}

function ViewMore() {
  const { id, roomId: urlRoomId } = useParams();
  const [viewMore, setViewMore] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [storedUsername, setStoredUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState('');
  const [socketId, setSocketId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const storedRoom = localStorage.getItem('roomId');
  if (storedRoom && !roomId) {
    setRoomId(storedRoom);
    console.log("Loaded roomId from localStorage:", storedRoom);
  }
}, []);


 useEffect(() => {
  axios
    .get(`http://localhost:3002/view_more/${id}`)
    .then((result) => {
      setViewMore(result.data);
      if (result.data.paymentStatus === 'paid' && result.data.roomId) {
        setRoomId(result.data.roomId); // update state with roomId from URL
        localStorage.setItem('roomId', result.data.roomId); 
      }
    })
    .catch((err) => console.error('Error fetching data:', err));
}, [id, urlRoomId]);


    useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const uid = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    if (!isLoggedIn || isLoggedIn === "false" || !uid) {
      alert("Please log in to chat");
      return;
    }

    setUserId(uid);
    setStoredUsername(username);
  }, []);

  // Socket setup
  useEffect(() => {
    if (!viewMore?.roomId || !storedUsername) return;

    socket.connect();
    socket.emit("join_room", viewMore.roomId);
    setRoomId(viewMore.roomId);

    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Socket connected:", socket.id);
    });

   return () => {
      socket.off("connect");
    };
  }, [viewMore?.roomId, storedUsername]);

  // Load PayHere script once when component mounts
  useEffect(() => {
    const payhereScript = document.createElement('script');
    payhereScript.src = 'https://www.payhere.lk/lib/payhere.js';
    payhereScript.async = true;
    payhereScript.onload = () => setScriptLoaded(true); // Set flag when script loads
    payhereScript.onerror = () => console.error('Failed to load PayHere script');
    document.body.appendChild(payhereScript);

    // Cleanup: Remove script when component unmounts
    return () => {
      document.body.removeChild(payhereScript);
    };
  }, []);



  const handlePayment = async () => {
    if (!scriptLoaded || !window.payhere) {
      console.error('PayHere script not loaded yet');
      alert('Payment gateway is not ready. Please try again later.');
      return;
    }

    const paymentDetails = {
      order_id: viewMore._id,
      amount: viewMore.totalCost.toFixed(2),
      currency: 'USD',
      first_name: viewMore.sname,
      last_name: '',
      email: viewMore.semail,
      phone: '0771234567',
      address: 'No.1, Galle Road',
      city: 'Colombo',
      country: viewMore.fcountry,
    };

    try {
      // Request backend to generate the hash value
      const response = await fetch(
        'https://ee89-2402-4000-2310-3ca9-f162-1520-476-c642.ngrok-free.app/payment/start',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentDetails),
        }
      );

      if (response.ok) {
        const { hash, merchant_id } = await response.json();

        const newRoomId = generateUniqueId(16); // generate roomId
        setRoomId(newRoomId);
        localStorage.setItem('roomId', newRoomId);

        // Save roomId in backend
       await axios.post(`http://localhost:3002/chat/room`, {
          roomId: newRoomId,
          sender_request_id:viewMore._id,
          sender_user_id: viewMore.buyer_id,       // Replace with correct field
          traveler_user_id: viewMore.traveller_user_id    // Replace with correct field
        });


        // Payment configuration
        const payment = {
          sandbox: true,
          merchant_id: merchant_id,
          return_url: `http://localhost:3002/payment/success`,
          cancel_url: 'http://localhost:3002/payment/cancel',
          notify_url: 'https://ee89-2402-4000-2310-3ca9-f162-1520-476-c642.ngrok-free.app/payment/notify',
          order_id: paymentDetails.order_id,
          items: viewMore.item,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          first_name: paymentDetails.first_name,
          last_name: paymentDetails.last_name,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          address: paymentDetails.address,
          city: paymentDetails.city,
          country: paymentDetails.country,
          hash: hash,
        };

        // Initializing PayHere payment
        window.payhere.startPayment(payment);
        
            setViewMore((prev) => ({
              ...prev,
              paymentStatus: 'paid',
              roomId: newRoomId,
            }));
            setRoomId(newRoomId);
      } else {
        console.error('Failed to generate hash for payment.');
        alert('Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred during payment. Please try again.');
    }
  };

  const handleChat = async () => {
    
    localStorage.setItem('currentViewMoreId', viewMore._id);
    
    if (!roomId && viewMore) {
      try {
        //  checking  roomId in the viewMore
        if (viewMore.roomId) {
          setRoomId(viewMore.roomId);
          localStorage.setItem('roomId', viewMore.roomId);
          navigate(`/chat/${viewMore.roomId}`);
          return;
        }
        
        
        const res = await axios.get(`http://localhost:3002/view_more/${viewMore._id}`);
        if (res.data?.roomId) {
          setRoomId(res.data.roomId);
          localStorage.setItem('roomId', res.data.roomId);
          navigate(`/chat/${res.data.roomId}`);
          return;
        }
        
        // If still no roomId, check if there's a chat room for this sender request
        const roomResponse = await axios.get(`http://localhost:3002/chat/room/${viewMore._id}`);
        if (roomResponse.data?.roomId) {
          setRoomId(roomResponse.data.roomId);
          localStorage.setItem('roomId', roomResponse.data.roomId);
          navigate(`/chat/${roomResponse.data.roomId}`);
          return;
        }
        
        // If no room exists 
        if (viewMore.status === 'accepted' || viewMore.paymentStatus === 'paid') {
          const newRoomId = generateUniqueId(16);
          try {
            await axios.post(`http://localhost:3002/update_room/${viewMore._id}`, {
              roomId: newRoomId,
              sender_user_id: viewMore.buyer_id,
              traveler_user_id: viewMore.traveller_user_id
            });
            
            setRoomId(newRoomId);
            localStorage.setItem('roomId', newRoomId);
            navigate(`/chat/${newRoomId}`);
            return;
          } catch (createErr) {
            console.error("Failed to create chat room:", createErr);
            alert("Unable to create chat room. Please try again.");
            return;
          }
        } else {
          alert("You can only chat after the traveler has accepted your request.");
          return;
        }
      } catch (err) {
        console.error("Error accessing chat room:", err);
        alert("Unable to access chat. Please try again.");
        return;
      }
    }

    
    if (roomId) {
      navigate(`/chat/${roomId}`);
    } else {
      alert("Chat is not available. Please try again later.");
    }
  };


  if (!viewMore) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <h2 className="text-3xl font-bold mx-10 my-5 text-center text-[#b33434]">
        My Package Details
      </h2>
      <div className="bg-white shadow-md rounded-lg p-6 border mx-10 border-[#b33434]/30 flex-col justify-center">
        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            🔗 Item Purchase Link
          </div>
          <p className="text-base font-medium text-gray-800">{viewMore.plink}</p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            🎁 Item in Brief
          </div>
          <p className="text-base font-medium text-gray-800">{viewMore.item}</p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            📅 Delivery Date
          </div>
            <p className="text-base font-medium text-gray-800">{new Date(viewMore.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            🌍 Country From
          </div>
          <p className="text-base font-medium text-gray-800">
            {viewMore.fcountry}
          </p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            📍 Destination
          </div>
          <p className="text-base font-medium text-gray-800">
            {viewMore.dcountry}
          </p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            🕒 Current Date
          </div>
          <p className="text-base font-medium text-gray-800">
            {new Date(viewMore.post_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          </p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            ⚖️ Weight (kg)
          </div>
          <p className="text-base font-medium text-gray-800">
            {viewMore.weight}
          </p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            📏 Length (cm)
          </div>
          <p className="text-base font-medium text-gray-800">
            {viewMore.length}
          </p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            📐 Width (cm)
          </div>
          <p className="text-base font-medium text-gray-800">{viewMore.width}</p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            📦 Height (cm)
          </div>
          <p className="text-base font-medium text-gray-800">
            {viewMore.height}
          </p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            🧳 Package Content
          </div>
          <p className="text-base font-medium text-gray-800">
            {viewMore.content}
          </p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            📝 Special Instructions
          </div>
          <p className="text-base font-medium text-gray-800">
            {viewMore.message}
          </p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            💵 Total payment (US$)
          </div>
          <p className="text-base font-medium text-gray-800">
            {viewMore.totalCost}
          </p>
        </div>

        <div className="flex items-center mb-3 space-x-2">
          <div className="text-sm font-semibold text-[#b33434]">
            🔐 Delivery OTP 
          </div>
          <p className="text-base font-medium text-gray-800">
            {viewMore.deliveryOtp}
          </p>
        </div>
        <div className="p-4 mb-2 border border-blue-300 rounded-xl bg-blue-50">
            <p className="font-medium text-blue-700">
               Please share this package OTP only with the receiver 
            </p>
          </div>
          <div className="p-4 mb-3 border border-red-300 rounded-xl bg-red-50">
            <p className="font-medium text-red-600">
               Force receiver to scan QR and enter correct OTP 
            </p>
          </div>


        <div className="flex justify-center pt-2">
          {viewMore.paymentStatus === 'paid'? (
            <>
              <button
                className="w-1/3 px-4 py-1 mx-3 text-lg text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={handleChat}
              >
                💬 Chat with Traveler
              </button>
              
            </>
          ) : viewMore.status === 'accepted' ? (
            <button
              className="w-1/3 px-4 py-1 mx-3 text-lg text-white bg-green-600 rounded hover:bg-green-700"
              onClick={handlePayment}
              disabled={!scriptLoaded}
            >
              💳 Pay Now
            </button>
          ) : (
            <p className="w-1/3 mx-3 text-center text-gray-600">
              😔 Waiting for traveler to accept...
            </p>
          )}
          <Link
            to="/"
            className="bg-[#b33434] hover:bg-[#a12d2d] w-1/3 text-center text-white py-1 px-4 rounded text-lg"
          >
            ⬅️ Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewMore;