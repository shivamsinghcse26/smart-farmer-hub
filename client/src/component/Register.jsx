import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../Services/Api";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = location.state?.role || "farmer";

  const [formData, setFormData] = useState({
    Name: "",
    PhoneNo: "",
    EmailId: "",
    Password: "",
    Address: "",
    Role: initialRole,
    adminSecret: "", // ADDED FIELD
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (location.state?.role) {
      setFormData((prev) => ({ ...prev, Role: location.state.role }));
    }
  }, [location.state?.role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  //  ENHANCED VALIDATION LOGIC
  const validateForm = () => {
    const { Name, PhoneNo, EmailId, Password, Address, Role, adminSecret } = formData;

    if (!Name || !PhoneNo || !EmailId || !Password || !Address) {
      return "All fields are mandatory.";
    }

    //  NEW RULE: Admin Secret Check
    if (Role === "admin" && !adminSecret) {
      return "Admin Secret Key is required to register as Admin.";
    }

    // Rule: Name must not contain numbers or special characters
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(Name)) {
      return "Name should only contain letters and spaces (No numbers allowed).";
    }

    // Rule: Phone number must be exactly 10 digits
    if (!/^[0-9]{10}$/.test(PhoneNo)) {
      return "Phone number must be exactly 10 digits.";
    }

    // Rule: Valid Email
    if (!/^\S+@\S+\.\S+$/.test(EmailId)) {
      return "Please enter a valid email address.";
    }

    // Rule: Password must be at least 8 characters
    if (Password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        // ✅ Only append adminSecret if role is admin
        if (key === "adminSecret" && formData.Role !== "admin") return;
        data.append(key, formData[key]);
      });

      await api.post("/api/v1/users/register", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      // ✅ Handle Specific Backend Message for Secret Key Mismatch
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4 py-10">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-green-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-green-700">KishanSetu</h2>
          <p className="text-gray-500">Create your <span className="text-green-600 font-bold uppercase">{formData.Role}</span> account</p>
        </div>

        {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded font-medium">{error}</div>}
        {success && <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border-l-4 border-green-500 rounded font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Input */}
          <div>
            <input
              type="text"
              name="Name"
              placeholder="Full Name"
              value={formData.Name}
              onChange={handleChange}
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none transition"
            />
            <p className="text-[10px] text-gray-400 ml-2 mt-1">* Only letters allowed, no numbers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Input */}
            <div>
              <input
                type="text"
                name="PhoneNo"
                placeholder="Phone Number"
                value={formData.PhoneNo}
                onChange={handleChange}
                maxLength={10}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none transition"
              />
              <p className="text-[10px] text-gray-400 ml-2 mt-1">* Exactly 10 digits.</p>
            </div>

            {/* Role Select (Read-only styled) */}
            <div>
                <select
                name="Role"
                value={formData.Role}
                onChange={handleChange}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none bg-white transition"
                >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
                </select>
            </div>
          </div>

          {/* NEW ADMIN SECRET FIELD */}
          {formData.Role === "admin" && (
            <div>
              <input
                type="password"
                name="adminSecret"
                placeholder="Enter Admin Secret Key"
                value={formData.adminSecret}
                onChange={handleChange}
                className="w-full border-2 border-red-200 bg-red-50 text-red-700 p-3 rounded-xl focus:border-red-400 outline-none transition placeholder-red-300"
              />
              <p className="text-[10px] text-red-400 ml-2 mt-1">* Required for Admin Registration</p>
            </div>
          )}

          <input
            type="email"
            name="EmailId"
            placeholder="Email Address"
            value={formData.EmailId}
            onChange={handleChange}
            className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none transition"
          />

          <input
            type="text"
            name="Address"
            placeholder="Full Address (Village/City, State)"
            value={formData.Address}
            onChange={handleChange}
            className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none transition"
          />

          {/* Password Input */}
          <div>
            <input
              type="password"
              name="Password"
              placeholder="Create Password"
              value={formData.Password}
              onChange={handleChange}
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none transition"
            />
            <p className="text-[10px] text-gray-400 ml-2 mt-1">* Minimum 8 characters required.</p>
          </div>

          {/* Profile Picture */}
          <div className="flex items-center space-x-4 p-3 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
            <div className="w-14 h-14 bg-white rounded-full overflow-hidden flex-shrink-0 border-2 border-green-200">
              {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-[10px] text-gray-400">No Image</div>}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-600 mb-1">Profile Photo (Optional)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-green-600 file:text-white cursor-pointer" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Register Now"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")} className="text-green-700 font-bold hover:underline">Sign In</button>
          </p>
        </form>
      </div>
    </div>
  );
}