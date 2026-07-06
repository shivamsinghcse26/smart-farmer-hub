import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, MapPin, Ruler, Sprout, Clock, Save, ArrowRight } from "lucide-react";
import api from "../../Services/Api";

const FarmerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 1. Get the current route state

  const [formData, setFormData] = useState({
    LandSize: "",
    CropGrown: "", // String for input, Array for API
    Experience: "",
    Location: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const res = await api.get("/api/v1/farmers/dashboard", { withCredentials: true });
      const profile = res.data?.data?.farmerProfile;

      // 2. Logic to prevent Infinite Loop
      if (profile) {
        const isEditMode = location.state?.mode === 'edit';

        if (isEditMode) {
          // If in Edit Mode: Fill form and stay here
          setFormData({
            LandSize: profile.LandSize || "",
            // Convert Array ["Wheat", "Rice"] -> String "Wheat, Rice"
            CropGrown: profile.CropGrown ? profile.CropGrown.join(", ") : "",
            Experience: profile.Experience || "",
            Location: profile.Location || "",
          });
          setIsEditing(true);
        } else {
          // If NOT in Edit Mode and profile exists: Redirect to dashboard
          navigate("/farmers/dashboard");
        }
      }
    } catch (error) {
      console.log("No existing profile found. User is onboarding.");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Prepare Payload
    const payload = {
      ...formData,
      // Convert String "Wheat, Rice" -> Array ["Wheat", "Rice"]
      CropGrown: formData.CropGrown.split(",").map((c) => c.trim()).filter(Boolean),
    };

    try {
      // 3. Use PUT if editing, POST if creating (Adjust URL if your backend requires a different endpoint for update)
      const method = isEditing ? 'put' : 'post';
      // If your API uses the same endpoint for both, keep it as 'post' or adjust accordingly.
      // Assuming /profile handles upsert or separate endpoint:
      const url = "/api/v1/farmers/profile"; 
      
      // If using standard REST, update might be api.put
      await api.post(url, payload, { withCredentials: true });

      setMessage({ type: "success", text: "✅ Profile saved successfully!" });
      
      // Short delay before redirect
      setTimeout(() => {
        navigate("/farmers/dashboard");
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.response?.data?.message || "❌ Failed to save profile." });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isEditing ? "Edit Profile" : "Farmer Profile"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isEditing ? "Update your farming details below" : "Tell us about your farm to get started"}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {message.text && (
            <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            
            {/* Land Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land Size (Acres)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="LandSize"
                  type="number"
                  required
                  value={formData.LandSize}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="e.g. 5.5"
                />
              </div>
            </div>

            {/* Crops */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crops Grown</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sprout className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="CropGrown"
                  type="text"
                  required
                  value={formData.CropGrown}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Wheat, Rice, Maize"
                />
                <p className="mt-1 text-xs text-gray-500 text-right">Separate multiple crops with commas</p>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Farming Experience (Years)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="Experience"
                  type="number"
                  required
                  value={formData.Experience}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / Village</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="Location"
                  type="text"
                  required
                  value={formData.Location}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="City, District"
                />
              </div>
            </div>

          </div>

          <div className="flex gap-4">
             {/* Cancel Button (Only if editing) */}
             {isEditing && (
              <button
                type="button"
                onClick={() => navigate("/farmers/dashboard")}
                className="group relative w-1/3 flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
             )}

            <button
              type="submit"
              disabled={loading}
              className={`group relative ${isEditing ? 'w-2/3' : 'w-full'} flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg shadow-green-200 transition-all`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                   {isEditing ? <Save className="mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                   {isEditing ? "Update Profile" : "Save & Continue"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerProfile;