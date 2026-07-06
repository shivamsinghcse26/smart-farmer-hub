import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit3, Package, Tag, AlertCircle, X } from "lucide-react";
import api from "../Services/Api";

const CropCard = ({ crop, onRefresh }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/v1/crops/crops/${crop._id}`, {
        withCredentials: true,
      });
      onRefresh();
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete crop");
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ Enhanced Badge Styles
  const statusStyles = {
    available: "bg-emerald-100 text-emerald-700 border-emerald-200",
    sold: "bg-rose-100 text-rose-700 border-rose-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
  };

  const isSoldOut = crop.status === "sold" || crop.quantity === 0;

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
        {/* Status Badge Top Right */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyles[crop.status] || statusStyles.pending}`}>
            {crop.status}
          </span>
        </div>

        {/* Icon & Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Package size={20} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg capitalize">{crop.cropName}</h3>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-slate-600 text-sm">
            <Tag size={16} className="mr-2 opacity-70" />
            <span className="font-medium mr-1">Price:</span> 
            <span className="text-slate-900 font-semibold">₹{crop.pricePerKg}/kg</span>
          </div>

          <div className="flex items-center text-sm">
            <AlertCircle size={16} className="mr-2 opacity-70" />
            <span className="font-medium mr-1 text-slate-600">Inventory:</span>
            {isSoldOut ? (
              <span className="text-rose-600 font-bold italic underline decoration-rose-200">Sold Out</span>
            ) : (
              <span className="text-slate-900 font-semibold">{crop.quantity} kg</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            disabled={isSoldOut}
            onClick={() => navigate(`/farmers/edit-crop/${crop._id}`)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isSoldOut
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-emerald-200"
            }`}
          >
            <Edit3 size={16} /> Edit
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border-2 border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors duration-200"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {isSoldOut && (
          <p className="text-[10px] text-slate-400 mt-3 text-center italic">
            Locked: This listing has been marked as sold.
          </p>
        )}
      </div>

      {/* ✅ CUSTOM DELETE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-full">
                <AlertCircle size={24} />
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Crop Listing?</h3>
            <p className="text-slate-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-slate-800">"{crop.cropName}"</span>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CropCard;