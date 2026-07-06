import React, { useEffect, useState } from "react";
import { getMarketplaceCrops } from "../../Services/buyerApi.js";
import CropGridBuyer from "../../component/buyer/CropGridBuyer";

const Marketplace = () => {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await getMarketplaceCrops({ search });
      setCrops(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Marketplace 🌾</h1>

      <div className="flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
          placeholder="Search crop name..."
        />
        <button
          onClick={fetchCrops}
          className="bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      <CropGridBuyer crops={crops} />
    </div>
  );
};

export default Marketplace;
