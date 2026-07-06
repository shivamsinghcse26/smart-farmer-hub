import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [showBuyerPopup, setShowBuyerPopup] = useState(false);

  const handleGetStarted = () => {
    if (isLoggedIn && user) {
      const role = (user.Role || user.role || "").toLowerCase();

      if (role === "farmer") navigate("/farmers/dashboard");
      else if (role === "buyer") navigate("/buyers/dashboard");
      else navigate("/admin/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleExploreMarket = () => {
    const role = (user?.Role || user?.role || "").toLowerCase();

    if (isLoggedIn && role === "buyer") {
      navigate("/buyers/marketplace");
    } else {
      setShowBuyerPopup(true);
    }
  };

  const handleBuyerLoginRedirect = () => {
    navigate("/login", { state: { role: "buyer" } });
  };

  const tickerItems = [
    { name: "Wheat", change: "+12%", up: true },
    { name: "Rice", change: "+4.2%", up: true },
    { name: "Tomato", change: "-6.1%", up: false },
    { name: "Maize", change: "+2.8%", up: true },
    { name: "Sugarcane", change: "+1.5%", up: true },
    { name: "Onion", change: "-3.4%", up: false },
    { name: "Soybean", change: "+7.9%", up: true },
    { name: "Cotton", change: "+0.9%", up: true },
  ];

  return (
    <div className="min-h-screen bg-[#030f00] font-sans text-white overflow-x-hidden">

      {/* ===== CUSTOM ANIMATIONS ===== */}

      <style>{`

        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes floatX {
          0%,100% { transform: translateX(0); }
          50% { transform: translateX(7px); }
        }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes orb1 {
          0%,100% { transform: translate(0,0); }
          33% { transform: translate(30px,-20px); }
          66% { transform: translate(-20px,15px); }
        }

        @keyframes orb2 {
          0%,100% { transform: translate(0,0); }
          33% { transform: translate(-25px,18px); }
          66% { transform: translate(20px,-12px); }
        }

        @keyframes orb3 {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(15px,25px); }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== NEW AI ANIMATIONS ===== */

        @keyframes aiSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes aiPulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }

        @keyframes floatChat {
          0%,100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-float-y {
          animation: floatY 4s ease-in-out infinite;
        }

        .animate-float-x {
          animation: floatX 4s ease-in-out infinite;
        }

        .animate-ticker {
          animation: ticker 22s linear infinite;
        }

        .animate-orb1 {
          animation: orb1 9s ease-in-out infinite;
        }

        .animate-orb2 {
          animation: orb2 11s ease-in-out infinite;
        }

        .animate-orb3 {
          animation: orb3 8s ease-in-out infinite;
        }

        .animate-fade-up {
          animation: fadeUp 0.7s ease both;
        }

        .animate-ai-spin {
          animation: aiSpin 8s linear infinite;
        }

        .animate-ai-pulse {
          animation: aiPulse 2s infinite ease-in-out;
        }

        .animate-chat-float {
          animation: floatChat 3s infinite ease-in-out;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            #97C459,
            #1D9E75,
            #EF9F27,
            #97C459
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        /* ===== 3D CARD ===== */

        .feat-card {
          transform-style: preserve-3d;
          perspective: 1000px;
          transition: all 0.4s ease;
        }

        .feat-card:hover {
          transform: rotateX(8deg) rotateY(-8deg) scale(1.03);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.04) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
        }

      `}</style>
            {/* ==========================================
                    HERO SECTION
      ========================================== */}

      <section className="relative overflow-hidden pt-14 pb-20 px-8 lg:px-16 min-h-[480px] grid-bg">

        {/* Floating background orbs */}

        <div
          className="animate-orb1 absolute -top-20 -left-20 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,153,34,0.35) 0%, transparent 70%)",
          }}
        />

        <div
          className="animate-orb2 absolute top-10 -right-10 w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(29,158,117,0.28) 0%, transparent 70%)",
          }}
        />

        <div
          className="animate-orb3 absolute -bottom-10 left-1/2 w-56 h-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(186,117,23,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}

        <div className="animate-fade-up mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs border"
            style={{
              background: "rgba(99,153,34,0.15)",
              borderColor: "rgba(99,153,34,0.4)",
              color: "#97C459",
            }}
          >
            🌱 The future of Indian agriculture
          </span>
        </div>

        {/* Heading */}

        <h1 className="animate-fade-up text-5xl lg:text-6xl font-medium leading-tight mb-4">

          Empowering{" "}

          <span className="animate-shimmer">
            Farmers
          </span>

          <br />

          & Buyers

        </h1>

        {/* Description */}

        <p
          className="text-[15px] leading-relaxed max-w-md mb-8"
          style={{
            color: "rgba(255,255,255,0.55)",
          }}
        >
          The all-in-one digital mandi. Sell produce at fair prices,
          access government schemes, and get expert AI advice instantly.
        </p>

        {/* Buttons */}

        <div className="flex flex-wrap gap-4 mb-10">

          <button
            onClick={handleGetStarted}
            className="px-7 py-3 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
            style={{
              background: "#639922",
              boxShadow: "0 0 24px rgba(99,153,34,0.5)",
            }}
          >
            🌾 {isLoggedIn ? "Go to Dashboard" : "Get Started"}
          </button>

          <button
            onClick={handleExploreMarket}
            className="px-7 py-3 rounded-xl text-sm border transition-all hover:scale-105"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            🛒 Explore Market
          </button>

        </div>

        {/* Floating stats */}

        <div className="flex flex-wrap gap-4">

          <div
            className="animate-float-y px-4 py-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.06)",
            }}
          >
            👨‍🌾 50+ Farmers
          </div>

          <div
            className="animate-float-x px-4 py-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.06)",
            }}
          >
            ₹10k+ Transactions
          </div>

          <div
            className="animate-float-y px-4 py-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.06)",
            }}
          >
            ⚡ 24/7 Support
          </div>

        </div>
      </section>



      {/* ==========================================
                  LIVE PRICE TICKER
      ========================================== */}

      <div
        className="overflow-hidden py-3"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >

        <div className="animate-ticker flex whitespace-nowrap w-max">

          {[...tickerItems, ...tickerItems].map((item, i) => (

            <span
              key={i}
              className="inline-flex items-center gap-2 px-8 text-sm"
              style={{
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {item.name}

              <span
                style={{
                  color: item.up ? "#97C459" : "#E24B4A",
                }}
              >
                {item.up ? "▲" : "▼"} {item.change}
              </span>

              |

            </span>

          ))}

        </div>

      </div>



      {/* ==========================================
             FLOATING AI CHAT PREMIUM POPUP
      ========================================== */}

      <div
        className="absolute top-50 right-50 animate-chat-float"
      >

        <div
          className="p-4 rounded-2xl max-w-xs"
          style={{
            background: "rgba(5,25,15,0.95)",
            border: "1px solid rgba(29,158,117,0.4)",
            boxShadow: "0 0 30px rgba(29,158,117,0.25)",
          }}
        >

          <div className="flex gap-3 items-start">

            {/* AI Orb */}

            <div className="relative w-10 h-10">

              <div className="absolute inset-0 rounded-full bg-green-500 blur-lg animate-ai-pulse"></div>

              <div
                className="relative w-full h-full rounded-full flex items-center justify-center text-xl
                bg-gradient-to-br from-green-400 to-emerald-700 animate-ai-spin"
              >
                🤖
              </div>

            </div>

            {/* Message */}

            <div>

              <p
                className="text-sm"
                style={{ color: "#9FE1CB" }}
              >
                👋 Hello Farmer
              </p>

              <p
                className="text-xs mt-1"
                style={{
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                I am <strong>Krishi AI</strong>
                <br />
                Ask me about crops, weather,
                mandi prices & farming help.
              </p>

            </div>

          </div>

        </div>

      </div>
            {/* ==========================================
                    HOW IT WORKS
      ========================================== */}

      <section className="px-8 lg:px-16 py-16">

        <p
          className="text-xs uppercase mb-2"
          style={{ color: "#639922" }}
        >
          How it works
        </p>

        <h2 className="text-3xl font-medium mb-2">
          Farm to Fork in 3 Steps
        </h2>

        <p
          className="text-sm mb-10"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          We simplify agriculture supply chain with technology.
        </p>

        <div className="grid md:grid-cols-3 gap-4">

          {[
            {
              num: "01",
              icon: "📝",
              title: "Register & List",
              desc: "Create profile and upload crop details instantly."
            },
            {
              num: "02",
              icon: "🤝",
              title: "Connect & Negotiate",
              desc: "Buyers connect directly with farmers securely."
            },
            {
              num: "03",
              icon: "💰",
              title: "Deliver & Earn",
              desc: "Receive instant payments after successful delivery."
            }
          ].map((step) => (

            <div
              key={step.num}
              className="rounded-2xl p-7 transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >

              <div className="text-4xl mb-4">
                {step.icon}
              </div>

              <h3 className="text-lg mb-2">
                {step.title}
              </h3>

              <p
                className="text-sm"
                style={{
                  color: "rgba(255,255,255,0.5)"
                }}
              >
                {step.desc}
              </p>

            </div>

          ))}

        </div>

      </section>



      {/* ==========================================
                    FEATURES SECTION
      ========================================== */}

      <section className="px-8 lg:px-16 pb-16">

        <p
          className="text-xs uppercase mb-2"
          style={{ color: "#639922" }}
        >
          Our Ecosystem
        </p>

        <h2 className="text-3xl font-medium mb-2">
          Tools For Modern Farming
        </h2>

        <p
          className="text-sm mb-10"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Everything farmers need in one platform.
        </p>

        <div className="grid md:grid-cols-2 gap-4">

          {[
            {
              icon: "🏷️",
              title: "Direct Selling",
              desc: "Sell crops directly. Zero middlemen and full transparency.",
              bg: "linear-gradient(135deg,#0a2800,#1a4500)",
              iconBg: "rgba(99,153,34,0.2)"
            },

            {
              icon: "📜",
              title: "Govt Schemes",
              desc: "Find latest government subsidies and agriculture schemes.",
              bg: "linear-gradient(135deg,#120a00,#2d1e00)",
              iconBg: "rgba(186,117,23,0.2)"
            },

            {
              icon: "🤖",
              title: "Krishi AI Assistant",
              desc: "Ask crop disease, weather, mandi prices & farming questions instantly.",
              bg: "linear-gradient(135deg,#001810,#00362a)",
              iconBg: "rgba(29,158,117,0.2)"
            },

            {
              icon: "🚚",
              title: "Smart Logistics",
              desc: "Track deliveries and manage secure digital payments.",
              bg: "linear-gradient(135deg,#08050f,#16103a)",
              iconBg: "rgba(127,119,221,0.2)"
            }

          ].map((f) => (

            <div
              key={f.title}
              className="feat-card rounded-2xl p-7 relative overflow-hidden"
              style={{
                background: f.bg,
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >

              {/* AI SPECIAL CARD */}

              {f.title === "Krishi AI Assistant" ? (

                <div className="relative w-16 h-16 mb-4">

                  <div
                    className="absolute inset-0 rounded-full
                    bg-green-500 blur-xl animate-ai-pulse"
                  ></div>

                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center text-2xl
                    bg-gradient-to-br from-green-400 to-emerald-700 animate-ai-spin"
                  >
                    🤖
                  </div>

                </div>

              ) : (

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{
                    background: f.iconBg
                  }}
                >
                  {f.icon}
                </div>

              )}

              <h3 className="text-lg mb-2">
                {f.title}
              </h3>

              <p
                className="text-sm"
                style={{
                  color: "rgba(255,255,255,0.55)"
                }}
              >
                {f.desc}
              </p>

            </div>

          ))}

        </div>

      </section>
            {/* ==========================================
                      STATS
      ========================================== */}

      <section className="px-8 lg:px-16 pb-16">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[
            { val: "50+", label: "Active Farmers" },
            { val: "₹10k+", label: "Transactions" },
            { val: "30+", label: "Govt Schemes" },
            { val: "24/7", label: "Support" }
          ].map((item) => (

            <div
              key={item.label}
              className="rounded-2xl p-6 text-center transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >

              <div className="text-3xl font-semibold">
                {item.val}
              </div>

              <div
                className="text-xs uppercase mt-2"
                style={{
                  color: "rgba(255,255,255,0.45)"
                }}
              >
                {item.label}
              </div>

            </div>

          ))}

        </div>

      </section>



      {/* ==========================================
                      CTA SECTION
      ========================================== */}

      <section className="px-8 lg:px-16 pb-16">

        <div
          className="rounded-3xl py-14 px-10 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,#071a00 0%,#0d2f08 45%,#061510 100%)",
            border: "1px solid rgba(99,153,34,0.2)"
          }}
        >

          <h2 className="text-3xl mb-4">
            Ready To Harvest Better Profits?
          </h2>

          <p
            className="text-sm mb-8"
            style={{
              color: "rgba(255,255,255,0.5)"
            }}
          >
            Join Indian farmers using technology for smarter farming.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">

            <button
              onClick={handleGetStarted}
              className="px-7 py-3 rounded-xl text-sm font-medium text-white hover:scale-105 transition-all"
              style={{
                background: "#639922"
              }}
            >
              🌾 Join Now Free
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="px-7 py-3 rounded-xl border hover:scale-105 transition-all"
              style={{
                borderColor: "rgba(255,255,255,0.2)"
              }}
            >
              📞 Contact Support
            </button>

          </div>

        </div>

      </section>



      {/* ==========================================
                        FOOTER
      ========================================== */}

      <footer
        className="px-8 lg:px-16 pt-12 pb-6"
        style={{
          background: "#000",
          borderTop: "1px solid rgba(255,255,255,0.08)"
        }}
      >

        <div className="grid md:grid-cols-3 gap-10 mb-10">

          <div>

            <h3 className="text-lg mb-3">
              🌱 KishanSetu
            </h3>

            <p
              className="text-sm"
              style={{
                color: "rgba(255,255,255,0.45)"
              }}
            >
              Building India’s strongest agriculture ecosystem through technology.
            </p>

          </div>

          <div>

            <h4 className="mb-3">
              Quick Links
            </h4>

            <div
              className="space-y-2 text-sm"
              style={{
                color: "rgba(255,255,255,0.45)"
              }}
            >
              <p>Marketplace</p>
              <p>Govt Schemes</p>
              <p>AI Assistant</p>
            </div>

          </div>

          <div>

            <h4 className="mb-3">
              Contact
            </h4>

            <div
              className="space-y-2 text-sm"
              style={{
                color: "rgba(255,255,255,0.45)"
              }}
            >
              <p>📧 help@kishansetu.in</p>
              <p>📞 1800-KISHAN</p>
              <p>📍 Noida, India</p>
            </div>

          </div>

        </div>

        <div
          className="pt-6 text-center text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.3)"
          }}
        >
          © {new Date().getFullYear()} KishanSetu — Made in India 🇮🇳
        </div>

      </footer>



      {/* ==========================================
                  BUYER LOGIN POPUP
      ========================================== */}

      {showBuyerPopup && (

        <div
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          style={{
            background: "rgba(0,0,0,0.8)"
          }}
          onClick={() => setShowBuyerPopup(false)}
        >

          <div
            className="w-full max-w-sm rounded-2xl p-8 text-center mx-4"
            style={{
              background: "#0d1f05",
              border: "1px solid rgba(99,153,34,0.35)"
            }}
            onClick={(e) => e.stopPropagation()}
          >

            <div className="text-4xl mb-4">
              🛒
            </div>

            <h2 className="text-lg mb-3">
              Access Marketplace
            </h2>

            <p
              className="text-sm mb-6"
              style={{
                color: "rgba(255,255,255,0.5)"
              }}
            >
              Marketplace is only for buyers. Login as buyer first.
            </p>

            <button
              onClick={handleBuyerLoginRedirect}
              className="w-full py-3 rounded-xl mb-3"
              style={{
                background: "#639922"
              }}
            >
              Login As Buyer
            </button>

            <button
              onClick={() => setShowBuyerPopup(false)}
              className="text-sm"
              style={{
                color: "rgba(255,255,255,0.5)"
              }}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Home;