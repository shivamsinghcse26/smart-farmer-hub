import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { 
  Trash2, 
  MapPin, 
  Search, 
  Package, 
  IndianRupee, 
  User, 
  Calendar, 
  Leaf,
  Loader2,
  RefreshCcw
} from "lucide-react";

import AdminSidebar from "../../component/admin/AdminSlidebar";
import { deleteCropByAdmin, getAllCrops } from "../../Services/adminApi";

const AdminCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // New state to track which specific button is being pressed
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const res = await getAllCrops();
      setCrops(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch crops");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently remove this crop listing?")) return;

    setDeletingId(id); // Set the specific button to loading state
    
    try {
      await deleteCropByAdmin(id);
      toast.success("Crop removed successfully");
      
      // OPTIMISTIC UPDATE: Remove from UI immediately without re-fetching API
      // This prevents the whole screen from flashing loading skeletons
      setCrops((prevCrops) => prevCrops.filter((crop) => crop._id !== id));
      
    } catch (error) {
      toast.error("Failed to delete crop");
    } finally {
      setDeletingId(null); // Reset button state
    }
  };

  // Filter crops based on search
  const filteredCrops = crops.filter((c) =>
    c.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <AdminSidebar />
      <Toaster position="top-right" />

      <div className="flex-1 p-8 h-screen overflow-y-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Leaf className="text-green-600" />
              Crop Management
            </h1>
            <p className="text-gray-500 mt-1 ml-1">Monitor and moderate all farmer listings</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none shadow-sm"
              />
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            </div>
            <button 
              onClick={fetchCrops}
              className="p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
              title="Refresh List"
            >
              <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white h-72 rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No crops found</h3>
            <p className="text-gray-500">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCrops.map((c) => (
              <div
                key={c._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col"
              >
                {/* Image Area */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {c.image || c.imageUrl ? (
                    <img
                      src={c.image || c.imageUrl}
                      alt={c.cropName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-green-50">
                      <Leaf className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full shadow-sm backdrop-blur-md ${
                      c.quantity > 0 
                        ? "bg-green-500/90 text-white" 
                        : "bg-red-500/90 text-white"
                    }`}>
                      {c.quantity > 0 ? "Active" : "Sold Out"}
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-gray-900 capitalize truncate" title={c.cropName}>
                      {c.cropName}
                    </h2>
                    <p className="text-green-700 font-bold text-lg flex items-center">
                      <IndianRupee className="w-4 h-4" />{c.pricePerKg}
                      <span className="text-xs text-gray-500 font-normal ml-1">/kg</span>
                    </p>
                  </div>
                    
                  <div className="space-y-2 mt-2 text-sm text-gray-600 flex-1">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{c.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{c.quantity} kg available</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{c.farmerId?.Name || c.farmerName || "Unknown Farmer"}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-xs">
                        Added: {new Date(c.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Delete Button */}
                  <button
                    onClick={() => handleDelete(c._id)}
                    disabled={deletingId === c._id}
                    className={`mt-5 w-full border py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-medium text-sm ${
                      deletingId === c._id 
                        ? "bg-red-50 text-red-400 border-red-100 cursor-not-allowed"
                        : "bg-white border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
                    }`}
                  >
                    {deletingId === c._id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" /> Delete Listing
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCrops;