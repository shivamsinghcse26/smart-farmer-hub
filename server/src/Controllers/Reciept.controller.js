import { Order } from "../Models/Order.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
export const getReceipt = AsyncHandler(async (req, res) => {
  const buyerId = req.user._id;
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, buyer: buyerId })
    .populate("buyer", "Name EmailId PhoneNo Address")
    .populate("crop", "name category location quality")
    .populate("farmer", "Name PhoneNo Address")
    .select("-__v");

  if (!order) throw new ApiError(404, "Order not found");

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Receipt fetched successfully ✅"));
});
