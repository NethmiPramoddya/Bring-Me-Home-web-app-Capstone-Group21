import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Users, Package, ClipboardList, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function AdminWallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    const res = await fetch("http://localhost:3002/admin/wallets");
    const data = await res.json();
    setWallets(data);
    setLoading(false);
  };

  const handleWithdraw = async (userId) => {
    const res = await fetch(`http://localhost:3002/admin/withdraw/${userId}`, { method: "POST" });
    const data = await res.json();
    alert(data.message);
    fetchWallets(); // refresh list
  };

  const viewTransactions = async (walletId) => {
    const res = await fetch(`http://localhost:3002/admin/wallets/${walletId}/transactions`);
    const data = await res.json();
    setSelectedWalletId(walletId);
    setTransactions(data);
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Sidebar */}
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="flex-1 p-6 overflow-auto">
        {/* Optional mobile toggle button */}
        <div className="block mb-4 md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-4 py-2 text-white bg-red-600 rounded"
          >
            Toggle Menu
          </button>
        </div>

        <h2 className="mb-4 text-2xl font-semibold text-red-700">Traveler Wallets</h2>

        {loading ? (
          <p className="text-gray-500">Loading wallets...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full text-left border table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Traveler ID</th>
                  <th className="p-3">Actual Amount</th>
                  <th className="p-3">Can Withdraw</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet._id} className="border-t">
                    <td className="p-3">{wallet.traveler_user_id}</td>
                    <td className="p-3">{wallet.actual_amount.toFixed(2)}</td>
                    <td className="p-3">{wallet.can_withdrawal_amount.toFixed(2)}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleWithdraw(wallet.traveler_user_id)}
                        className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Withdraw
                      </button>
                      <button
                        onClick={() => viewTransactions(wallet._id)}
                        className="px-3 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
                      >
                        History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedWalletId && (
          <div className="mt-6">
            <h3 className="mb-2 text-xl font-semibold">Transaction History</h3>
            <table className="w-full text-left border table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Sender ID</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-t">
                    <td className="p-2">{tx.sender_request_id?._id || "N/A"}</td>
                    <td className="p-2">{tx.amount}</td>
                    <td className="p-2">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
