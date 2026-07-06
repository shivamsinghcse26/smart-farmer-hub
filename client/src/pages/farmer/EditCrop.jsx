import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../Services/Api";

const EditCrop = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    pricePerKg: "",
    location: "",
    availableFrom: "",
  });

  const [loadingData, setLoadingData] = useState(true); // Loading initial data
  const [submitting, setSubmitting] = useState(false); // Loading save action
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        // Ideally, you should have an API endpoint like: /api/v1/crops/:id
        // But we will use the dashboard logic you provided
        const res = await api.get("/api/v1/farmers/dashboard", {
          withCredentials: true,
        });

        // Safe navigation to avoid crashes if data structure differs
        const crops = res.data?.data?.crops || [];
        const crop = crops.find((c) => c._id === id);

        if (!crop) {
          setErrorMsg("Crop not found or permission denied.");
          setLoadingData(false);
          return;
        }

        setFormData({
          cropName: crop.cropName || "",
          quantity: crop.quantity || "",
          pricePerKg: crop.pricePerKg || "",
          location: crop.location || "",
          availableFrom: crop.availableFrom
            ? crop.availableFrom.split("T")[0]
            : "",
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMsg(
          error.response?.data?.message || "Failed to load crop details."
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchCrop();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      await api.put(`/api/v1/crops/crops/${id}`, formData, {
        withCredentials: true,
      });
      // Redirect on success
      navigate("/farmers/dashboard");
    } catch (error) {
      console.error("Update error:", error);
      setErrorMsg(
        error.response?.data?.message || "Failed to update crop. Please try again."
      );
      setSubmitting(false);
    }
  };

  /* ------------------- ICONS (SVGs) ------------------- */
  const Icons = {
    Leaf: () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    Scale: () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    Rupee: () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Map: () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Cal: () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    ArrowLeft: () => <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-green-600 px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🌱 Edit Crop Details
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-white/80 hover:text-white text-sm flex items-center transition-colors"
          >
            <Icons.ArrowLeft /> Back
          </button>
        </div>

        {/* BODY */}
        <div className="p-8">
          {errorMsg && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">
              <p className="font-bold">Error</p>
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Field: Crop Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Crop Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Leaf />
                </div>
                <input
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="e.g. Basmati Rice"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field: Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity (kg)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Scale />
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Field: Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price per Kg (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Rupee />
                  </div>
                  <input
                    type="number"
                    name="pricePerKg"
                    value={formData.pricePerKg}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="0.00"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Field: Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Farm Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Map />
                </div>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="Village, District"
                />
              </div>
            </div>

            {/* Field: Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Available From</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Cal />
                </div>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-600"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/farmers/dashboard")}
                className="w-1/3 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`w-2/3 py-3 rounded-lg font-semibold text-white shadow-md transition-all flex justify-center items-center gap-2 ${
                  submitting
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                }`}
              >
                {submitting ? (
                   <>
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     <span>Saving...</span>
                   </>
                ) : (
                  "Update Crop"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCrop;