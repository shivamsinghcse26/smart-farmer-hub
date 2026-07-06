import React from "react";

const BuyerStats = ({ totalAvailableCrops, totalOrders, pendingOrders }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-white shadow rounded-xl p-4">
        <p className="text-gray-500 text-sm">Available Crops</p>
        <h2 className="text-2xl font-bold">{totalAvailableCrops}</h2>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <p className="text-gray-500 text-sm">My Orders</p>
        <h2 className="text-2xl font-bold">{totalOrders}</h2>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <p className="text-gray-500 text-sm">Pending Orders</p>
        <h2 className="text-2xl font-bold">{pendingOrders}</h2>
      </div>
    </div>
  );
};

export default BuyerStats;
