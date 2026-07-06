import React, { useEffect, useState } from "react";
import { 
  Megaphone, 
  Calendar, 
  ExternalLink, 
  Search, 
  Loader2, 
  FileText,
  Clock
} from "lucide-react";
import { fetchSchemes } from "../Services/schemeApi";

const Services = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      setLoading(true);
      const res = await fetchSchemes();
      setSchemes(res.data.data);
    } catch (error) {
      console.error("Failed to load schemes", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "No Deadline";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper to check if expired
  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  // Filter logic
  const filteredSchemes = schemes.filter((s) => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* 🟢 Hero Section */}
      <div className="bg-green-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Megaphone className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
            Government Schemes & Benefits
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Stay updated with the latest subsidies, welfare programs, and financial aid provided by the government for farmers.
          </p>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <div className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="bg-white p-4 rounded-xl shadow-lg flex items-center border border-gray-100">
          <Search className="w-6 h-6 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search schemes by name or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-lg outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* 📦 Content Grid */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Fetching latest schemes...</p>
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Schemes Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => {
              const expired = isExpired(scheme.deadline);

              return (
                <div
                  key={scheme._id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-green-50 p-3 rounded-xl">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      {expired ? (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                          Expired
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {scheme.title}
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {scheme.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium mr-1">Deadline:</span>
                      <span className={expired ? "text-red-500" : "text-gray-700"}>
                        {formatDate(scheme.deadline)}
                      </span>
                    </div>

                    <a
                      href={scheme.link}
                      target="_blank"
                      rel="noreferrer"className={`block w-full text-center py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        expired 
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                          : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                      }`}
                      onClick={(e) => expired && e.preventDefault()}
                    >
                      {expired ? "Application Closed" : "Apply Now"}
                      {!expired && <ExternalLink className="w-4 h-4" />}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;