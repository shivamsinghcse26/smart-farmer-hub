import React from "react";

const BuyerSearchBar = ({ search, setSearch, filter, setFilter }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 mt-5">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search crops..."
          className="w-full border rounded-lg px-4 py-2"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-52 border rounded-lg px-3 py-2"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="reserved">Reserved</option>
        </select>

        <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
          Filter
        </button>
      </div>
    </div>
  );
};

export default BuyerSearchBar;
