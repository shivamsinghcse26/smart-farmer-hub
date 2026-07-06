import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  ListOrdered, 
  UserCircle, 
  ArrowRight, 
  Loader2,
  TrendingUp,
  LogOut 
} from "lucide-react";
import api from "../../Services/Api.js";
import { useAuth } from "../../context/Authcontext";
// Components
import BuyerHeader from "../../component/buyer/BuyerHeader";
import BuyerStats from "../../component/buyer/BuyerStats";

// API
import { getBuyerDashboard } from "../../Services/buyerApi.js";

const BuyerDashboard = () => {
  const { logoutUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ---------------------------------------------------------
     ✅ LOGIC 1: Automatic Redirect for First-Time Users
     If dashboard loads but 'buyerProfile' is missing, send to setup page.
     --------------------------------------------------------- */
  useEffect(() => {
    if (dashboard && !dashboard.BuyerProfile) {
      // Redirect to BUYER profile (not farmer)
      navigate("/buyers/profile");
    }
  }, [dashboard, navigate]);
  /* --------------------------------------------------------- */

  const fetchDashboard = async () => {
    try {
      const res = await getBuyerDashboard();
      setDashboard(res.data.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/users/logout",{},{ withCredentials: true });

      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
      logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-green-600">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  if (!dashboard) return <div className="text-center mt-10">Failed to load data.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Decoration Bar */}
      <div className="h-48 bg-gradient-to-r from-green-600 to-green-800 w-full absolute top-0 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
             {/* Simple Avatar Circle */}
             <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-xl font-bold border-2 border-white shadow-sm">
                {dashboard.user?.Name?.charAt(0).toUpperCase() || "B"}
             </div>
             <div>
                <BuyerHeader name={dashboard.user?.Name || "Buyer"} />
                <p className="text-gray-500 text-sm mt-0.5">Welcome back to your control center.</p>
             </div>
          </div>

          <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-3">
             {/* Market Status Badge */}
             <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-100 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-green-800 font-medium text-sm">Market Active</span>
             </div>

             {/* Logout Button */}
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg border border-red-100 transition-all text-sm font-medium"
             >
               <LogOut className="w-4 h-4" />
               Logout
             </button>
          </div>
        </div>

        {/* Stats Component Wrapper */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 ml-1">Overview</h2>
          <BuyerStats
            totalAvailableCrops={dashboard.totalAvailableCrops}
            totalOrders={dashboard.totalOrders}
            pendingOrders={dashboard.pendingOrders}
          />
        </div>

        {/* Quick Actions Grid */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 ml-1">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Marketplace */}
          <div 
            onClick={() => navigate("/buyers/marketplace")}
            className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-green-200 cursor-pointer transition-all duration-300"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
              <ShoppingBag className="w-6 h-6 text-green-700 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Browse Marketplace</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              Explore fresh crops directly from farmers and place new orders.
            </p>
            <div className="flex items-center text-green-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              Start Shopping <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 2: My Orders */}
          <div 
            onClick={() => navigate("/buyers/orders")}
            className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-blue-200 cursor-pointer transition-all duration-300"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <ListOrdered className="w-6 h-6 text-blue-700 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">My Orders</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              Track your purchase history, delivery status, and payments.
            </p>
            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              View History <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 3: Profile */}
          <div 
            onClick={() => 
              // ✅ LOGIC 2: Manual Edit Click - Pass 'edit' mode to prevent redirect loop
              navigate("/buyers/profile", { state: { mode: "edit" } })
            }
            className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-purple-200 cursor-pointer transition-all duration-300"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <UserCircle className="w-6 h-6 text-purple-700 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              Update your contact details, delivery address, and preferences.
            </p>
            <div className="flex items-center text-purple-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              Manage Account <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;