import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { User } from "../Models/User.model.js";
import { Order } from "../Models/Order.model.js";

const getFarmerTransactions = AsyncHandler(async (req, res) => {
  const farmerId = req.user?._id;

  const user = await User.findById(farmerId).select("Role Name");
  if (!user || user.Role !== "farmer") {
    throw new ApiError(403, "Farmer access only");
  }

  // ✅ Only delivered orders are actual earnings
  const transactions = await Order.find({
    farmerId,
    status: "delivered",
  })
    .populate("buyerId", "Name PhoneNo EmailId")
    .populate("cropId", "cropName location pricePerKg")
    .sort({ createdAt: -1 });

  const totalEarnings = transactions.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalEarnings,
        transactions,
      },
      "Farmer transactions fetched ✅"
    )
  );
});

const getBuyerTransactions = AsyncHandler(async (req, res) => {
  const buyerId = req.user?._id;

  const user = await User.findById(buyerId).select("Role Name");
  if (!user || user.Role !== "buyer") {
    throw new ApiError(403, "Buyer access only");
  }

  const transactions = await Order.find({
    buyerId,
  })
    .populate("farmerId", "Name PhoneNo EmailId")
    .populate("cropId", "cropName location pricePerKg")
    .sort({ createdAt: -1 });

  const totalSpent = transactions.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSpent,
        transactions,
      },
      "Buyer transactions fetched ✅"
    )
  );
});

export { getFarmerTransactions, getBuyerTransactions };
