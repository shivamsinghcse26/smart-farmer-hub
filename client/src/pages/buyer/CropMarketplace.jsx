import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import CropCard from "../components/CropCard";
import BuyCropModal from "../components/BuyCropModal";

export default function CropMarketplace() {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const fetchCrops = async () => {
    const res = await api.get("/api/v1/crops");
    setCrops(res.data.data);
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Crop Marketplace 🌾</h1>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {crops.map((crop) => (
          <CropCard key={crop._id} crop={crop} onBuy={() => setSelectedCrop(crop)} />
        ))}
      </div>

      {selectedCrop && (
        <BuyCropModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
      )}
    </div>
  );
}
