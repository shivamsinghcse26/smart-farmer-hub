import { Farmer } from "../Models/Farmer.model.js";
import { User } from "../Models/User.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { Crop } from "../Models/Crop.model.js";
import { Order } from "../Models/Order.model.js";
const setFarmerProfile = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: user not found");
  }

  const user = await User.findById(userId);
  if (!user || user.Role !== "farmer") {
    throw new ApiError(403, "Only farmer can create profile");
  }

  const { LandSize, CropGrown, Experience, Location } = req.body;

  if (!LandSize || !Location) {
    throw new ApiError(403, "Land size and location is required");
  }

  const farmer = await Farmer.findOneAndUpdate(
    { userId },
    {
       userId,
        LandSize,
        CropGrown,
        Experience,
        Location,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, farmer, "Farmer profile saved successfully"));
});

const getFarmerProfile=AsyncHandler(async(req,res)=>{
    
    const userId=req.user._id;
    const farmer=await Farmer.findOne({userId}).populate(
        "userId",
        "Name PhoneNo EmailId"
    );

    if(!farmer){
        throw new ApiError(404,"farmer not exists");
    }

    return res.status(200).json(
        new ApiResponse(200,farmer,"Farmer profile fetched")
    );
});

const getFarmerDashboard = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1️⃣ Validate user
  const user = await User.findById(userId).select("Name Role Avatar");

  if (!user || user.Role !== "farmer") {
    throw new ApiError(403, "Farmer access only");
  }

  // 2️⃣ Fetch farmer profile
  const farmerProfile = await Farmer.findOne({ userId });

  // 3️⃣ Fetch crops listed by farmer
  const crops = await Crop.find({ farmerId: userId }).sort({
    createdAt: -1
  });

  // 4️⃣ Calculate stats
  const totalCrops = crops.length;
  const activeCrops = crops.filter(
    (crop) => crop.status === "available"
  ).length;

  const deliveredOrders = await Order.find({ farmerId: userId, status: "delivered" });

const earnings = deliveredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);


  // 5️⃣ Send response (MATCHES FRONTEND)
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        farmerProfile,
        totalCrops,
        activeCrops,
        crops,
        earnings

      },
      "Farmer dashboard fetched successfully"
    )
  );
});
export {setFarmerProfile,getFarmerProfile,getFarmerDashboard};