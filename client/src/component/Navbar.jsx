import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const Navbar = ({ setChatLang }) => {
  const { isLoggedIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [role, setRole] = useState("");


  // 1. Check if JavaScript can see any auth cookies (non-HttpOnly)
  const hasCookie = document.cookie.includes("refreshToken") || document.cookie.includes("accessToken");
  
  // 2. Check if there is a token in LocalStorage (fallback)
  const hasLocalToken = localStorage.getItem("token") || localStorage.getItem("user");

  // 3. Logic: Only show the "Loading Skeleton" if we suspect data exists.
  //    If NO data exists locally, we force the Login button to show INSTANTLY.
  const shouldWait = (hasCookie || hasLocalToken) && loading;
  // ------------------------------------------------------------------

  const userRole = (user?.Role || user?.role || "").toLowerCase();

  const languages = [
    { name: "English", code: "en", display: "English" },
    { name: "हिंदी", code: "hi", display: "हिंदी" },
    { name: "తెలుగు", code: "te", display: "తెలుగు" },
    { name: "বাংলা", code: "bn", display: "বাংলা" },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
    setIsLangOpen(false);
  }, [location]);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setChatLang(langCode);
    setIsLangOpen(false);
  };

  const getCurrentLanguageDisplay = () => {
    return languages.find((lang) => lang.code === i18n.language)?.display || "Language";
  };

  const handleContinue = () => {
    if (!role) return alert("Please select a role");
    navigate("/login", { state: { role } });
    setShowRoleModal(false);
  };

  const goToDashboard = () => {
    if (!userRole) return;
    const routes = {
      farmer: "/farmers/dashboard",
      buyer: "/buyers/dashboard",
      admin: "/admin/dashboard",
    };
    navigate(routes[userRole] || "/");
  };

  const navLinks = [
    { name: t("navbar.home"), path: "/" },
    { name: t("navbar.about"), path: "/about" },
    { name: t("navbar.chatbot"), path: "/chatbot" },
    { name: t("navbar.services"), path: "/services" },
    { name: t("navbar.contact"), path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50 h-16">
      <div className="container mx-auto px-4 flex justify-between items-center h-full">

        {/* Logo */}
        <div
          className="text-2xl font-bold text-green-700 cursor-pointer flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <span>🌱</span>
          <span>{t("navbar.logo")}</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-green-700 font-bold"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-100 transition text-sm text-gray-700"
            >
              🌐 <span>{getCurrentLanguageDisplay()}</span>
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-green-50 ${
                      i18n.language === lang.code ? "text-green-600 font-bold bg-green-50/50" : "text-gray-700"
                    }`}
                  >
                    {lang.display}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/*  AUTH BUTTON (OPTIMIZED) */}
          {/* Only show Skeleton if we FOUND a cookie/token locally AND API is still loading */}
          {shouldWait ? (
            <div className="w-28 h-10 bg-gray-200 rounded-lg animate-pulse" />
          ) : isLoggedIn ? (
            <button
              onClick={goToDashboard}
              className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition shadow-md font-medium text-sm flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => setShowRoleModal(true)}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-md font-medium text-sm"
            >
              {t("navbar.loginRegister")}
            </button>
          )}

        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={() => setShowRoleModal(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Welcome! 👋</h2>
              <button onClick={() => setShowRoleModal(false)} className="text-gray-400 hover:text-red-500">✕</button>
            </div>
            <p className="text-gray-600 mb-6 text-sm">Please select your role to continue.</p>
            <div className="space-y-3">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
              >
                <option value="">-- Choose Role --</option>
                <option value="farmer">Farmer</option>
                <option value="buyer"> Buyer</option>
                <option value="admin"> Admin</option>
              </select>
              <button
                onClick={handleContinue}
                disabled={!role}
                className="w-full py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all mt-4 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;