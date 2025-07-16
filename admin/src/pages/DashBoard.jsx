import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Users, Package, ClipboardList, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

function Card({ children, className }) {
  return <div className={`shadow-lg rounded-2xl bg-white ${className}`}>{children}</div>;
}

function CardContent({ children, className }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function DashBoard() {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    senderRequests: 0,
    totalTransactions: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate()
        
        const adminId = localStorage.getItem("adminId")
        
        useEffect(() => {
            const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
            if (!isLoggedIn || isLoggedIn === "false" || !adminId ) {
              navigate('/admin/login');
            }
          }, [adminId, navigate]);

  useEffect(() => {
    axios
      .get('http://localhost:3002/api/admin/dashboard') 
      .then((res) => {
        setDashboardData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch dashboard data');
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-red-100 to-white">
      {/* Mobile Sidebar Toggle */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="p-4 md:hidden">
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center p-6 border-b border-gray-200">
          <Link to="/">< img src={logo} alt="Logo" className="w-10 h-auto" /></Link>
          <h3 className="ml-3 text-red-600">Bring Me Home</h3>
        </div>
        <nav className="p-4 space-y-4 text-gray-700">
          {[
            ['Dashboard', <Menu size={18} />, '/'],
            ['Users', <Users size={18} />, '/users'],
            ['Sender Requests', <Package size={18} />, '/sender-requests'],
            ['Traveler Forms', <ClipboardList size={18} />, '/travelers'],
            ['Ongoing Tasks', <ClipboardList size={18} />, '/onGoingTasks'],
            ['Wallets', <Wallet size={18} />, '/withdrawal'],
          ].map(([label, icon, path], i) => (
            <Link
              key={i}
              to={path}
              className="flex items-center gap-2 transition duration-200 transform cursor-pointer hover:text-red-700 hover:scale-105"
              onClick={() => setMenuOpen(false)}
            >
              {icon} {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-wide text-red-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-red-300 rounded-full animate-pulse"></div>
            <div className="w-8 h-8 bg-red-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <p className="text-center text-gray-500">Loading dashboard...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/users">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="transition bg-white border-l-4 border-blue-500 shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <h2 className="text-sm text-gray-500">Total Users</h2>
                    <p className="text-3xl font-bold text-blue-600">{dashboardData.totalUsers}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link to="/sender-requests">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="transition bg-white border-l-4 border-green-500 shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <h2 className="text-sm text-gray-500">Sender Requests</h2>
                    <p className="text-3xl font-bold text-green-600">{dashboardData.senderRequests}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link to="/withdrawal">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="transition bg-white border-l-4 border-yellow-500 shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <h2 className="text-sm text-gray-500">Total Transactions</h2>
                    <p className="text-3xl font-bold text-yellow-600">{dashboardData.totalTransactions.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link to="/withdrawal">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="transition bg-white border-l-4 border-purple-500 shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <h2 className="text-sm text-gray-500">Total Revenue</h2>
                    <p className="text-3xl font-bold text-purple-600">${dashboardData.totalRevenue.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashBoard;
