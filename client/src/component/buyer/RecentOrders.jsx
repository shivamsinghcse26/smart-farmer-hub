import React from "react";

const RecentOrders = ({ orders }) => {
  const statusColor = (status) => {
    if (status === "Delivered") return "text-green-600";
    if (status === "Pending") return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-8">
      <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>

      <div className="space-y-2">
        {orders.map((o) => (
          <div
            key={o.id}
            className="flex justify-between border-b pb-2 text-sm"
          >
            <p className="font-medium">{o.id}</p>
            <p className="text-gray-600">{o.item}</p>
            <p className={`font-semibold ${statusColor(o.status)}`}>
              {o.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
