import React, { useState } from "react";
import { api } from "../services/api";

export default function BuyCropModal({ crop, onClose }) {
  const [quantityKg, setQuantityKg] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleBuy = async () => {
    await api.post("/orders/buy", {
      cropId: crop._id,
      quantityKg,
      deliveryAddress,
    });

    alert("Order placed successfully ✅");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md">
        <h2 className="text-xl font-bold">Buy {crop.name}</h2>

        <label className="block mt-3">Quantity (Kg)</label>
        <input
          type="number"
          value={quantityKg}
          onChange={(e) => setQuantityKg(Number(e.target.value))}
          className="w-full border p-2 rounded-xl"
        />

        <label className="block mt-3">Delivery Address</label>
        <textarea
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="w-full border p-2 rounded-xl"
        />

        <p className="mt-3 font-semibold">
          Total: ₹{quantityKg * crop.pricePerKg}
        </p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleBuy}
            className="flex-1 bg-green-600 text-white py-2 rounded-xl"
          >
            Confirm Purchase ✅
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 py-2 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
