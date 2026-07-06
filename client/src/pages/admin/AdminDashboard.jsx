import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { 
  Users, 
  Tractor, 
  ShoppingBag, 
  Sprout, 
  Plus, 
  Trash2, 
  Calendar, 
  Link as LinkIcon, 
  Loader2,
  LayoutDashboard,
  Megaphone
} from "lucide-react";

import AdminSidebar from "../../component/admin/AdminSlidebar";
import { getAdminDashboard } from "../../Services/adminApi";
import {
  getAllSchemes,
  createScheme,
  deleteScheme,
} from "../../Services/adminSchemeApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schemeLoading, setSchemeLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, schemesRes] = await Promise.all([
        getAdminDashboard(),
        getAllSchemes()
      ]);
      setStats(statsRes.data.data);
      setSchemes(schemesRes.data.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchemesOnly = async () => {
    const res = await getAllSchemes();
    setSchemes(res.data.data);
  };

  const handleAddScheme = async (e) => {
    e.preventDefault();
    if (!title || !description || !deadline) {
      return toast.error("Please fill in all required fields");
    }

    setSchemeLoading(true);
    try {
      await createScheme({ title, description, deadline, link });
      toast.success("Scheme published successfully!");
      setTitle("");
      setDescription("");
      setDeadline("");
      setLink("");
      fetchSchemesOnly();
    } catch (error) {
      toast.error("Failed to create scheme");
    } finally {
      setSchemeLoading(false);
    }
  };

  const handleDeleteScheme = async (id) => {
    if(!window.confirm("Are you sure you want to delete this scheme?")) return;
    try {
      await deleteScheme(id);
      toast.success("Scheme deleted");
      fetchSchemesOnly();
    } catch (error) {
      toast.error("Failed to delete scheme");
    }
  };

  // Reusable Stat Card Component
  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${bgClass} ${colorClass}`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-10 h-10 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <AdminSidebar />
      <Toaster position="top-right" />

      <div className="flex-1 p-8 h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <LayoutDashboard className="mr-3 text-green-600" /> 
            Admin Overview
          </h1>
          <p className="text-gray-500 mt-1 ml-9">Welcome back, Admin. Here's what's happening today.</p>
        </div>

        {/* 📊 Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Users" 
            value={stats?.totalUsers || 0} 
            icon={Users} 
            colorClass="text-blue-600"
            bgClass="bg-blue-50"
          />
          <StatCard 
            title="Registered Farmers" 
            value={stats?.totalFarmers || 0} 
            icon={Tractor} 
            colorClass="text-green-600"
            bgClass="bg-green-50"
          />
          <StatCard 
            title="Active Buyers" 
            value={stats?.totalBuyers || 0} 
            icon={ShoppingBag} 
            colorClass="text-orange-600"
            bgClass="bg-orange-50"
          />
          <StatCard 
            title="Total Crops Listed" 
            value={stats?.totalCrops || 0} 
            icon={Sprout} 
            colorClass="text-yellow-600"
            bgClass="bg-yellow-50"
          />
        </div>

        {/* Schemes Section - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Existing Schemes List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <Megaphone className="w-5 h-5 mr-2 text-green-600" />
                  Active Government Schemes
                </h2>
                <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-semibold">
                  {schemes.length} Active
                </span>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {schemes.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                    <Megaphone className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No schemes announced yet.</p>
                    <p className="text-xs text-gray-400">Use the form to create one.</p>
                  </div>
                ) : (
                  schemes.map((scheme) => (
                    <div
                      key={scheme._id}
                      className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-md transition-all duration-300"
                    >
                      {/* Left Border Accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500 rounded-l-xl"></div>
                      
                      <div className="pl-3 flex justify-between items-start">
                        <div className="flex-1 pr-8">
                          <h3 className="font-bold text-gray-900 text-lg mb-1 capitalize">
                            {scheme.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                            {scheme.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                            <span className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                              <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                              Valid till: {new Date(scheme.deadline).toLocaleDateString()}
                            </span>
                            {scheme.link && (
                              <a href={scheme.link} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-md transition-colors">
                                <LinkIcon className="w-3.5 h-3.5 mr-1.5" /> Apply Link
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteScheme(scheme._id)}
                          className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all absolute top-4 right-4"
                          title="Delete Scheme"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Add New Scheme Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-white bg-green-600 rounded-full p-1" />
                Add New Scheme
              </h2>

              <form onSubmit={handleAddScheme} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Scheme Title</label>
                  <input
                    type="text"
                    placeholder="e.g. PM Kisan Samman Nidhi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm text-gray-600 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Official Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full mt-1.5 pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Enter eligibility and benefits details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all resize-none text-sm font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={schemeLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-200 hover:shadow-green-300 flex justify-center items-center active:scale-95"
                >
                  {schemeLoading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 mr-2" /> Publishing...
                    </>
                  ) : "Publish Scheme"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;