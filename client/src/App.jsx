import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./component/Home.jsx";
import Navbar from "./component/Navbar.jsx";
import Login from "./component/Login.jsx";
import Contact from "./component/Contact.jsx";
import ChatBot from "./component/ChatBot.jsx";
import Services from "./component/Services.jsx";
import ChatBotWrapper from "./component/ChatBotWrapper.jsx";
import Register from "./component/Register.jsx";
import ForgotPassword from "./component/ForgetPassword.jsx";
import ResetPassword from "./component/ResetPassword.jsx";
import About from "./component/About.jsx";

import FarmerProtectedRoute from "./routes/FarmerProtectedRoute.jsx";
import BuyerProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminProtectedRoute from "./routes/AdminProtectedRoute.jsx";

import FarmerDashboard from "./pages/farmer/FarmerDashBoard.jsx";
import EditCrop from "./pages/farmer/EditCrop.jsx";
import AddCrop from "./pages/farmer/AddCrop.jsx";
import FarmerProfile from "./pages/farmer/FarmerProfile.jsx";
import FarmerOrders from "./pages/farmer/FarmerOrders.jsx";

// Buyer Pages
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import Marketplace from "./pages/buyer/Marketplace.jsx";
import CropDetails from "./pages/buyer/CropDetails.jsx";
import BuyerProfile from "./pages/buyer/BuyerProfile.jsx";
import MyOrders from "./pages/buyer/MyOrder.jsx";

// Admin Pages
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminCrops from "./pages/admin/AdminCrops.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminFarmers from "./pages/admin/AdminFarmers.jsx";
import AdminSchemes from "./pages/admin/AdminSchemes.jsx";

export default function App() {
  const [chatLang, setChatLang] = useState("hi");

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && (
        <>
          <Navbar setChatLang={setChatLang} />
          <ChatBotWrapper />
        </>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/chatbot" element={<ChatBot chatLang={chatLang} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Farmer Protected Routes */}
        <Route element={<FarmerProtectedRoute />}>
          <Route path="/farmers/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmers/profile" element={<FarmerProfile />} />
          <Route path="/farmers/edit-crop/:id" element={<EditCrop />} />
          <Route path="/farmers/add-crop" element={<AddCrop />} />
          <Route path="/farmers/orders" element={<FarmerOrders />} />
        </Route>

        {/* Buyer Protected Routes */}
        <Route element={<BuyerProtectedRoute />}>
          <Route path="/buyers/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyers/marketplace" element={<Marketplace />} />
          <Route path="/buyers/marketplace/:id" element={<CropDetails />} />
          <Route path="/buyers/profile" element={<BuyerProfile />} />
          <Route path="/buyers/orders" element={<MyOrders />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/crops" element={<AdminCrops />} />
          <Route path="/admin/farmers" element={<AdminFarmers />} />
          <Route path="/admin/schemes" element={<AdminSchemes />} />
        </Route>
      </Routes>
    </>
  );
}
