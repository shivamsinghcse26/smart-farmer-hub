import React from "react";

const BuyerHeader = ({ name }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {name} 🛒</h1>
        <p className="text-gray-500 text-sm">Buyer Dashboard</p>
      </div>
    </div>
  );
};

export default BuyerHeader;
