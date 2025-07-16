import {React, useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'

function EditUsers() {

  const { id } = useParams()



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
          details: "",
          message: "",
          contactinfo: "",
          profile1: "",
          profile2: "",
        });
  
        const navigate  = useNavigate()

        useEffect(()=>{
            axios.get("http://localhost:3002/getUser/" +id)
            .then(result => {
                console.log(result)
                setFormData(result.data)
            })
            .catch(err => console.log(err))
          },[id])
      
        const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        };
      
        const editSubmit = (e) => {
          e.preventDefault();
          axios.put("http://localhost:3002/editUser/"+id, formData)
          .then(result => {
              console.log(result)
              navigate("/")
          })
          .catch(err => console.log(err))
        };
  
  return (
    <div>
        <div>Send A package Request</div>
        <form onSubmit={editSubmit}>
            <div className="flex items-center justify-between mb-6">
                <label htmlFor="sname">Sender's Full Name</label>
                <input type="text" id="sname" name="sname" value={formData.sname} onChange={handleChange} required/>
                <label htmlFor="semail">Sender's Email</label>
                <input type="email"  id="semail" name="semail" value={formData.semail} onChange={handleChange} required/>
            </div>

            <div className="flex items-center justify-between mb-6">
                <label htmlFor="rname">Recipeint's Full Name</label>
                <input type="text" name="rname" id="rname" value={formData.rname} onChange={handleChange} required/>
                <label htmlFor="remail">Recipeints Email</label>
                <input type="email" name="remail" id="remail" value={formData.remail} onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="plink">Item Purchase Link(optional)</label>
                <input type="text" name="plink" id="plink" value={formData.plink} onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="item">Item in brief(Document/gift parcel) </label>
                <input type="text" name="item" id="item" value={formData.item} onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="date">Delivery Date</label>
                <input type="Date" name="date" id="date" value={formData.date} onChange={handleChange} required/>
            </div>

            <div className="flex items-center justify-between mb-6">
                <label htmlFor="fcountry">Country From</label>
                <input type="text" name="fcountry" id="fcountry" value={formData.fcountry} onChange={handleChange} required/>
                <label htmlFor="dcountry">Destination</label>
                <input type="text" name="dcountry" id="dcountry" value={formData.dcountry} onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="details">Package Details</label>
                <textarea id="details" name="details" rows="5" value={formData.details} onChange={handleChange}></textarea>
            </div>

            <div>
                <label htmlFor="message">Special Instructions</label>
                <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange}></textarea>
            </div>

            <div>
                <label htmlFor="contactinfo">Contact Info(Depature and Arrival)</label>
                <textarea id="contactinfo" name="contactinfo" rows="3" value={formData.contactinfo} onChange={handleChange}></textarea>
            </div>

            <div className="flex items-center justify-between mb-6">
                <label htmlFor="profile1">Social Media Profile 1</label>
                <input type="text" id="profile1" name="profile1" value={formData.profile1} onChange={handleChange} required/>
                <label htmlFor="profile2">Social Media Profile 2</label>
                <input type="text" id="profile2" name="profile2" value={formData.profile2} onChange={handleChange} required/>
            </div>



            <button type="submit" className="p-2 mt-4 text-white bg-blue-500 rounded">Edit</button>

        </form>
    </div>

  )
}

export default EditUsers
