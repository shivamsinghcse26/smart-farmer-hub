import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  User, 
  Phone, 
  Weight, 
  ArrowRight, 
  CheckCircle2,
  CalendarDays,
  Sprout
} from "lucide-react";

const CropCardBuyer = ({ crop }) => {
  const navigate = useNavigate();
  const farmer = crop?.farmerId;

  // 🎨 Helper: Get image based on crop name
  const getCropImage = (name) => {
    const cropName = name?.toLowerCase() || "";

    // VEGETABLES
    if (cropName.includes("potato") || cropName.includes("aloo")) 
      return "https://growhoss.com/cdn/shop/articles/potato_ecdbb7b2-3914-4edb-818d-eb6abfc66627_460x@2x.jpg?v=1761159166";
    
    if (cropName.includes("onion") || cropName.includes("pyaz")) 
      return "https://m.economictimes.com/thumb/msid-112117490,width-1600,height-900,resizemode-4,imgsize-120226/onion.jpg";
    
    if (cropName.includes("tomato")) 
      return "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80";

    // GRAINS
    if (cropName.includes("wheat") || cropName.includes("gehu")) 
      return "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80";
    
    if (cropName.includes("rice") || cropName.includes("paddy")) 
      return "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80";

    if (cropName.includes("corn") || cropName.includes("maize")) 
      return "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80";

    // OTHERS
    if (cropName.includes("sugarcane"))
      return "https://4.imimg.com/data4/QX/AP/MY-8729085/sugarcane-plant.jpg";

    // 🛑 DEFAULT FALLBACK (Generic Farm)
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80";
  };

  // 🏷️ Helper: Status Colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available": return "bg-green-500/90 text-white shadow-green-200";
      case "sold": return "bg-red-500/90 text-white shadow-red-200";
      default: return "bg-gray-500/90 text-white";
    }
  };

  // 🕒 Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-100 transition-all duration-300 overflow-hidden flex flex-col h-full">
      
      {/* 🖼️ IMAGE HEADER */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img 
          src={getCropImage(crop.cropName)} 
          alt={crop.cropName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          // ✅ ADDED: Fallback if specific crop image fails
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80";
          }}
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm ${getStatusColor(crop.status)}`}>
          {crop.status}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4">
           <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg flex items-baseline gap-1 border border-white/20">
             <span className="text-gray-500 text-[10px] font-bold uppercase mr-1">Price</span>
             <span className="text-green-700 font-black text-lg">₹{crop.pricePerKg}</span>
             <span className="text-xs text-gray-500 font-semibold">/kg</span>
           </div>
        </div>
      </div>

      {/* 📄 BODY CONTENT */}
      <div className="p-5 flex-1 flex flex-col relative">
        
        {/* Title & Date */}
        <div className="mb-4">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900 capitalize leading-snug group-hover:text-green-700 transition-colors line-clamp-1">
                {crop.cropName}
                </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2 font-medium">
               <CalendarDays className="w-3.5 h-3.5" /> 
               <span>Listed {formatDate(crop.createdAt)}</span>
            </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Quantity */}
          <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 flex items-center gap-3 transition-colors group-hover:bg-blue-50">
            <div className="bg-white p-1.5 rounded-lg shadow-sm text-blue-600">
              <Weight size={16} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Quantity</p>
              <p className="text-sm font-bold text-gray-700">{crop.quantity} kg</p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-orange-50/50 p-2.5 rounded-xl border border-orange-100 flex items-center gap-3 transition-colors group-hover:bg-orange-50">
            <div className="bg-white p-1.5 rounded-lg shadow-sm text-orange-600">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Location</p>
              <p className="text-sm font-bold text-gray-700 truncate max-w-[85px]" title={crop.location}>
                {crop.location || "India"}
              </p>
            </div>
          </div>
        </div>

        {/* 👨‍🌾 FARMER INFO (Detailed) */}
        {farmer && (
          <div className="mt-auto py-3 px-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 transition-colors hover:bg-white hover:shadow-md hover:border-green-100">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-700 border-2 border-green-100 shadow-sm shrink-0 overflow-hidden">
                {farmer.Avatar ? (
                    <img src={farmer.Avatar} className="w-full h-full object-cover" alt={farmer.Name} />
                ) : (
                    <User size={20} />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-gray-800 truncate">{farmer.Name}</p>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-white" />
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                   <Phone size={10} className="text-gray-400" /> 
                   <span>+91 {farmer.PhoneNo ? String(farmer.PhoneNo).slice(-4).padStart(10, '*') : "**********"}</span>
                </div>
            </div>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={() => navigate(`/buyers/marketplace/${crop._id}`)}
          className="mt-5 w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-green-600 active:scale-[0.98] transition-all shadow-lg shadow-gray-200 group-hover:shadow-green-200/50 flex items-center justify-center gap-2"
        >
          View Full Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
};

export default CropCardBuyer;