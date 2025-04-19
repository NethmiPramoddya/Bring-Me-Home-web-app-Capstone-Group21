import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useParams,Link } from 'react-router-dom';


function MoreInfo() {
    const { id } = useParams();
    const [info, setInfo] =useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3002/more_info/${id}`)
          .then(result => setInfo(result.data))
          .catch(err => console.log(err))
      }, [id]);

      if (!info) return <p className="mt-10 text-center">Loading...</p>;


  return (
    <div className="min-h-screen py-10 bg-gray-50">
         <h2 className="text-3xl font-bold mx-10 my-5 text-center text-[#b33434]">Package Info Summary</h2>
     <div className="bg-white shadow-md rounded-lg p-6 border mx-10 border-[#b33434]/30 flex-col justify-center">
            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">🔗 Item Purchase Link</div>
                <p className="text-base font-medium text-gray-800">{info.plink}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">🎁 Item in Brief</div>
                <p className="text-base font-medium text-gray-800">{info.item}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">📅 Delivery Date</div>
                <p className="text-base font-medium text-gray-800">{info.date}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">🌍 Country From</div>
                <p className="text-base font-medium text-gray-800">{info.fcountry}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">📍 Destination</div>
                <p className="text-base font-medium text-gray-800">{info.dcountry}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">🕒 Current Date</div>
                <p className="text-base font-medium text-gray-800">{info.post_date}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">⚖️ Weight (kg)</div>
                <p className="text-base font-medium text-gray-800">{info.weight}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">📏 Length (cm)</div>
                <p className="text-base font-medium text-gray-800">{info.length}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">📐 Width (cm)</div>
                <p className="text-base font-medium text-gray-800">{info.width}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">📦 Height (cm)</div>
                <p className="text-base font-medium text-gray-800">{info.height}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">🧳 Package Content</div>
                <p className="text-base font-medium text-gray-800">{info.content}</p>
            </div>

            <div className="flex items-center mb-3 space-x-2">
                <div className="text-sm font-semibold text-[#b33434]">📝 Special Instructions</div>
                <p className="text-base font-medium text-gray-800">{info.message}</p>
            </div>

            <div className="flex justify-center pt-2">
          <button className="bg-[#b33434] hover:bg-[#a12d2d] w-[33.33%] mx-3 text-white py-1 px-4 rounded text-lg transition">
            ✅ Accept
          </button>
          <Link to="/" className="bg-[#b33434] hover:bg-[#a12d2d] w-[33.33%] text-center text-white py-1 px-4 rounded text-lg transition">
             ⬅️ Go Back
          </Link>
          </div>

            
     </div>

  </div>
  )
}

export default MoreInfo