import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { User } from "../Models/User.model.js";
import { Crop } from "../Models/Crop.model.js";
import { Farmer } from "../Models/Farmer.model.js";
import mongoose from "mongoose";
// Admin Dashboard Stats
const getAdminDashboard = AsyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalFarmers = await User.countDocuments({ Role: "farmer" });
  const totalBuyers = await User.countDocuments({ Role: "buyer" });
  const totalCrops = await Crop.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200,
      { totalUsers, totalFarmers, totalBuyers, totalCrops },
      "Admin dashboard data fetched"
    )
  );
});

//  Get all users
const getAllUsers = AsyncHandler(async (req, res) => {
  const users = await User.find().select("-Password -RefreshToken").sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, users, "All users fetched successfully")
  );
});

//  Get all crops
const getAllCrops = AsyncHandler(async (req, res) => {
  
    const crops = await Crop.find()
      .populate("farmerId", "Name"); // fetch only Name field

    return res.status(200).json(
      new ApiResponse(200,crops,"All crops fetched")
     
    );
  
    
  
});

// Delete any crop (admin power)
const deleteCropByAdmin = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if(!mongoose.Types.ObjectId.isValid(id))
   throw new ApiError(400,"Invalid ID")

  const crop = await Crop.findByIdAndDelete(id);
  if (!crop) throw new ApiError(404, "Crop not found");

  return res.status(200).json(
    new ApiResponse(200, {}, "Crop deleted by admin successfully")
  );
});

// block and un-block farmer
const toggleBlockUser = AsyncHandler(async (req, res) => {
  const { id } = req.params;
if (!mongoose.Types.ObjectId.isValid(id)) {
  throw new ApiError(400, "Invalid user id");
}
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  user.isBlocked = !user.isBlocked;
  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      user.isBlocked ? "User blocked successfully" : "User unblocked successfully"
    )
  );
});

//  Get All Farmers (for verification approval)
const getAllFarmersForAdmin = AsyncHandler(async (req, res) => {
  const farmers = await Farmer.find()
    .populate("userId", "Name EmailId PhoneNo Role")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, farmers, "Farmers fetched successfully")
  );
});

//  Approve / Reject Farmer Verification
const verifyFarmer = AsyncHandler(async (req, res) => {
  const { id } = req.params; // farmer profile id
  if (!mongoose.Types.ObjectId.isValid(id)) {
  throw new ApiError(400, "Invalid user id");
}
  const { verified } = req.body; // true / false
  if(typeof verified !== "boolean"){
   throw new ApiError(
      400,
      "verified must be true or false"
   )
}

  const farmers = await Farmer.findById(id);
  if (!farmers) throw new ApiError(404, "Farmer profile not found");

  farmers.verified = verified;
  await farmers.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      farmers,
      verified ? "Farmer verified successfully" : "Farmer verification rejected"
    )
  );
});


export {
  getAdminDashboard,
  getAllUsers,
  getAllCrops,
  deleteCropByAdmin,
  toggleBlockUser,
  getAllFarmersForAdmin,
  verifyFarmer,

};
