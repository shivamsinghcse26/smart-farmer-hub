// ContactUs.jsx
import  { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can integrate backend API here for sending messages
    alert("Message sent! We will contact you shortly.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-start py-10">
      <h1 className="text-4xl font-bold text-green-800 mb-6">Contact Us</h1>
      <p className="text-center text-gray-700 mb-10 max-w-2xl">
        Have questions about crops, schemes, or our services? Reach out to us! 
        Our team at <span className="font-semibold">KisanSetu</span> is always ready to assist farmers.
      </p>

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
        {/* Contact Info */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-2xl font-semibold text-green-700">Get in Touch</h2>
          <p className="text-gray-600">
            <strong>Phone:</strong> +91 95xxxxx685
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> <a href="mailto:smartfarmer.care@gmail.com" className="text-green-700 underline">smartfarmer.care@gmail.com</a>
          </p>
         
          <p className="text-gray-600">
            <strong>Address:</strong> Noida Uttar Pradesh U.P
          </p>
          <div>
            <h3 className="text-green-700 font-semibold mb-2">References</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li><a href="https://farmer.gov.in/" target="_blank" rel="noreferrer" className="underline text-green-600">Farmer Government Portal</a></li>
              <li><a href="https://agriculture.gov.in/" target="_blank" rel="noreferrer" className="underline text-green-600">Ministry of Agriculture</a></li>
              <li><a href="https://www.soilhealth.dac.gov.in/" target="_blank" rel="noreferrer" className="underline text-green-600">Soil Health Card</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32 resize-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
