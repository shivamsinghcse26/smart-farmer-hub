import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCropDetailsForBuyer } from "../../Services/buyerApi";
import api from "../../Services/Api";

const PlaceOrder = () => {
  const { id } = useParams(); // cropId
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);

  const [formData, setFormData] = useState({
    quantityKg: 1,
    deliveryAddress: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCrop();
  }, [id]);

  const fetchCrop = async () => {
    try {
      const res = await getCropDetailsForBuyer(id);
      setCrop

      setCrop(res.data.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch crop details");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const totalPrice =
    crop && formData.quantityKg
      ? Number(formData.quantityKg) * crop.pricePerKg
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.deliveryAddress.trim())
      return alert("Delivery address required");

    try {
      setLoading(true);

      await api.post(
        "/api/v1/orders/place",
        {
          cropId: id,
          quantityKg: Number(formData.quantityKg),
          deliveryAddress: formData.deliveryAddress,
        },
        { withCredentials: true }
      );

      alert("✅ Order placed successfully!");
      navigate("/buyers/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!crop) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-1">Place Order 🧾</h1>
        <p className="text-gray-500 text-sm mb-4">
          Crop: <span className="font-semibold capitalize">{crop.cropName}</span>
        </p>

        <p className="text-sm">Price Per Kg: ₹{crop.pricePerKg}</p>
        <p className="text-sm">Available Quantity: {crop.quantity} kg</p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <input
            type="number"
            name="quantityKg"
            value={formData.quantityKg}
            onChange={handleChange}
            min={1}
            max={crop.quantity}
            className="w-full border rounded-lg p-3"
            placeholder="Quantity in KG"
          />

          <textarea
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg p-3"
            placeholder="Delivery Address"
          />

          <p className="font-bold text-green-700">
            Total Price: ₹{totalPrice}
          </p>

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Placing..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
