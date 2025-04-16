import {React, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function CreateUsersForm() {

    const [formData, setFormData] = useState({
        sname: "",
        semail: "",
        rname: "",
        remail: "",
        plink: "",
        item:"",
        date: "",
        fcountry: "",
        dcountry: "",
        weight: "",
        length:"" ,
        width: "",
        height: "",
        post_date:  new Date().toISOString().slice(0, 10),
        content: "",
        message: "",
        contactinfo_d: "",
        contactinfo_a:"",
        profile1: "",
        profile2: "",
      });

      const navigate  = useNavigate()
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const senderID = localStorage.getItem("userId");
        const submissionData = {
            ...formData,
            buyer_id: senderID,
          };

        axios.post("http://localhost:3002/create", submissionData)
        .then(result => {
            console.log(result)
            navigate("/")
        })
        .catch(err => console.log(err))
      };

  return (
    <div>
        <div className="mx-4 mt-5 text-3xl font-bold">Send a Package Request</div>
        <div className="p-6 mx-auto mt-5 bg-white shadow-md mx-w-md rounded-xl">
        <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="sname" className="block mb-1 font-medium text-gray-700 text-md">Sender's Full Name</label>
                <input type="text" id="sname" name="sname" value={formData.sname} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="semail" className="block mb-1 font-medium text-gray-700 text-md">Sender's Email</label>
                <input type="email"  id="semail" name="semail" value={formData.semail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="rname" className="block mb-1 font-medium text-gray-700 text-md">Recipeint's Full Name</label>
                <input type="text" name="rname" id="rname" value={formData.rname} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="remail" className="block mb-1 font-medium text-gray-700 text-md">Recipeints Email</label>
                <input type="email" name="remail" id="remail" value={formData.remail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "required/>
                </div>
            </div>

            <div>
            <div className="flex flex-col my-2">
                <label htmlFor="plink" className="block mb-1 font-medium text-gray-700 text-md">Item Purchase Link(optional)</label>
                <input type="text" name="plink" id="plink" value={formData.plink} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " />
                </div>
            </div>

            <div>
            <div className="flex flex-col my-4">
                <label htmlFor="item" className="block mb-1 font-medium text-gray-700 text-md">Item in brief(Document/gift parcel) </label>
                <input type="text" name="item" id="item" value={formData.item} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
            </div>

            <div>
            <div className="flex flex-col my-2">
                <label htmlFor="date" className="block mb-1 font-medium text-gray-700 text-md">Delivery Date</label>
                <input type="Date" name="date" id="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 f" required/>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col my-2 w-full md:w-[48%]">
                <label htmlFor="fcountry" className="block mb-1 font-medium text-gray-700 text-md">Country From</label>
                <input type="text" name="fcountry" id="fcountry" value={formData.fcountry} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
                <div className="flex flex-col my-2 w-full md:w-[48%]">
                <label htmlFor="dcountry" className="block mb-1 font-medium text-gray-700 text-md">Destination</label>
                <input type="text" name="dcountry" id="dcountry" value={formData.dcountry} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="weight" className="block mb-1 font-medium text-gray-700 text-md">Weight in kg</label>
                <input type="text" name="weight" id="weight" value={formData.weight} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="length" className="block mb-1 font-medium text-gray-700 text-md">Length in cm</label>
                <input type="text" name="length" id="length" value={formData.length} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "required/>
                </div>
            </div>


            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="width" className="block mb-1 font-medium text-gray-700 text-md">Width in cm</label>
                <input type="text" id="width" name="width" value={formData.width} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
                </div>
                <div className="flex flex-col w-full md:w-[48%]">
                <label htmlFor="height" className="block mb-1 font-medium text-gray-700 text-md">Height in cm</label>
                <input type="text"  id="height" name="height" value={formData.height} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " required/>
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
                <label htmlFor="content" className="block mb-1 font-medium text-gray-700 text-md">Package Content of Package</label>
                <textarea id="content" name="content" rows="5" value={formData.content} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " placeholder="Content of your package"></textarea>
                </div>
            </div>

            <div>
            <div className="flex flex-col my-2">
                <label htmlFor="message" className="block mb-1 font-medium text-gray-700 text-md">Special Instructions</label>
                <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "></textarea>
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



export default CreateUsersForm
