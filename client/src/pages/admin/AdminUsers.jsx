import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  Phone, 
  User,
  Loader2,
  Ban,
  CheckCircle
} from "lucide-react";

import AdminSidebar from "../../component/admin/AdminSlidebar";
import { getAllUsers, toggleBlockUser } from "../../Services/adminApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Loading state for specific buttons (to prevent multiple clicks)
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      // Filter out admins from the view immediately
      const nonAdminUsers = res.data.data.filter(u => u.Role !== "admin");
      setUsers(nonAdminUsers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    // Prevent clicking if already processing
    if (processingId) return;

    setProcessingId(user._id);
    const action = user.isBlocked ? "Unblocking" : "Blocking";
    
    try {
      await toggleBlockUser(user._id);
      
      toast.success(`User ${user.isBlocked ? "unblocked" : "blocked"} successfully`);

      // OPTIMISTIC UPDATE: Update local state immediately
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${action.toLowerCase()} user`);
    } finally {
      setProcessingId(null);
    }
  };

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.EmailId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" ? true : u.Role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Helper for Role Badge
  const RoleBadge = ({ role }) => {
    const isFarmer = role === "farmer";
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isFarmer 
          ? "bg-green-50 text-green-700 border-green-200" 
          : "bg-blue-50 text-blue-700 border-blue-200"
      }`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <AdminSidebar />
      <Toaster position="top-right" />

      <div className="flex-1 p-8 h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage farmers and buyers access.</p>
        </div>

        {/* Controls Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="text-gray-400 w-4 h-4" />
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
            >
              <option value="all">All Roles</option>
              <option value="farmer">Farmers</option>
              <option value="buyer">Buyers</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
             <div className="p-10 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-2 text-gray-500">Loading users...</span>
             </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
               <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
               <p>No users found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="px-6 py-4 font-semibold">User Profile</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Contact Info</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors group">
                      
                      {/* User Profile */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                            {u.Name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{u.Name}</p>
                            <p className="text-xs text-gray-400">ID: {u._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <RoleBadge role={u.Role} />
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            {u.EmailId}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            {u.PhoneNo || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                            <Ban className="w-3 h-3" /> Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleBlock(u)}
                          disabled={processingId === u._id}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            u.isBlocked
                              ? "bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                          } ${processingId === u._id ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          {processingId === u._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : u.isBlocked ? (
                            <>
                              <ShieldCheck className="w-4 h-4 mr-2" /> Unblock
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-4 h-4 mr-2" /> Block
                            </>
                          )}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Footer Stats */}
          {!loading && (
             <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between">
                <span>Total Users: {filteredUsers.length}</span>
                <span>
                   {filteredUsers.filter(u => u.isBlocked).length} Blocked | {filteredUsers.filter(u => !u.isBlocked).length} Active
                </span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;