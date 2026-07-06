import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  ExternalLink, 
  FileText, 
  X, 
  Loader2, 
  Search 
} from "lucide-react";

import AdminSidebar from "../../component/admin/AdminSlidebar";
import {
  getAllSchemes,
  createScheme,
  deleteScheme,
} from "../../Services/adminSchemeApi";

const AdminSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    link: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const res = await getAllSchemes();
      setSchemes(res.data.data);
    } catch (error) {
      toast.error("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddScheme = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.deadline) {
      return toast.error("Please fill in all required fields");
    }

    setSubmitting(true);
    try {
      await createScheme(formData);
      toast.success("Scheme created successfully!");
      setFormData({ title: "", description: "", deadline: "", link: "" });
      setIsModalOpen(false);
      fetchSchemes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create scheme");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scheme?")) return;

    try {
      await deleteScheme(id);
      toast.success("Scheme deleted");
      fetchSchemes();
    } catch (error) {
      toast.error("Failed to delete scheme");
    }
  };

  // Filter schemes based on search
  const filteredSchemes = schemes.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <Toaster position="top-right" />

      <div className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Government Schemes</h1>
            <p className="text-gray-500 mt-1">Manage and announce new welfare programs</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-md transition-all"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Scheme
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center border border-gray-100">
          <Search className="text-gray-400 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map((s) => (
                <div
                  key={s._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col justify-between h-full group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Delete Scheme"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {s.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {s.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                      <span className="font-medium">Deadline:</span>
                      <span className="ml-1 text-gray-700">
                        {new Date(s.deadline).toLocaleDateString()}
                      </span>
                    </div>

                    {s.link && (
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex justify-center items-center bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200"
                      >
                        Visit Official Page <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No schemes found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Scheme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Add New Scheme</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddScheme} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., PM Kisan Yojana"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Details about eligibility and benefits..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Official Link (Optional)</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://gov.in/scheme"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all flex justify-center items-center"
                >
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...</>
                  ) : (
                    "Publish Scheme"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchemes;