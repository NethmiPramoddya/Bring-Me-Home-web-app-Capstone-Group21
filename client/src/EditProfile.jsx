import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    phone: '',
    location: '',
    bankName: '',
    accountNumber: '',
    branch: '',
  });

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    axios.get(`http://localhost:3002/profile/${userId}`)
      .then(res => {
        const user = res.data;
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          about: user.about || '',
          phone: user.phone || '',
          location: user.location || '',
        }));

       
        axios.get(`http://localhost:3002/wallet/${userId}`)
          .then(walletRes => {
            const bank = walletRes.data.bankDetails || {};
            setFormData(prev => ({
              ...prev,
              bankName: bank.bankName || '',
              accountNumber: bank.accountNumber || '',
              branch: bank.branch || '',
            }));
          });
      });
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3002/profile/${userId}`, formData)
      .then(() => {
        alert("Profile updated successfully!");
        navigate("/profile/:id");
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-semibold">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
        <textarea name="about" value={formData.about} onChange={handleChange} placeholder="About Me" className="w-full p-2 border rounded" />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" />
        <hr />
        <h3 className="text-xl font-semibold">Bank Details</h3>
        <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" className="w-full p-2 border rounded" />
        <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account Number" className="w-full p-2 border rounded" />
        <input type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch" className="w-full p-2 border rounded" />
        <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;
