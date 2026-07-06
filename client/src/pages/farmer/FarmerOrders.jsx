import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { 
  Package, 
  User, 
  MapPin, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Clock, 
  IndianRupee,
  Calendar,
  Loader2,
  Filter
} from "lucide-react";
import api from "../../Services/Api";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/orders/farmer", {
        withCredentials: true,
      });
      setOrders(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setProcessingId(orderId);
    const actionText = status === "confirmed" ? "Accepted" : status === "rejected" ? "Rejected" : "Delivered";
    
    try {
      await api.put(
        `/api/v1/orders/${orderId}/status`,
        { status },
        { withCredentials: true }
      );

      toast.success(`Order ${actionText} successfully!`);
      
      // Optimistic Update
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: status } : order
      ));

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    if (filterStatus === "all") return true;
    if (filterStatus === "pending") return order.status === "pending";
    if (filterStatus === "active") return order.status === "confirmed"; // 'confirmed' means active/in-progress
    if (filterStatus === "completed") return ["delivered", "rejected"].includes(order.status);
    return true;
  });

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Pending" },
      confirmed: { color: "bg-blue-100 text-blue-700", icon: Package, label: "To Ship" },
      delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Delivered" },
      rejected: { color: "bg-red-100 text-red-700", icon: XCircle, label: "Rejected" },
    };
    const { color, icon: Icon, label } = config[status] || config.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" /> {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="text-green-600" /> 
              Orders Received
            </h1>
            <p className="text-gray-500 mt-1">Manage your incoming crop orders.</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex overflow-x-auto max-w-full">
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "New Requests" },
              { id: "active", label: "To Deliver" },
              { id: "completed", label: "History" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filterStatus === tab.id
                    ? "bg-green-100 text-green-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-green-600" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <p className="text-gray-500">You don't have any orders in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((o) => (
              <div 
                key={o._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                
                {/* Card Top: Crop & Date */}
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-2 rounded-full border border-gray-200">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 capitalize text-sm">{o.cropId?.cropName || "Unknown Crop"}</h3>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(o.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>

                {/* Card Body: Info */}
                <div className="p-5 flex-1 space-y-4">
                  
                  {/* Financials */}
                  <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                    <div>
                      <p className="text-xs text-green-700 font-medium uppercase">Order Value</p>
                      <p className="text-lg font-bold text-green-800 flex items-center">
                        <IndianRupee className="w-4 h-4" /> {o.totalPrice}
                      </p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-green-700 font-medium uppercase">Quantity</p>
                       <p className="text-lg font-bold text-green-800">{o.quantityKg} <span className="text-sm font-normal">kg</span></p>
                    </div>
                  </div>

                  {/* Buyer Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{o.buyerId?.Name || "Buyer"}</p>
                        <a href={`tel:${o.buyerId?.PhoneNo}`} className="text-blue-600 hover:underline text-xs flex items-center mt-1">
                          <Phone className="w-3 h-3 mr-1" /> {o.buyerId?.PhoneNo || "No Phone"}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-gray-600 leading-snug">
                        {o.deliveryAddress || "Address not provided"}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Card Bottom: Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  {o.status === "pending" && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => updateStatus(o._id, "rejected")}
                        disabled={processingId === o._id}
                        className="py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors flex justify-center items-center"
                      >
                         Reject
                      </button>
                      <button
                        onClick={() => updateStatus(o._id, "confirmed")}
                        disabled={processingId === o._id}
                        className="py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium text-sm transition-colors shadow-sm flex justify-center items-center"
                      >
                        {processingId === o._id ? <Loader2 className="animate-spin w-4 h-4" /> : "Accept Order"}
                      </button>
                    </div>
                  )}

                  {o.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(o._id, "delivered")}
                      disabled={processingId === o._id}
                      className="w-full py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors shadow-sm flex justify-center items-center"
                    >
                       {processingId === o._id ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Truck className="w-4 h-4 mr-2" />}
                       Mark as Delivered
                    </button>
                  )}

                  {(o.status === "delivered" || o.status === "rejected") && (
                    <div className="text-center text-xs text-gray-400 font-medium py-2">
                      Order Closed
                    </div>
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

export default FarmerOrders;