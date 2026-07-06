import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Services/Api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Validation Rules
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Security Rule: Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please check again.");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/api/v1/auth/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });

      setSuccess("✅ Password reset successful! Redirecting to login...");
      
      // Redirect after 2.5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-green-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-green-700">KishanSetu</h2>
          <p className="text-gray-500 mt-2 font-medium">Reset Your Password</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border-l-4 border-green-500 rounded font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">New Password</label>
            <input
              type="password"
              placeholder="Enter at least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none transition bg-gray-50 focus:bg-white"
            />
            <p className="text-[10px] text-gray-400 ml-2 mt-1">* Minimum 8 characters required.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none transition bg-gray-50 focus:bg-white"
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
                Updating...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-gray-500 hover:text-green-700 transition font-medium"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;