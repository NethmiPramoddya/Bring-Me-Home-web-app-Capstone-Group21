import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Users, Package, ClipboardList, Wallet } from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = ({ menuOpen, setMenuOpen }) => 
  {
  const location = useLocation();

  const links = [
    ['Dashboard', <Menu size={18} />, '/'],
    ['Users', <Users size={18} />, '/users'],
    ['Sender Requests', <Package size={18} />, '/sender-requests'],
    ['Traveler Forms', <ClipboardList size={18} />, '/travelers'],
    ['Ongoing Tasks', <ClipboardList size={18} />, '/onGoingTasks'],
    ['Wallets', <Wallet size={18} />, '/withdrawal'],
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 md:relative md:translate-x-0 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    }
    >
      <div className="flex items-center p-6 border-b border-gray-200">
        <img src={logo} alt="Logo" className="w-10 h-auto" />
        <h3 className='ml-3 text-red-600 '>Bring Me Home</h3>
        </div>
      <nav className="p-4 space-y-4 text-gray-700">
        {links.map(([label, icon, path], i) => (
          <Link
            key={i}
            to={path}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-2 p-2 rounded transition-transform duration-200 hover:bg-gray-100 hover:text-red-700 ${
              location.pathname === path ? 'bg-gray-100 text-red-700 font-semibold' : ''
            }`
          }
          >
            {icon} {label}
          </Link>
        )
        )
        }
      </nav>
    </aside>
  );
};

export default Sidebar;
