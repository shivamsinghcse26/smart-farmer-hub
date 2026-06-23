import { Buyer } from "../Models/Buyer.model.js";
import { User } from "../Models/User.model.js";
import { Crop } from "../Models/Crop.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { Order } from "../Models/Order.model.js";
import mongoose from "mongoose";
/**
 * ✅ Create/Update Buyer Profile
 * Only Role === "buyer" can access
 */
const setBuyerProfile = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized access");

  const user = req.user;

  if (user.Role !== "buyer") {
    throw new ApiError(403, "Only buyer can update buyer profile");
  }

  const { Name, PhoneNo, City, State, Pincode, preferredCrops } = req.body;

  // -----------------------------
  // ✅ Update User Fields
  // -----------------------------
  const userUpdateFields = {};

  if (Name && Name.trim().length >= 2) {
    userUpdateFields.Name = Name.trim();
  }

  if (PhoneNo) {
  const existingUser = await User.findOne({ PhoneNo });

  if (existingUser && existingUser._id.toString() !== userId.toString()) {
    throw new ApiError(400, "Phone number already in use");
  }

  userUpdateFields.PhoneNo = PhoneNo;
}

  if (Object.keys(userUpdateFields).length > 0) {
    await User.findByIdAndUpdate(userId, {
      $set: userUpdateFields,
    });
  }

  // -----------------------------
  // ✅ Update / Create Buyer Profile
  // -----------------------------
  const buyerProfile = await Buyer.findOneAndUpdate(
    { userId },
    {
      $set: {
        City,
        State,
        Pincode,
        preferredCrops: preferredCrops || [],
      },
      $setOnInsert: {
        userId,
      },
    },
    { new: true, upsert: true, runValidators: true }
  ).populate("userId", "Name PhoneNo EmailId Role Avatar");

  return res.status(200).json(
    new ApiResponse(
      200,
      buyerProfile,
      "Buyer profile updated successfully ✅"
    )
  );
});

/**
 * ✅ Get Buyer Profile
 */
const getBuyerProfile = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized access");

  const buyerProfile = await Buyer.findOne({ userId }).populate(
    "userId",
    "Name EmailId PhoneNo Role Avatar"
  );

  if (!buyerProfile) {
    throw new ApiError(404, "Buyer profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, buyerProfile, "Buyer profile fetched successfully"));
});

/**
 * ✅ Buyer Dashboard
 * Shows buyer info + some marketplace stats
 */

const getBuyerDashboard = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized access");

    const BuyerProfile = await Buyer.findOne({ userId });
  
  const user = await User.findById(userId).select("Name Role");
  if (!user || user.Role !== "buyer") {
    throw new ApiError(403, "Buyer access only");
  }

  // ✅ total available crops
  const [totalAvailableCrops, totalOrders, pendingOrders] = await Promise.all([ //optimize db call using promiseAll
  Crop.countDocuments({ status: "available" }),
  Order.countDocuments({ buyerId: userId }),
  Order.countDocuments({ buyerId: userId, status: "pending" }),
]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        BuyerProfile,
        totalAvailableCrops,
        totalOrders,
        pendingOrders,
      },
      "Buyer dashboard fetched successfully ✅"
    )
  );
});

/**
 * ✅ Marketplace: Get All Available Crops
 * Buyer can filter/search
 *
 * Example:
 * /api/v1/buyers/marketplace?search=wheat&location=up&minPrice=10&maxPrice=100
 */
const getMarketplaceCrops = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized access");

  const user = await User.findById(userId).select("Role");
  if (!user || user.Role !== "buyer") {
    throw new ApiError(403, "Buyer access only");
  }

  const { search, location, minPrice, maxPrice } = req.query;

  const query = { status: "available" };//This means every query will include this condition:


  if (search) {
    query.cropName = { $regex: search.trim(), $options: "i" };
  }

  if (location) {
    query.location = { $regex: location.trim(), $options: "i" };
  }

  if (minPrice || maxPrice) {
    query.pricePerKg = {};
    if (minPrice) query.pricePerKg.$gte = Number(minPrice);
    if (maxPrice) query.pricePerKg.$lte = Number(maxPrice);
  }

  const crops = await Crop.find(query)
    .populate("farmerId", "Name PhoneNo EmailId Address") // ✅ added populate
    .sort({ createdAt: -1 })
    .limit(30);

  return res
    .status(200)
    .json(new ApiResponse(200, crops, "Marketplace crops fetched successfully"));
});


/**
 * ✅ Marketplace: Get Single Crop Details
 */
const getCropDetailsForBuyer = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Crop id is required");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid crop ID");
  }


  const crop = await Crop.findById(id).populate(
    "farmerId",
    "Name PhoneNo EmailId Address"
  );

  if (!crop) throw new ApiError(404, "Crop not found");

  return res
    .status(200)
    .json(new ApiResponse(200, crop, "Crop details fetched successfully"));
});


export {
  setBuyerProfile,
  getBuyerProfile,
  getBuyerDashboard,
  getMarketplaceCrops,
  getCropDetailsForBuyer
};
