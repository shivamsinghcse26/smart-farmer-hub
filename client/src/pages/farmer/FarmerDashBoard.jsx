import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  Sprout,
  IndianRupee,
  Package,
  Filter,
  ShoppingBag,
  Loader2,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  User as UserIcon,
  LogOut,
  Edit
} from "lucide-react";
import { useAuth } from "../../context/Authcontext";
import CropCard from "../../component/CropCard"; 
import api from "../../Services/Api";

const FarmerDashboard = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (dashboard && !dashboard.farmerProfile) {
      navigate("/farmers/profile");
    }
  }, [dashboard, navigate]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/api/v1/farmers/dashboard", {
        withCredentials: true,
      });
      setDashboard(res.data.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/users/logout", {}, { withCredentials: true });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subText }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {subText && (
          <p className={`text-xs mt-2 ${color === "green" ? "text-green-600" : "text-gray-400"}`}>
            {subText}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${
        color === "green" ? "bg-green-100 text-green-600" :
        color === "blue" ? "bg-blue-100 text-blue-600" :
        color === "yellow" ? "bg-yellow-100 text-yellow-600" :
        "bg-purple-100 text-purple-600"
      }`}>
        <Icon size={24} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-green-600">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium text-gray-600">Loading your farm data...</p>
      </div>
    );
  }

  if (!dashboard)
    return <div className="text-center mt-10">Failed to load data.</div>;

  const { user, crops, totalCrops, activeCrops, earnings } = dashboard;
  
  // Try to find avatar in user object or farmerProfile object
  const userAvatar = user?.Avatar || dashboard.farmerProfile?.avatar;

  const filteredCrops = filter === "all"
      ? crops.filter((crop) => crop.status !== "sold")
      : crops.filter((crop) => crop.status === filter);

 return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* 🔝 HEADER SECTION */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* ✅ LEFT: Welcome Message & Title */}
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                Welcome back, <span className="text-green-600">{user.Name?.split(" ")[0]}</span>! 👋
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                <LayoutDashboard className="w-3.5 h-3.5" /> 
                Farmer Dashboard
              </p>
            </div>

            {/* ✅ RIGHT: Actions & Profile Menu */}
            <div className="flex items-center gap-3 sm:gap-6">
              
              {/* Action Buttons (Hidden on super small screens, visible on md+) */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => navigate("/farmers/orders")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-green-700 border border-gray-200 rounded-xl transition-all font-semibold text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Orders
                </button>
                <button
                  onClick={() => navigate("/farmers/add-crop")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold text-sm shadow-lg shadow-green-100 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add Crop
                </button>
              </div>

              {/* Divider Line */}
              <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

              {/* ✅ PROFILE & MENU SECTION */}
              <div className="relative flex items-center gap-3" ref={dropdownRef}>
                
                {/* Avatar */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 border-2 border-green-100 bg-white">
                   <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {userAvatar ? (
                      <img 
                        src={userAvatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 text-gray-400" />
                    )}
                   </div>
                </div>

                {/* 3-Dots Button */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                    profileOpen 
                      ? "bg-green-50 text-green-600 ring-2 ring-green-200" 
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <MoreVertical size={18} />
                </button>

                {/* 🔽 DROPDOWN MENU */}
                {profileOpen && (
                  <div className="absolute right-0 top-14 w-56 bg-white shadow-xl rounded-2xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                    
                    {/* User Info (Mobile Only) */}
                    <div className="md:hidden px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{user.Name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.Email || "Farmer"}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-1.5">
                      <button
                        onClick={() => navigate("/farmers/profile", { state: { mode: "edit" } })}
                        className="w-full text-left px-3 py-2.5 hover:bg-green-50 text-gray-700 text-sm font-medium flex items-center gap-3 transition-colors rounded-lg"
                      >
                        <Edit size={16} className="text-green-600" /> Edit Profile
                      </button>

                      {/* Mobile Only Buttons inside menu */}
                      <button
                        onClick={() => navigate("/farmers/add-crop")}
                        className="md:hidden w-full text-left px-3 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-3 transition-colors rounded-lg"
                      >
                        <Plus size={16} /> Add Crop
                      </button>
                      <button
                         onClick={() => navigate("/farmers/orders")}
                         className="md:hidden w-full text-left px-3 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-3 transition-colors rounded-lg"
                      >
                        <ShoppingBag size={16} /> Orders
                      </button>
                    </div>

                    <div className="p-1.5 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 hover:bg-red-50 text-red-600 text-sm font-medium flex items-center gap-3 transition-colors rounded-lg group"
                      >
                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* 📊 Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Listings" value={totalCrops} icon={Sprout} color="green" subText="Lifetime crops added" />
          <StatCard title="Active Crops" value={activeCrops} icon={Package} color="blue" subText="Currently in marketplace" />
          <StatCard title="Crops Sold" value={totalCrops - activeCrops} icon={TrendingUp} color="purple" subText="Completed sales" />
          <StatCard title="Total Earnings" value={`₹ ${earnings?.toLocaleString() || 0}`} icon={IndianRupee} color="yellow" subText="Revenue generated" />
        </div>

        {/* 🌱 Listings & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-gray-500" />
            My Listings
          </h2>
          <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex shadow-sm">
            {[
              { id: "all", label: "All Active" },
              { id: "available", label: "Available" },
              { id: "sold", label: "Sold Out" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filter === tab.id ? "bg-green-100 text-green-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🌾 Grid */}
        {filteredCrops.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No crops found</h3>
            <p className="text-gray-500 mt-1">You don't have any crops listed yet.</p>
            {filter === "all" && (
              <button
                onClick={() => navigate("/farmers/add-crop")}
                className="mt-4 text-green-600 font-medium hover:underline"
              >
                Add your first crop now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <CropCard
                key={crop._id}
                crop={crop}
                onEdit={() => navigate(`/farmers/edit-crop/${crop._id}`)}
                onRefresh={fetchDashboard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default FarmerDashboard;