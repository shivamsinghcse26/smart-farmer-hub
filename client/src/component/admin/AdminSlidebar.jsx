import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import { 
  LayoutDashboard, 
  Users, 
  Sprout, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  Leaf 
} from "lucide-react";
import { useAuth } from "../../context/Authcontext";
import api from "../../Services/Api";
// You might want to import your logout API service here
// import { logoutUser } from "../../Services/authApi"; 

const AdminSidebar = () => {
  const { logoutUser } = useAuth(); // Hook to clear context state
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { 
      path: "/admin/dashboard", 
      name: "Dashboard", 
      icon: LayoutDashboard 
    },
    { 
      path: "/admin/users", 
      name: "User Management", 
      icon: Users 
    },
    { 
      path: "/admin/farmers", 
      name: "Farmer Verification", 
      icon: ShieldCheck 
    },
    { 
      path: "/admin/crops", 
      name: "All Crops", 
      icon: Sprout 
    },
    { 
      path: "/admin/schemes", 
      name: "Govt Schemes", 
      icon: FileText 
    },
  ];

  const handleLogout = async () => {
    try {
      // 1. Call API to clear cookies (Server Side)
      await api.post("/api/v1/users/logout", {}, { withCredentials: true });

      // 2. Clear Local Storage (Client Side)
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 3. Update Context
      if(logoutUser) logoutUser();

      // 4. Success Toast & Redirect
      toast.success("Logged out successfully");
      navigate("/login"); 
      
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col sticky top-0 h-screen">
      
      {/* 🌿 Logo Area */}
      <div className="p-6 flex items-center gap-2 border-b border-gray-100">
        <div className="bg-green-600 p-2 rounded-lg">
          <Leaf className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">KishanSetu</h2>
          <span className="text-xs text-green-600 font-semibold uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full">
            Admin Panel
          </span>
        </div>
      </div>

      {/* 🔗 Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
          Main Menu
        </p>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-green-50 text-green-700 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
              }`}
            >
              <Icon 
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-green-600" : "text-gray-400 group-hover:text-green-600"
                }`} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 🚪 Logout Section */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;