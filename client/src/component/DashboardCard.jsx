const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
};

export default DashboardCard;
