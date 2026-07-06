import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  MapPin,
  Package,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Phone,
  User,
  ShoppingBag
} from "lucide-react";

import api from "../../Services/Api";
import { getCropDetailsForBuyer, placeOrder } from "../../Services/buyerApi.js";

const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [qty, setQty] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const pricePerKg = crop?.pricePerKg || 0;
  const totalAmount = (Number(qty) || 0) * pricePerKg;

  useEffect(() => {
    fetchCrop();
  }, [id]);

  const fetchCrop = async () => {
    setLoading(true);
    try {
      const res = await getCropDetailsForBuyer(id);
      setCrop(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load crop details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------
     🖼️ HELPER: Get Image based on Crop Name (Same as Card)
     ------------------------------------------------------------ */
  const getCropImage = (name) => {
    const cropName = name?.toLowerCase() || "";
    if (cropName.includes("wheat")) return "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80";
    if (cropName.includes("rice") || cropName.includes("paddy")) return "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80";
    if (cropName.includes("potato")) return "https://images.unsplash.com/photo-1518977676651-71f64657baa2?w=800&q=80";
    if (cropName.includes("tomato")) return "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80";
    if (cropName.includes("onion")) return "https://images.unsplash.com/photo-1618512496248-a07fe83aa82e?w=800&q=80";
    if (cropName.includes("corn") || cropName.includes("maize")) return "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80";
    if (cropName.includes("cotton")) return "https://images.unsplash.com/photo-1594301980637-772921ba0989?w=800&q=80";
    if (cropName.includes("sugarcane")) return "https://images.unsplash.com/photo-1596450523825-72439f041cb6?w=800&q=80";
    // Fallback Generic Farm Image
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80";
  };

  const handlePayNow = async () => {
    if (!qty || Number(qty) <= 0) return toast.error("Please enter a valid quantity");
    if (Number(qty) > crop.quantity) return toast.error(`Only ${crop.quantity}kg available`);
    if (!deliveryAddress.trim()) return toast.error("Delivery address is required");
    if (!window.Razorpay) return toast.error("Payment system not loaded.");

    setProcessing(true);

    try {
      const orderRes = await placeOrder({
        cropId: crop._id,
        quantityKg: Number(qty),
        deliveryAddress,
      });

      const dbOrder = orderRes.data.data;

      const payRes = await api.post(
        "/api/v1/payments/create-order",
        { orderId: dbOrder._id },
        { withCredentials: true }
      );

      const { razorpayOrderId, amount, currency } = payRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "KishanSetu",
        description: `Order for ${crop.cropName}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post(
              "/api/v1/payments/verify",
              {
                orderId: dbOrder._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            toast.success("Payment Successful!");
            navigate("/buyers/orders");
          } catch (err) {
            toast.error("Verification failed");
          }
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Order failed");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  if (!crop) return <div className="text-center p-10">Crop not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-green-700 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: IMAGE & DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* 🖼️ Main Image with Gradient Overlay */}
              <div className="relative h-72 sm:h-96 w-full">
                <img 
                  src={ getCropImage(crop.cropName)} 
                  alt={crop.cropName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 text-white">
                    <h1 className="text-4xl font-extrabold capitalize mb-2">{crop.cropName}</h1>
                    <div className="flex items-center gap-2 opacity-90">
                      <MapPin className="w-5 h-5 text-green-400" />
                      <span className="font-medium text-lg">{crop.location || "Location Unknown"}</span>
                    </div>
                </div>
              </div>

              <div className="p-8">
                {/* Farmer / Seller Info */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-700 shadow-sm">
                         <User className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-xs text-green-600 font-bold uppercase tracking-wide">Sold By</p>
                         <h3 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                           {crop.farmerId?.Name || "Verified Farmer"}
                           <CheckCircle2 className="w-4 h-4 text-blue-500" fill="white" />
                         </h3>
                      </div>
                   </div>
                   <div className="hidden sm:block">
                      <span className="px-4 py-2 bg-white text-green-700 text-sm font-bold rounded-lg shadow-sm border border-green-100">
                        Top Rated Seller
                      </span>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl text-center hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200">
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Quality Grade</p>
                     <p className="text-xl font-bold text-gray-800">Premium</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200">
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Shelf Life</p>
                     <p className="text-xl font-bold text-gray-800">10 Days</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200">
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Harvest Date</p>
                     <p className="text-xl font-bold text-gray-800">{new Date(crop.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3">About this Produce</h3>
                   <p className="text-gray-600 leading-relaxed text-lg">
                     {crop.description || "Freshly harvested produce listed directly by the farmer. This lot has been verified for quality and standard weight compliance."}
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CHECKOUT CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-medium">Price per kg</span>
                <span className="text-3xl font-black text-green-700">₹{pricePerKg}</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quantity Required (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      min="1"
                      max={crop.quantity}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none font-bold text-lg"
                      placeholder="0"
                    />
                    <Package className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-right font-medium">
                    Available Stock: <span className="text-gray-800">{crop.quantity} kg</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Location</label>
                  <div className="relative">
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none resize-none font-medium"
                      rows={3}
                      placeholder="Enter full address..."
                    />
                    <MapPin className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-gray-500">Subtotal</span>
                   <span className="font-bold text-gray-800">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                   <span className="text-gray-500">Service Fee</span>
                   <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                   <span className="text-lg font-bold text-gray-900">Total Payable</span>
                   <span className="text-2xl font-black text-gray-900">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePayNow}
                disabled={processing || crop.quantity <= 0}
                className={`mt-8 w-full py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 transition-all transform active:scale-95 ${
                  processing || crop.quantity <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-gray-900 text-white hover:bg-green-600 hover:shadow-green-200"
                }`}
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Buy Now
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                Payments verified & secured by Razorpay
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CropDetails;