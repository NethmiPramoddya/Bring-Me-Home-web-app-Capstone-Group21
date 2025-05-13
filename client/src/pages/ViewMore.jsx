import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ViewMore() {
  const { id } = useParams();
  const [viewMore, setViewMore] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
      amount: '1005.00',
      currency: 'LKR',
      first_name: 'Saman',
      last_name: 'Perera',
      email: 'samanp@gmail.com',
      phone: '0771234567',
      address: 'No.1, Galle Road',
      city: 'Colombo',
      country: 'Sri Lanka',
    };

    try {
      // Request backend to generate the hash value
      const response = await fetch(
        'https://b42d-112-134-170-36.ngrok-free.app/payment/start',
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

        // Payment configuration
        const payment = {
          sandbox: true,
          merchant_id: merchant_id,
          return_url: 'http://localhost:3000/payment/success',
          cancel_url: 'http://localhost:3000/payment/cancel',
          notify_url: 'https://b42d-112-134-170-36.ngrok-free.app/payment/notify',
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

        // Initialize PayHere payment
        window.payhere.startPayment(payment);
      } else {
        console.error('Failed to generate hash for payment.');
        alert('Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred during payment. Please try again.');
    }
  };

  // Fetch package details
  useEffect(() => {
    axios
      .get(`http://localhost:3002/view_more/${id}`)
      .then((result) => setViewMore(result.data))
      .catch((err) => console.error('Error fetching data:', err));
  }, [id]);

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
          <p className="text-base font-medium text-gray-800">{viewMore.date}</p>
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
            {viewMore.post_date}
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

        <div className="flex justify-center pt-2">
          {viewMore.status === 'accepted' ? (
            <button
              className="bg-[rgb(48,120,22)] hover:bg-[#1e824b] w-[33.33%] mx-3 text-white py-1 px-4 rounded text-lg transition"
              id="payhere-payment"
              onClick={handlePayment}
              disabled={!scriptLoaded} // Disable button until script is loaded
            >
              💳 Pay Now
            </button>
          ) : (
            <p className="text-gray-600 w-[33.33%] mx-3 text-center">
              😔 Waiting for traveler to accept...
            </p>
          )}

          <Link
            to="/"
            className="bg-[#b33434] hover:bg-[#a12d2d] w-[33.33%] text-center text-white py-1 px-4 rounded text-lg transition"
          >
            ⬅️ Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewMore;