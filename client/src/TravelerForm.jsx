import {React, useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Luggage } from 'lucide-react';

function TravelerForm() {
    const [formData, setFormData] = useState({
        tname: "",
        temail: "",
        depature_country: "",
        destination: "",
        Luggage_space: "",
        depature_date:"",
        arrival_date: "",
        post_date:  new Date().toISOString().slice(0, 10),
        note: "",
        contactinfo_d: "",
        contactinfo_a:"",
        profile1: "",
        profile2: "",
      });

      const navigate  = useNavigate()
      useEffect(() => {
              const isLoggedIn = localStorage.getItem("isLoggedIn");
              if (!isLoggedIn) {
                navigate('/login');
              }
            }, []);
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const travelerID = localStorage.getItem("userId");
        const submissionData = {
            ...formData,
            traveler_id: travelerID,
          };
        axios.post("http://localhost:3002/createTraveler", submissionData)
        .then(result => {
            console.log(result)
            navigate("/")
        })
        .catch(err => console.log(err))
      };


  return (
    <div>
        <div className="mx-4 mt-5 text-3xl font-bold">Become a Traveler</div>
        <div className="p-6 mx-auto mt-5 bg-white shadow-md mx-w-md rounded-xl">
        <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="tname" className="block mb-1 font-medium text-gray-700 text-md">Traveler's Full Name</label>
                <input type="text" id="tname" name="tname" value={formData.tname} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="temail" className="block mb-1 font-medium text-gray-700 text-md">Traveler's Email</label>
                <input type="email"  id="temail" name="temail" value={formData.temail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="depature_country" className="block mb-1 font-medium text-gray-700 text-md">Depature Location</label>
                <input type="text" name="depature_country" id="depature_country" value={formData.depature_country} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="destination" className="block mb-1 font-medium text-gray-700 text-md">Destination</label>
                <input type="text" name="destination" id="destination" value={formData.destination} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "required/>
                </div>
            </div>

            <div>
            <div className="flex flex-col my-2">
                <label htmlFor="Luggage_space" className="block mb-1 font-medium text-gray-700 text-md">Available Luggage Space (kg)</label>
                <input type="text" name="Luggage_space" id="Luggage_space" value={formData.Luggage_space} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " />
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="depature_date" className="block mb-1 font-medium text-gray-700 text-md">Depature Date</label>
                <input type="Date" id="depature_date" name="depature_date" value={formData.depature_date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="arrival_date" className="block mb-1 font-medium text-gray-700 text-md">Arrival Date</label>
                <input type="Date" id="arrival_date" name="arrival_date" value={formData.arrival_date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
            </div>

            <div>
            <div className="flex flex-col my-2">
                <label htmlFor="post_date" className="block mb-1 font-medium text-gray-700 text-md">Current Date</label>
                <input type="date" name="post_date" id="post_date" value={formData.post_date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2" required/>
                </div>
            </div>

            <div>
            <div className="flex flex-col my-2">
                <label htmlFor="note" className="block mb-1 font-medium text-gray-700 text-md">Additional Notes</label>
                <textarea id="note" name="note" rows="5" value={formData.note} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "></textarea>
                </div>
            </div>


            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="contactinfo_d" className="block mb-1 font-medium text-gray-700 text-md">Contact Info Depature</label>
                <input type="text" id="contactinfo_d" name="contactinfo_d" value={formData.contactinfo_d} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="contactinfo_a" className="block mb-1 font-medium text-gray-700 text-md">Contact Info Arrival</label>
                <input type="text"  id="contactinfo_a" name="contactinfo_a" value={formData.contactinfo_a} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
            </div>

            <div className="flex items-center justify-between my-2 mb-6">
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="profile1" className="block mb-1 font-medium text-gray-700 text-md">Social Media Profile 1</label>
                <input type="text" id="profile1" name="profile1" value={formData.profile1} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
                <div className="flex flex-col my-2 w-full md:w-[48%]">
                <label htmlFor="profile2" className="block mb-1 font-medium text-gray-700 text-md">Social Media Profile 2</label>
                <input type="text" id="profile2" name="profile2" value={formData.profile2} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
            </div>

            <button type="submit" className="items-center w-full p-2 my-2 mt-4 text-white bg-blue-500 rounded">Submit</button>

        </form>
        </div>
    </div>

  )
}

export default TravelerForm