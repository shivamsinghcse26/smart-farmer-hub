import React, { useEffect, useState } from "react";
import api from "../../Services/Api";
import { 
  Search, 
  Download, 
  Package, 
  Calendar, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronRight,
  Filter
} from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/orders/buyer", {
        withCredentials: true,
      });
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers ---

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status Badge Logic
  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed": return { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Confirmed" };
      case "delivered": return { color: "bg-blue-100 text-blue-700", icon: Truck, label: "Delivered" };
      case "rejected": return { color: "bg-red-100 text-red-700", icon: XCircle, label: "Cancelled" };
      default: return { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Pending" };
    }
  };

  // Professional Invoice Generator
  const handleDownloadInvoice = (order) => {
    const farmer = order.farmerId || {};
    const crop = order.cropId || {};
    const date = formatDate(order.createdAt);

    const invoiceHTML = `
      <html>
      <head>
        <title>Invoice #${order._id.slice(-6).toUpperCase()}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { color: #16a34a; font-size: 24px; font-weight: bold; }
          .invoice-details { text-align: right; }
          .section-title { font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th { text-align: left; background: #f9fafb; padding: 12px; font-size: 14px; border-bottom: 1px solid #ddd; }
          .table td { padding: 12px; border-bottom: 1px solid #eee; }
          .total-box { margin-top: 30px; text-align: right; }
          .total-row { display: flex; justify-content: flex-end; gap: 40px; padding: 5px 0; }
          .grand-total { font-size: 20px; font-weight: bold; color: #16a34a; }
          .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .paid { background: #dcfce7; color: #166534; }
          .unpaid { background: #fee2e2; color: #991b1b; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">KishanSetu 🌾</div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p>ID: #${order._id.slice(-6).toUpperCase()}</p>
            <p>Date: ${date}</p>
          </div>
        </div>

        <div class="grid">
          <div>
            <div class="section-title">Bill To</div>
            <p><strong>Buyer</strong></p>
            <p>${order.deliveryAddress || "Address not provided"}</p>
          </div>
          <div style="text-align: right;">
            <div class="section-title">Seller Details</div>
            <p><strong>${farmer.Name || "Farmer"}</strong></p>
            <p>${farmer.PhoneNo || ""}</p>
            <p>${farmer.EmailId || ""}</p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${crop.cropName}</strong><br>
                <small style="color:#777">${crop.location}</small>
              </td>
              <td>₹${order.pricePerKg}</td>
              <td>${order.quantityKg} kg</td>
              <td>₹${order.totalPrice}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${order.totalPrice}</span>
          </div>
          <div class="total-row">
            <span>Tax (0%):</span>
            <span>₹0.00</span>
          </div>
          <div class="total-row">
            <span class="grand-total">Grand Total:</span>
            <span class="grand-total">₹${order.totalPrice}</span>
          </div>
          <div style="margin-top: 15px;">
            Payment Status: 
            <span class="badge ${order.paymentStatus === 'paid' ? 'paid' : 'unpaid'}">
              ${order.paymentStatus ? order.paymentStatus.toUpperCase() : 'UNPAID'}
            </span>
          </div>
        </div>

        <div style="margin-top: 50px; text-align: center; color: #999; font-size: 12px;">
          Thank you for supporting local farmers via KishanSetu.
        </div>
      </body>
      </html>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(invoiceHTML);
    newWindow.document.close();
    setTimeout(() => newWindow.print(), 500);
  };

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.cropId?.cropName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">Track your purchases and download invoices</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white p-1 rounded-lg border shadow-sm flex">
            {["all", "pending", "confirmed", "delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  statusFilter === status
                    ? "bg-green-100 text-green-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by crop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <p className="text-gray-500 mt-1">Try changing your filters or browse the marketplace.</p>
          </div>
        )}

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusStyle = getStatusConfig(order.status);
            const StatusIcon = statusStyle.icon;

            return (
              <div 
                key={order._id} 
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500">
                    <div>
                      <span className="block text-xs uppercase tracking-wide font-semibold text-gray-400">Order Placed</span>
                      <span className="font-medium text-gray-900">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wide font-semibold text-gray-400">Total Amount</span>
                      <span className="font-medium text-gray-900">₹{order.totalPrice}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wide font-semibold text-gray-400">Order ID</span>
                      <span className="font-mono">#{order._id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Invoice
                      </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image / Icon */}
                    <div className="w-20 h-20 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-green-600" />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 capitalize">{order.cropId?.cropName || "Unknown Crop"}</h3>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {order.cropId?.location || "Location N/A"}
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                               <p className="text-gray-500">Seller</p>
                               <p className="font-medium">{order.farmerId?.Name || "Farmer"}</p>
                            </div>
                            <div>
                               <p className="text-gray-500">Quantity</p>
                               <p className="font-medium">{order.quantityKg} kg</p>
                            </div>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                           {/* Delivery Status */}
                           <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusStyle.color}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {statusStyle.label}
                           </div>

                           {/* Payment Status */}
                           <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                              order.paymentStatus === 'paid' 
                                ? "bg-white border-green-200 text-green-700" 
                                : "bg-white border-red-200 text-red-700"
                           }`}>
                              <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              {order.paymentStatus || "UNPAID"}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;