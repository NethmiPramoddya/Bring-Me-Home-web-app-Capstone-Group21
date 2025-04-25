import { Link, useNavigate } from "react-router-dom";
import { Bell, User } from "lucide-react";
import logo from './assets/logo.png'
import React, { useEffect, useState, useRef } from "react";

const Navbar = () => {
  const userId = localStorage.getItem("userId");
  
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", false); 
    localStorage.removeItem("userId"); // or other auth token
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    navigate("/login"); // redirect to login
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600">
        <Link to="/"><img src={logo} alt="logo" className="w-auto h-8" /></Link>
      </div>

      {/* Right side links & icons */}
      <div className="flex items-center gap-6">
        <Link to="/" className="font-medium text-gray-700 hover:text-red-600">
          Sender Requests
        </Link>
        <Link to="/become-traveler" className="font-medium text-gray-700 hover:text-red-600">
          Become a Traveler
        </Link>

        {/* Notification Icon */}
        {userId && (
              <button className="relative text-gray-700 hover:text-red-600" onClick={() => navigate('/notifications')}>
              <Bell className="w-5 h-5" />
              {/* Optional badge */}
              <span className="absolute px-1 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">3</span>
            </button>
              )}
        

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="text-gray-700 hover:text-red-600"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <User className="w-5 h-5" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 z-50 w-40 mt-2 bg-white border rounded shadow-lg">
              
              {/* View Profile Button */}
              {userId && (
                <button
                  onClick={() => navigate(`/profile/${userId}`)}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </button>
              )}

              {userId && (
                <button
                  onClick={() => navigate(`/mySenderRequests/${userId}`)}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  My Sender Requests
                </button>
              )}

              {userId && (
                <button
                  onClick={() => navigate(`/travelingData/${userId}`)}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Traveling data
                </button>
              )}

              {userId && (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-white bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
              )}
              {!userId && (
                <Link to="/login" className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                  Login
                </Link>
              )}
              {!userId && (
                <Link to="/register" className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                  Register
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
