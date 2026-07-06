import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/Api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [EmailId, setEmailId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!EmailId) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!validateEmail(EmailId)) {
      setError("Please enter a valid email format (e.g., name@example.com).");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/v1/auth/forgot-password", { EmailId });
      
      setSuccess(res.data.message || "Reset link sent! Please check your inbox.");
      setEmailId(""); // Clear field on success
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-green-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-green-700">KishanSetu</h2>
          <p className="text-gray-500 mt-2 font-medium">Recover Your Account</p>
          <p className="text-xs text-gray-400 mt-1">We'll send a password reset link to your email.</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded font-medium animate-pulse">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border-l-4 border-green-500 rounded font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              value={EmailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none transition bg-gray-50 focus:bg-white"
              placeholder="Enter your registered email"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-green-700 font-bold hover:underline"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}