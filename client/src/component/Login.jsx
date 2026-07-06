import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import api from "../Services/Api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  // ✅ Role coming from Navbar modal
  const selectedRole = location.state?.role || "";

  const [formData, setFormData] = useState({
    identifier: "",
    Password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirectByRole = (role) => {
    const routes = {
      farmer: "/farmers/dashboard",
      buyer: "/buyers/dashboard",
      admin: "/admin/dashboard",
    };
    navigate(routes[role] || "/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.identifier || !formData.Password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/v1/users/login", formData, {
        withCredentials: true,
      });
      const user = response.data?.data?.user;
      const accessToken=response.data?.data?.accessToken;
      const userRole = user?.Role || user?.role;

      // ✅ Validation: Role Match
      // If user selected "Farmer" in Navbar, but logs in with a "Buyer" account:
      if (selectedRole && userRole && selectedRole !== userRole) {
        setError(`Access Denied: You are trying to log in as a ${selectedRole.toUpperCase()}, but this account is registered as a ${userRole.toUpperCase()}.`);
        setLoading(false);
        return;
      }

      setSuccess("Login successful! Welcome back.");
      loginUser(user,accessToken);
            // localStorage.setItem("accessToken", response.data.data.accessToken);


      setTimeout(() => {
        redirectByRole(userRole);
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-green-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-green-700">KishanSetu</h2>
          <p className="text-gray-500 mt-2">Welcome back! Please login.</p>
          
          {/* ✅ Role Context Badge */}
          {selectedRole && (
            <div className="mt-4 inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Role: {selectedRole}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded font-medium animate-shake">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border-l-4 border-green-500 rounded font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">Email or Phone</label>
            <input
              type="text"
              name="identifier"
              placeholder="Enter Email or Phone"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none transition bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">Password</label>
            <input
              type="password"
              name="Password"
              placeholder="Enter Password"
              value={formData.Password}
              onChange={handleChange}
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-400 outline-none transition bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm text-green-700 hover:underline font-medium"
            onClick={()=>navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register", { state: { role: selectedRole } })}
              className="text-green-700 font-bold hover:underline"
            >
              Register Now
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}