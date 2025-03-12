import React from 'react';
import { Users, Package, MessageSquare } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Active Rentals',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: '#805532',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#805532] mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Users className="w-8 h-8 text-[#805532] mb-2" />
          <h3 className="text-lg font-semibold text-[#805532]">Total Users</h3>
          <p className="text-2xl font-bold text-[#805532]">1,234</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>• View user accounts</p>
            <p>• Add/Remove users</p>
            <p>• Manage permissions</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Package className="w-8 h-8 text-[#805532] mb-2" />
          <h3 className="text-lg font-semibold text-[#805532]">Products</h3>
          <p className="text-2xl font-bold text-[#805532]">567</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>• Approve new listings</p>
            <p>• Update products</p>
            <p>• Remove listings</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <MessageSquare className="w-8 h-8 text-[#805532] mb-2" />
          <h3 className="text-lg font-semibold text-[#805532]">Support</h3>
          <p className="text-2xl font-bold text-[#805532]">23</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>• View feedback</p>
            <p>• Handle complaints</p>
            <p>• Respond to queries</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#805532] mb-4">Rental Activity</h3>
          <Line data={chartData} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#805532] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <Users className="w-6 h-6 text-[#805532]" />
              <div>
                <p className="font-semibold text-[#805532]">New User Registration</p>
                <p className="text-sm text-[#805532]/70">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b">
              <Package className="w-6 h-6 text-[#805532]" />
              <div>
                <p className="font-semibold text-[#805532]">New Rental Listed</p>
                <p className="text-sm text-[#805532]/70">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MessageSquare className="w-6 h-6 text-[#805532]" />
              <div>
                <p className="font-semibold text-[#805532]">New Support Ticket</p>
                <p className="text-sm text-[#805532]/70">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;