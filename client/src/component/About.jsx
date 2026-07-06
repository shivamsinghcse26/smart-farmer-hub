import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sprout, 
  ShoppingCart, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  CreditCard,
  MapPin,
  Clock,
  LayoutDashboard,
  Search
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
// --- Animation Variants ---
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function AboutPage() {
    const navigate=useNavigate();
  const [activeTab, setActiveTab] = useState("farmer");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-b from-green-900 to-green-800 text-white pt-24 pb-32 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-green-700 border border-green-500 text-sm font-medium mb-4">
              Direct Marketplace
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              About <span className="text-green-400">KishanSetu</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Bridging the gap between farmers and buyers. No middlemen. Just fresh produce and fair trade.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- MISSION & VISION --- */}
      <section className="py-16 px-6 -mt-20 relative z-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <VisionCard 
            icon={<ShieldCheck className="w-10 h-10 text-green-600" />}
            title="Transparent"
            desc="No hidden fees. Direct pricing visibility for both parties."
          />
          <VisionCard 
            icon={<TrendingUp className="w-10 h-10 text-blue-600" />}
            title="Fair"
            desc="Farmers get better rates, buyers get fresher produce."
          />
          <VisionCard 
            icon={<Smartphone className="w-10 h-10 text-purple-600" />}
            title="Digital"
            desc="Modern tech stack enabling real-time tracking and payments."
          />
        </div>
      </section>

      {/* --- PLATFORM ARCHITECTURE FLOW --- */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-slate-900">Platform Architecture</h2>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            <ArchStep label="Farmer" icon={<Sprout />} />
            <ArrowRight className="text-slate-300 hidden md:block" />
            <ArchStep label="List Crop" icon={<LayoutDashboard />} />
            <ArrowRight className="text-slate-300 hidden md:block" />
            <ArchStep label="Marketplace" icon={<Users />} />
            <ArrowRight className="text-slate-300 hidden md:block" />
            <ArchStep label="Buyer Order" icon={<ShoppingCart />} />
            <ArrowRight className="text-slate-300 hidden md:block" />
            <ArchStep label="Payment" icon={<CreditCard />} />
            <ArrowRight className="text-slate-300 hidden md:block" />
            <ArchStep label="Delivery" icon={<MapPin />} />
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE WORKFLOWS (Tabs) --- */}
      <section className="py-20 px-6 bg-green-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-600">Select a role to see the step-by-step journey.</p>
            
            {/* Tab Switcher */}
            <div className="flex justify-center mt-8 gap-4">
              <button 
                onClick={() => setActiveTab("farmer")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === "farmer" 
                    ? "bg-green-600 text-white shadow-lg scale-105" 
                    : "bg-white text-slate-600 hover:bg-green-100"
                }`}
              >
                <Sprout size={20} /> For Farmers
              </button>
              <button 
                onClick={() => setActiveTab("buyer")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === "buyer" 
                    ? "bg-blue-600 text-white shadow-lg scale-105" 
                    : "bg-white text-slate-600 hover:bg-blue-50"
                }`}
              >
                <ShoppingCart size={20} /> For Buyers
              </button>
            </div>
          </div>

          {/* Workflow Content */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
            {activeTab === "farmer" ? (
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={staggerContainer}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold text-green-800 mb-6">Farmer Workflow 🌾</h3>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-green-100"></div>
                    
                    <WorkflowStep 
                      number="1" 
                      title="Create Account" 
                      desc="Register and complete profile verification." 
                    />
                    <WorkflowStep 
                      number="2" 
                      title="Add Crop Listing" 
                      desc="Enter details: Crop Name, Quantity, Price/kg, and Location." 
                    />
                    <WorkflowStep 
                      number="3" 
                      title="Receive Orders" 
                      desc="Orders appear in Dashboard. Status: Pending." 
                    />
                    <WorkflowStep 
                      number="4" 
                      title="Action Order" 
                      desc="Confirm or Reject. Confirming reduces stock automatically." 
                    />
                    <WorkflowStep 
                      number="5" 
                      title="Get Paid" 
                      desc="Payment recorded in dashboard after delivery confirmation." 
                    />
                  </div>
                  <div className="bg-green-50 rounded-2xl p-8 flex flex-col justify-center">
                     <h4 className="font-bold text-lg mb-4 text-green-800">Key Farmer Features</h4>
                     <ul className="space-y-3">
                        <FeatureItem text="Crop Listing Management" />
                        <FeatureItem text="Real-time Order Alerts" />
                        <FeatureItem text="Earnings & Statistics Dashboard" />
                        <FeatureItem text="Direct Customer Access" />
                     </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={staggerContainer}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold text-blue-800 mb-6">Buyer Workflow 🛒</h3>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-blue-100"></div>
                    
                    <WorkflowStep 
                      number="1" 
                      title="Browse Marketplace" 
                      desc="View available crops, prices, and farmer ratings."
                      color="blue" 
                    />
                    <WorkflowStep 
                      number="2" 
                      title="View Details" 
                      desc="Select quantity and set delivery address."
                      color="blue" 
                    />
                    <WorkflowStep 
                      number="3" 
                      title="Place Order" 
                      desc="Order created. Status: Pending. Payment: Unpaid."
                      color="blue" 
                    />
                    <WorkflowStep 
                      number="4" 
                      title="Pay Securely" 
                      desc="Razorpay integration. Status updates to 'Paid' instantly."
                      color="blue" 
                    />
                    <WorkflowStep 
                      number="5" 
                      title="Track Order" 
                      desc="Monitor status: Pending → Confirmed → Delivered."
                      color="blue" 
                    />
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-8 flex flex-col justify-center">
                     <h4 className="font-bold text-lg mb-4 text-blue-800">Key Buyer Features</h4>
                     <ul className="space-y-3">
                        <FeatureItem text="Marketplace Search & Filter" color="blue" />
                        <FeatureItem text="Secure Payment Gateway" color="blue" />
                        <FeatureItem text="Live Order Tracking" color="blue" />
                        <FeatureItem text="Purchase History" color="blue" />
                     </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* --- WHY DIFFERENT --- */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why <span className="text-green-600">KishanSetu</span> is Different</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional Way */}
          <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-600 mb-6 flex items-center gap-2">
              <XCircle className="text-red-500" /> Traditional Platforms
            </h3>
            <ul className="space-y-4 text-slate-600">
              <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-400 flex-shrink-0" /> Heavy reliance on middlemen</li>
              <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-400 flex-shrink-0" /> Hidden costs and lack of transparency</li>
              <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-400 flex-shrink-0" /> Delayed manual payments</li>
              <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-400 flex-shrink-0" /> Poor or non-existent order tracking</li>
            </ul>
          </div>

          {/* KishanSetu Way */}
          <div className="bg-green-50 p-8 rounded-2xl border border-green-200 shadow-lg">
            <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-green-600" /> The KishanSetu Way
            </h3>
            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> Direct Farmer-Buyer Connection</li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> Real-time Listings & Analytics</li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> Secure, Digital Transaction History</li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> Live Status Tracking (Pending to Delivered)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- HOW IT HELPS (Benefits) --- */}
      <section className="py-16 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How We Help You</h2>
          <div className="grid md:grid-cols-2 gap-12">
            
            <motion.div 
              whileHover={{ y: -5 }} 
              className="bg-slate-800 p-8 rounded-2xl border border-slate-700"
            >
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center mb-4">
                <Sprout />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Farmers</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2"><ArrowRight className="w-5 h-5 mt-1 text-green-500" /> Better price control and higher margins</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-5 h-5 mt-1 text-green-500" /> Direct access to customer base</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-5 h-5 mt-1 text-green-500" /> Reduced dependency on external agents</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-5 h-5 mt-1 text-green-500" /> Digital selling record for loans/credit</li>
              </ul>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }} 
              className="bg-slate-800 p-8 rounded-2xl border border-slate-700"
            >
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Buyers</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2"><ArrowRight className="w-5 h-5 mt-1 text-blue-500" /> Access to fresh crops directly from source</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-5 h-5 mt-1 text-blue-500" /> Transparent pricing structure</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-5 h-5 mt-1 text-blue-500" /> Reliable delivery tracking updates</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-5 h-5 mt-1 text-blue-500" /> Direct communication channel</li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- CTA / VISION --- */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-green-800 mb-6">Our Vision</h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            KishanSetu aims to digitize agriculture trading in India by empowering farmers with technology 
            and giving buyers direct access to fresh produce. We are building the future of fair trade.
          </p>
          <button onClick={()=>{navigate("/login")}} className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            Join the Revolution
          </button>
        </div>
      </section>

    </div>
  );
}

// --- SUB COMPONENTS ---

function VisionCard({ icon, title, desc }) {
  return (
    <motion.div 
      variants={fadeIn}
      whileHover={{ scale: 1.05 }}
      className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-green-500"
    >
      <div className="mb-4 bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
      <p className="text-center text-slate-600">{desc}</p>
    </motion.div>
  );
}

function ArchStep({ label, icon }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function WorkflowStep({ number, title, desc, color = "green" }) {
  const bgClass = color === "green" ? "bg-green-600" : "bg-blue-600";
  
  return (
    <motion.div variants={fadeIn} className="flex gap-4 relative z-10">
      <div className={`w-9 h-9 rounded-full ${bgClass} text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md`}>
        {number}
      </div>
      <div>
        <h4 className="font-bold text-slate-800 text-lg">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function FeatureItem({ text, color = "green" }) {
  const iconColor = color === "green" ? "text-green-600" : "text-blue-600";
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className={`w-5 h-5 ${iconColor}`} />
      <span className="text-slate-700 font-medium">{text}</span>
    </li>
  );
}