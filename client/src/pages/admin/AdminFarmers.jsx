import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  CheckCircle,
  Search,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Loader2,
  Sprout // Added Sprout icon for crops
} from "lucide-react";

import AdminSidebar from "../../component/admin/AdminSlidebar";
import { getAllFarmersForAdmin, verifyFarmer } from "../../Services/adminApi";

const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending"); // pending, verified, rejected, all
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const res = await getAllFarmersForAdmin();
      setFarmers(res.data.data);
    } catch (error) {
      toast.error("Failed to load farmer profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    setProcessingId(id);
    const actionText = status ? "Approved" : "Rejected";

    try {
      await verifyFarmer(id, status);
      toast.success(`Farmer profile ${actionText} successfully`);

      // Optimistic Update: Update local state without refetching
      setFarmers((prev) =>
        prev.map((f) => (f._id === id ? { ...f, verified: status } : f))
      );
    } catch (error) {
      console.error(error);
      toast.error("Action failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter Logic
  const filteredFarmers = farmers.filter((f) => {
    // 1. Search Filter
    const searchMatch =
      f.userId?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.userId?.EmailId?.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Tab Filter
    let statusMatch = true;
    if (filterStatus === "pending") statusMatch = !f.verified;
    if (filterStatus === "verified") statusMatch = f.verified === true;
    if (filterStatus === "all") statusMatch = true;

    return searchMatch && statusMatch;
  });

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <AdminSidebar />
      <Toaster position="top-right" />

      <div className="flex-1 p-8 h-screen overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-green-600" />
            Farmer Verification
          </h1>
          <p className="text-gray-500 mt-1 ml-10">
            Review and approve farmer account requests.
          </p>
        </div>

        {/* Controls: Tabs & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Status Tabs */}
          <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex">
            {[
              { id: "pending", label: "Pending Review" },
              { id: "verified", label: "Verified Farmers" },
              { id: "all", label: "All Accounts" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filterStatus === tab.id
                    ? "bg-green-100 text-green-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 shadow-sm bg-white"
            />
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-green-600" />
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No farmers found
            </h3>
            <p className="text-gray-500">
              No profiles match the current filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarmers.map((f) => (
              <div
                key={f._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-lg border border-green-100">
                        {f.userId?.Name?.charAt(0).toUpperCase() || "F"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {f.userId?.Name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ID: {f._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                    {f.verified ? (
                      <span className="bg-green-100 text-green-700 p-1 rounded-full">
                        <CheckCircle className="w-5 h-5" />
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3 flex-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="truncate">{f.userId?.EmailId}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{f.userId?.PhoneNo || "No Phone"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{f.Location || "Location not provided"}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <Sprout className="w-4 h-4 mr-3 text-gray-400 mt-0.5" />
                    <span className="line-clamp-2">
                      {f.CropGrown?.length > 0
                        ? f.CropGrown.join(", ")
                        : "No crops listed"}
                    </span>
                  </div>
                </div>

                {/* Card Footer / Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                  {f.verified ? (
                    <button
                      onClick={() => handleVerify(f._id, false)}
                      disabled={processingId === f._id}
                      className="col-span-2 w-full py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex justify-center items-center"
                    >
                      {processingId === f._id ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        "Revoke Verification"
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleVerify(f._id, false)}
                        disabled={processingId === f._id}
                        className="py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm font-medium"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleVerify(f._id, true)}
                        disabled={processingId === f._id}
                        className="py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex justify-center items-center shadow-sm"
                      >
                        {processingId === f._id ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          "Approve"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFarmers;