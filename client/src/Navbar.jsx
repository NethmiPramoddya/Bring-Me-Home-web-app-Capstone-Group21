import { Link } from "react-router-dom";
import { Bell, User } from "lucide-react";
import logo from './assets/logo.png'

const Navbar = () => {
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
        <button className="relative text-gray-700 hover:text-red-600">
          <Bell className="w-5 h-5" />
          {/* Optional badge */}
          <span className="absolute px-1 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">3</span>
        </button>

        {/* User Profile Icon */}
        <button className="text-gray-700 hover:text-red-600">
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
