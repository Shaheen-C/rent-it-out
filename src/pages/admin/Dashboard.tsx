import React, { useState, useEffect } from "react";
import { Users, Package, MessageSquare } from "lucide-react";
import { Line } from "react-chartjs-2";
import { supabase } from "../../libs/createClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  // Fetch total users and products from Supabase
  useEffect(() => {
    if (user) {
      if (role !== "admin") {
        navigate("/");
        return;
      }
    } else {
      navigate("/");
    }
  }, [user, role]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch total users
        const { count: userCount } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        // Fetch total products
        const { count: productCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        setTotalUsers(userCount || 0);
        setTotalProducts(productCount || 0);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Active Rentals",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: "#805532",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#805532] mb-6">
          Admin Dashboard
        </h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#805532] mb-6">
          Admin Dashboard
        </h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#805532] mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Users className="w-8 h-8 text-[#805532] mb-2" />
          <h3 className="text-lg font-semibold text-[#805532]">Total Users</h3>
          <p className="text-2xl font-bold text-[#805532]">{totalUsers}</p>
          {/* <div className="mt-4 space-y-2 text-sm">
            <p>• View user accounts</p>
            <p>• Add/Remove users</p>
            <p>• Manage permissions</p>
          </div> */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Package className="w-8 h-8 text-[#805532] mb-2" />
          <h3 className="text-lg font-semibold text-[#805532]">Products</h3>
          <p className="text-2xl font-bold text-[#805532]">{totalProducts}</p>
          {/* <div className="mt-4 space-y-2 text-sm">
            <p>• Approve new listings</p>
            <p>• Update products</p>
            <p>• Remove listings</p>
          </div> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#805532] mb-4">
            Rental Activity
          </h3>
          <Line data={chartData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#805532] mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <Users className="w-6 h-6 text-[#805532]" />
              <div>
                <p className="font-semibold text-[#805532]">
                  New User Registration
                </p>
                <p className="text-sm text-[#805532]/70">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b">
              <Package className="w-6 h-6 text-[#805532]" />
              <div>
                <p className="font-semibold text-[#805532]">
                  New Rental Listed
                </p>
                <p className="text-sm text-[#805532]/70">15 minutes ago</p>
              </div>
            </div>
            {/* <div className="flex items-center gap-4">
              <MessageSquare className="w-6 h-6 text-[#805532]" />
              <div>
                <p className="font-semibold text-[#805532]">
                  New Support Ticket
                </p>
                <p className="text-sm text-[#805532]/70">1 hour ago</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
