import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  ArrowLeft, 
  Loader2 
} from "lucide-react";
import { getBuyerProfile, setBuyerProfile } from "../../Services/buyerApi";
import api from "../../Services/Api"; // Import generic api if needed for user details fallback

const BuyerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [formData, setFormData] = useState({
    Name: "",       // Controller allows updating Name
    PhoneNo: "",    // Controller allows updating Phone
    Address: "",    // Controller expects Address
  });

  const [email, setEmail] = useState(""); // Email is usually read-only
  const [loading, setLoading] = useState(false);       
  const [fetching, setFetching] = useState(true);      
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      setFetching(true);
      
      // We try to get the profile. 
      // Note: Your controller throws 404 if not found, so we catch that.
      const res = await getBuyerProfile().catch(err => {
        // If 404, it means profile doesn't exist yet, but we need User info.
        // We can fetch basic user info from a different endpoint or use local storage
        // Assuming your 'getBuyerProfile' might fail, let's look at the error response
        return err.response; 
      });

      const data = res?.data?.data; // The payload from ApiResponse

      // LOGIC: If profile exists (has an ID or Address) AND not editing -> Dashboard
      if (data && data.Address && location.state?.mode !== "edit") {
         navigate("/buyers/dashboard");
         return;
      }

      // Populate Form Data
      if (data) {
        // Data usually contains { _id, userId: { Name, EmailId... }, Address: ... }
        // OR if it's the 404 case, we might need to rely on what 'req.user' would return 
        // from a "getUser" endpoint. 
        
        // If data.userId is populated object:
        const userObj = data.userId || {};
        
        setFormData({
          Name: userObj.Name || "",
          PhoneNo: userObj.PhoneNo || "",
          Address: data.Address || "", 
        });
        setEmail(userObj.EmailId || "");
      } else {
        // If completely new (404), try to fetch basic user details to pre-fill Name/Email
        // This part depends on if you have a /users/current endpoint. 
        // For now, we leave blank or rely on localStorage.
        const userStr = localStorage.getItem("user");
        if(userStr) {
            const u = JSON.parse(userStr);
            setFormData(prev => ({...prev, Name: u.Name || ""}));
            setEmail(u.EmailId || "");
        }
      }

    } catch (error) {
      console.error("Profile check error:", error);
      // Fallback: load from localStorage if API fails (e.g. 404 profile not found)
      const userStr = localStorage.getItem("user");
      if(userStr) {
          const u = JSON.parse(userStr);
          setFormData(prev => ({...prev, Name: u.Name || ""}));
          setEmail(u.EmailId || "");
      }
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Client-side validation matching controller constraints
    if (!formData.Address || formData.Address.trim().length < 3) {
      setMessage({ type: "error", text: "Address must be at least 3 characters." });
      return;
    }

    try {
      setLoading(true);

      // Matches controller: { Name, PhoneNo, Address }
      await setBuyerProfile({
        Name: formData.Name,
        PhoneNo: formData.PhoneNo,
        Address: formData.Address
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });
      
      // Update local storage name if changed, just for UI consistency
      const userStr = localStorage.getItem("user");
      if(userStr) {
          const u = JSON.parse(userStr);
          u.Name = formData.Name;
          localStorage.setItem("user", JSON.stringify(u));
      }

      setTimeout(() => {
        navigate("/buyers/dashboard");
      }, 1500);

    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to update profile." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-green-600 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" /> Buyer Profile
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Complete your profile to access the marketplace
            </p>
          </div>
          {/* Show back button only if in edit mode (implies dashboard access exists) */}
          {location.state?.mode === "edit" && (
            <button 
              onClick={() => navigate("/buyers/dashboard")}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 sm:p-8">
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg text-sm font-medium flex items-center ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Read-Only Field: Email (Since controller doesn't update email) */}
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-3">
             <div className="bg-white p-2 rounded-full text-blue-600">
                <Mail size={18} />
             </div>
             <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Registered Email</p>
                <p className="text-gray-700 font-medium">{email || "N/A"}</p>
             </div>
          </div>

          {/* Editable Form */}
          <form onSubmit={handleSave} className="space-y-5">
            
            {/* Personal Details (User Model) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1  items-center gap-1">
                    <User className="w-4 h-4 text-gray-400" /> Full Name
                  </label>
                  <input
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="John Doe"
                    minLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1  items-center gap-1">
                    <Phone className="w-4 h-4 text-gray-400" /> Phone Number
                  </label>
                  <input
                    name="PhoneNo"
                    value={formData.PhoneNo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
            </div>

            {/* Address (Buyer Model) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1  items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" /> Complete Address
              </label>
              <textarea
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                rows="3"
                placeholder="Flat No, Street, City, State, Pincode..."
                required
                minLength={3}
              />
              <p className="text-xs text-gray-400 mt-1">Please include City and Pincode in this field.</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save & Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfile;