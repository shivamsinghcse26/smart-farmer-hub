
import mongoose from "mongoose";
const CropSchema = new mongoose.Schema(
  {
    farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  cropName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [2, "Crop name must be at least 2 characters"],
    maxlength: [50, "Crop name is too long"]
  },

  quantity: {
    type: Number,
    required: true,
    min: [0, "Quantity must be at least 1 kg"],
    max: [100000, "Quantity seems unrealistic"]
  },

  pricePerKg: {
    type: Number,
    required: true,
    min: [1, "Price must be at least ₹1"],
    max: [100000, "Price seems unrealistic"]
  },

  location: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "Location must be at least 2 characters"],
    maxlength: [100, "Location is too long"]
  },

  availableFrom: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["available", "sold", "reserved"],
    default: "available"
  },

   image: {
      type: String,
      default: "",
    },
},
  {
    timestamps: true, // creates createdAt & updatedAt
  }
);
export const Crop=mongoose.model("crop",CropSchema);
